#!/usr/bin/env bash
# Switch the live site back to an earlier release (instant, no rebuild). Run as the app user.
#   bash /var/www/nexea-holding/repo/deploy/rollback.sh                # previous release
#   bash /var/www/nexea-holding/repo/deploy/rollback.sh 20261011-...   # a specific release folder name
# Releases are listed newest first with:  ls -1t /var/www/nexea-holding/releases
set -Eeuo pipefail

BASE="${NEXEA_BASE:-/var/www/nexea-holding}"
REL_DIR="$BASE/releases"
APP_NAME="nexea-holding"
HEALTH_URL="http://127.0.0.1:3700"

[ "$(id -u)" -ne 0 ] || { echo "Do not run as root; use the app user." >&2; exit 1; }
CUR="$(readlink -f "$BASE/current" 2>/dev/null || true)"

if [ "${1:-}" != "" ]; then
  TARGET="$REL_DIR/$1"
  [ -d "$TARGET" ] || { echo "No such release: $1" >&2; exit 1; }
else
  TARGET="$(ls -1dt "$REL_DIR"/*/ | sed 's#/$##' | grep -vxF "$CUR" | head -n 1 || true)"
  [ -n "$TARGET" ] || { echo "There is no earlier release to roll back to." >&2; exit 1; }
fi

echo "Rolling back: $(basename "$CUR") -> $(basename "$TARGET")"
ln -sfn "$TARGET" "$BASE/current.new"
mv -Tf "$BASE/current.new" "$BASE/current"
pm2 startOrReload "$BASE/current/deploy/ecosystem.config.cjs" --update-env
pm2 save >/dev/null

for i in $(seq 1 40); do
  if curl -fsS -m 5 -o /dev/null "$HEALTH_URL/"; then
    echo "Healthy. Now serving commit: $(cat "$BASE/current/.release-commit" 2>/dev/null || echo unknown)"
    exit 0
  fi
  sleep 1
done
echo "The rolled-back release did not respond. Check: pm2 logs $APP_NAME" >&2
exit 1
