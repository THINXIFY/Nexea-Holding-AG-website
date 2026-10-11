#!/usr/bin/env bash
# Rollback-safe, release-based deployment of Nexea Holding AG from GitHub `main`.
# Run as the dedicated app user (NOT root):   bash /var/www/nexea-holding/repo/deploy/deploy.sh
#
# Layout (all under $BASE, default /var/www/nexea-holding):
#   repo/        git clone used only as a fetch source (never edited, never hard-reset)
#   releases/    one folder per deployment: <timestamp>-<short-commit>
#   current      symlink to the live release (switched atomically)
#   shared/      persistent across deployments: .env.local (secrets), data/ (OTP store), documents/ (private PDFs), logs/
#
# Flags:  --force   redeploy even if main is already deployed
#         --status  show the deployed commit, releases and PM2 state, then exit
#
# Safe by design: a failed build or failed health check leaves the previous release serving traffic
# (or switches back to it automatically). Nothing in shared/ is ever touched.
set -Eeuo pipefail

BASE="${NEXEA_BASE:-/var/www/nexea-holding}"
REPO_URL="${NEXEA_REPO_URL:-https://github.com/THINXIFY/Nexea-Holding-AG-website.git}"
BRANCH="${NEXEA_BRANCH:-main}"
PORT=3700
APP_NAME="nexea-holding"
KEEP_RELEASES="${KEEP_RELEASES:-3}"      # 0 = never prune old releases
HEALTH_URL="http://127.0.0.1:${PORT}"

REPO="$BASE/repo"
REL_DIR="$BASE/releases"
SHARED="$BASE/shared"
FORCE=0

log()  { printf '\033[1;34m[deploy]\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m[deploy] ERROR:\033[0m %s\n' "$*" >&2; exit 1; }

current_commit() { [ -f "$BASE/current/.release-commit" ] && cat "$BASE/current/.release-commit" || echo "none"; }

status() {
  echo "Deployed commit : $(current_commit)"
  echo "Current release : $(readlink "$BASE/current" 2>/dev/null || echo none)"
  echo "Releases        :"; ls -1t "$REL_DIR" 2>/dev/null | sed 's/^/  /' || true
  if command -v pm2 >/dev/null && pm2 describe "$APP_NAME" >/dev/null 2>&1; then pm2 describe "$APP_NAME" | grep -E "status|uptime|restarts|script path|exec cwd" || true; else echo "PM2 process '$APP_NAME' not found"; fi
  echo "Local response  : $(curl -s -o /dev/null -w '%{http_code}' -m 5 "$HEALTH_URL/" || echo unreachable)"
}

for arg in "$@"; do
  case "$arg" in
    --force)  FORCE=1 ;;
    --status) status; exit 0 ;;
    *) fail "unknown option: $arg" ;;
  esac
done

health_ok() {
  local i
  for i in $(seq 1 40); do
    if curl -fsS -m 5 -o /tmp/nexea-health.html "$HEALTH_URL/" 2>/dev/null \
       && grep -q "Nexea" /tmp/nexea-health.html \
       && [ "$(curl -s -o /dev/null -w '%{http_code}' -m 5 "$HEALTH_URL/sitemap.xml")" = "200" ]; then
      return 0
    fi
    sleep 1
  done
  return 1
}

start_pm2() {
  pm2 startOrReload "$BASE/current/deploy/ecosystem.config.cjs" --update-env
  pm2 save >/dev/null
}

# ---------- pre-flight
[ "$(id -u)" -ne 0 ] || fail "do not run as root; use the dedicated app user (see README)."
for c in git node npm curl tar pm2; do command -v "$c" >/dev/null || fail "'$c' is not installed."; done
node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>20||(a===20&&b>=9)?0:1)' \
  || fail "Node $(node -v) is too old; Next.js 16 needs >= 20.9 (Node 22 LTS recommended)."
