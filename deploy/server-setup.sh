#!/usr/bin/env bash
# One-time, idempotent preparation of the Hostinger VPS for Nexea Holding AG. Run as root.
#
# What it does:  creates a dedicated non-root user, the directory layout, a locked-down server-side
#                environment file (only if missing), and prints a read-only report of the server.
# What it never does: stop/replace anything, touch other sites, touch nginx, DNS, firewall or PM2,
#                install packages, or overwrite an existing file.
set -Eeuo pipefail

BASE="${NEXEA_BASE:-/var/www/nexea-holding}"
APP_USER="${NEXEA_USER:-nexea}"
PORT=3700

[ "$(id -u)" -eq 0 ] || { echo "Run this script as root (sudo bash deploy/server-setup.sh)." >&2; exit 1; }

echo "== Server report (read-only)"
. /etc/os-release 2>/dev/null && echo "OS:        $PRETTY_NAME"
echo "Node:      $(command -v node >/dev/null && node -v || echo 'NOT INSTALLED (need >= 20.9; Node 22 LTS recommended)')"
echo "npm:       $(command -v npm >/dev/null && npm -v || echo 'not installed')"
echo "git:       $(command -v git >/dev/null && git --version || echo 'NOT INSTALLED')"
echo "pm2:       $(command -v pm2 >/dev/null && pm2 -v || echo 'not installed')"
echo "nginx:     $(command -v nginx >/dev/null && nginx -v 2>&1 || echo 'NOT INSTALLED')"
echo "certbot:   $(command -v certbot >/dev/null && certbot --version 2>&1 || echo 'not installed')"
echo "Memory:    $(free -h | awk '/^Mem:/{print $2" total, "$7" available"}')   Swap: $(free -h | awk '/^Swap:/{print $2}')"
echo "Disk (/):  $(df -h / | awk 'NR==2{print $4" free of "$2}')"
if ss -ltn 2>/dev/null | awk '{print $4}' | grep -qE "[:.]${PORT}$"; then
  echo "PORT ${PORT}: ALREADY IN USE - stop here and choose another port (nothing was changed)." >&2
  exit 1
else
  echo "Port ${PORT}: free"
fi
echo "Listening: $(ss -ltn 2>/dev/null | awk 'NR>1{print $4}' | sed 's/.*://' | sort -un | tr '\n' ' ')"
[ -d /etc/nginx/sites-enabled ] && echo "nginx sites enabled: $(ls /etc/nginx/sites-enabled | tr '\n' ' ')"
echo "Existing PM2 apps (root): $(command -v pm2 >/dev/null && pm2 jlist 2>/dev/null | grep -o '"name":"[^"]*"' | tr '\n' ' ' || echo none)"
echo

echo "== Preparing user and directories"
if id "$APP_USER" >/dev/null 2>&1; then
  echo "user '$APP_USER' already exists"
else
  adduser --disabled-password --gecos "Nexea Holding AG app" "$APP_USER"
  echo "created user '$APP_USER' (no password, no sudo)"
fi

install -d -o "$APP_USER" -g "$APP_USER" -m 755 "$BASE" "$BASE/releases"
install -d -o "$APP_USER" -g "$APP_USER" -m 750 "$BASE/shared" "$BASE/shared/data" "$BASE/shared/documents" "$BASE/shared/logs"
install -d -m 755 /var/www/certbot

ENV_FILE="$BASE/shared/.env.local"
if [ -e "$ENV_FILE" ]; then
  echo "env file exists, left untouched: $ENV_FILE"
else
  SECRET="$(openssl rand -hex 32)"
  umask 077
  cat > "$ENV_FILE" <<EOF
# Server-side secrets for Nexea Holding AG. Never commit. Readable only by the '$APP_USER' user.
# RESEND_API_KEY is intentionally empty: until you paste a NEWLY ROTATED key the contact form and document
# requests answer "not configured" honestly (nothing pretends to send).
RESEND_API_KEY=
CONTACT_FROM_EMAIL=Nexea Holding AG <info@nexea-holding.com>
CONTACT_TO_EMAIL=info@nexea-holding.com
OTP_HASH_SECRET=$SECRET
OTP_STORE_PATH=$BASE/shared/data/otp-challenges.json
DOCUMENTS_DIR=$BASE/shared/documents
EOF
  chown "$APP_USER:$APP_USER" "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  echo "created $ENV_FILE (mode 600). Generated a fresh OTP_HASH_SECRET."
fi

cat <<EOF

== Done. Next steps (as '$APP_USER' unless stated):
 1. Paste the NEW Resend key:        sudo -u $APP_USER nano $ENV_FILE
 2. Copy the approved PDFs into:     $BASE/shared/documents/   (owner $APP_USER, never inside a web-served folder)
 3. First deploy:                    sudo -u $APP_USER bash -c 'cd $BASE && git clone https://github.com/THINXIFY/Nexea-Holding-AG-website.git repo && bash repo/deploy/deploy.sh'
 4. PM2 on boot (as root, once):     sudo env PATH=\$PATH:\$(dirname \$(command -v node)) \$(command -v pm2) startup systemd -u $APP_USER --hp /home/$APP_USER
 5. Nginx + SSL: follow "Hostinger VPS deployment" in README.md
EOF
