/**
 * PM2 process definition for Nexea Holding AG (Next.js production server).
 *
 * - Binds to 127.0.0.1:3700 only; the public site is reached through Nginx.
 * - Runs from the `current` symlink of the release layout (see deploy/deploy.sh).
 * - Exactly ONE instance: the OTP challenge store and rate limiter are per-process.
 * - Secrets are NOT defined here. Next.js loads them from `.env.local`, which deploy.sh links
 *   from the persistent shared directory into every release.
 */
const BASE = process.env.NEXEA_BASE || "/var/www/nexea-holding";

module.exports = {
  apps: [
    {
      name: "nexea-holding",
      cwd: `${BASE}/current`,
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3700",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      min_uptime: "20s",
      max_restarts: 10,
      restart_delay: 3000,
      max_memory_restart: "700M",
      kill_timeout: 8000,
      env: {
        NODE_ENV: "production",
        PORT: "3700",
        HOSTNAME: "127.0.0.1",
      },
      time: true,
      merge_logs: true,
      out_file: `${BASE}/shared/logs/nexea-out.log`,
      error_file: `${BASE}/shared/logs/nexea-error.log`,
    },
  ],
};