[ -f "$SHARED/.env.local" ] || fail "missing $SHARED/.env.local - run deploy/server-setup.sh first."
[ "$(stat -c '%a' "$SHARED/.env.local")" = "600" ] || fail "$SHARED/.env.local must have mode 600."
mkdir -p "$REL_DIR" "$SHARED/logs"

# ---------- source
if [ ! -d "$REPO/.git" ]; then
  log "cloning $REPO_URL"
  git clone --branch "$BRANCH" --single-branch "$REPO_URL" "$REPO"
fi
[ "$(git -C "$REPO" remote get-url origin)" = "$REPO_URL" ] || fail "repo remote is not $REPO_URL; refusing to continue."
[ -z "$(git -C "$REPO" status --porcelain)" ] || fail "the source clone at $REPO has local changes; it must stay pristine (no reset will be attempted)."

log "fetching origin/$BRANCH"
git -C "$REPO" fetch --prune origin "$BRANCH"
COMMIT="$(git -C "$REPO" rev-parse "origin/$BRANCH")"
SHORT="${COMMIT:0:7}"
if [ "$FORCE" -eq 0 ] && [ "$(current_commit)" = "$COMMIT" ] && pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  log "already running $COMMIT - nothing to do (use --force to redeploy)"
  exit 0
fi

# ---------- build a new release next to the live one
ID="$(date +%Y%m%d-%H%M%S)-$SHORT"
NEW="$REL_DIR/$ID"
PREV_TARGET="$(readlink "$BASE/current" 2>/dev/null || true)"

cleanup_failed() { [ -n "${NEW:-}" ] && [ -d "$NEW" ] && [ "${SWITCHED:-0}" -eq 0 ] && { log "removing the incomplete release $ID"; rm -rf -- "$NEW"; }; }
trap cleanup_failed ERR

log "exporting $SHORT -> $NEW"
mkdir -p "$NEW"
git -C "$REPO" archive --format=tar "$COMMIT" | tar -x -C "$NEW"
echo "$COMMIT" > "$NEW/.release-commit"
ln -s "$SHARED/.env.local" "$NEW/.env.local"

log "installing dependencies (npm ci)"
( cd "$NEW" && npm ci --no-audit --no-fund )
log "building (next build)"
( cd "$NEW" && NODE_ENV=production npm run build )

# ---------- switch
log "switching 'current' to $ID"
SWITCHED=1
ln -sfn "$NEW" "$BASE/current.new"
mv -Tf "$BASE/current.new" "$BASE/current"
start_pm2

log "waiting for the application on $HEALTH_URL"
if health_ok; then
  log "healthy"
else
  log "HEALTH CHECK FAILED - rolling back"
  if [ -n "$PREV_TARGET" ] && [ -d "$PREV_TARGET" ]; then
    ln -sfn "$PREV_TARGET" "$BASE/current.new"; mv -Tf "$BASE/current.new" "$BASE/current"
    start_pm2 || true
    health_ok && log "rolled back to $(basename "$PREV_TARGET")" || log "rollback restarted but did not respond: check 'pm2 logs $APP_NAME'"
  else
    log "no previous release to roll back to; check 'pm2 logs $APP_NAME'"
  fi
  fail "deployment of $SHORT failed (the failed release is kept in $NEW for inspection)."
fi
trap - ERR

# ---------- housekeeping (only ever removes old folders inside $REL_DIR)
if [ "$KEEP_RELEASES" -gt 0 ]; then
  ls -1dt "$REL_DIR"/*/ 2>/dev/null | tail -n +"$((KEEP_RELEASES + 1))" | while read -r old; do
    old="${old%/}"
    case "$old" in "$REL_DIR"/*) [ "$old" != "$(readlink -f "$BASE/current")" ] && { log "pruning old release $(basename "$old")"; rm -rf -- "$old"; } ;; esac
  done
fi

log "deployed commit $COMMIT"
status
