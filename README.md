# Nexea Holding AG — Corporate Website

Official website of **Nexea Holding AG**, a Swiss investment holding company headquartered in Hergiswil, Nidwalden.
The site presents the company's identity, investment interests, proposed services, leadership and partnership approach,
together with contact, legal and private-document-request functionality.

**Live site:** <https://nexea-holding.com>

Design language: *Obsidian & Arctic Silver* — dark, editorial, restrained. Premium serif display type, precise layouts,
cinematic photography and subtle, purposeful motion.

---

## Contents

- [Features](#features)
- [Site map](#site-map)
- [Technology stack](#technology-stack)
- [Homepage hero slider](#homepage-hero-slider)
- [Header and mega menus](#header-and-mega-menus)
- [Investments and Services](#investments-and-services)
- [Private document requests (OTP)](#private-document-requests-otp)
- [Responsive design and accessibility](#responsive-design-and-accessibility)
- [SEO and performance](#seo-and-performance)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Production build and deployment](#production-build-and-deployment)
- [Content and maintenance](#content-and-maintenance)
- [Contributing](#contributing)

---

## Features

- **Cinematic homepage hero slider** — three full-screen slides with crossfade transitions, staged typography reveals,
  segmented progress navigation, swipe support and a Pause/Play control.
- **Floating glass header** with two bespoke mega menus (dark *Investments* directory, light *Services* directory),
  deep links into the page content, and a dedicated mobile drawer with nested accordions.
- **Investments** page: sector universe, category filtering and deep-linkable sectors.
- **Services** page: nine proposed areas of expertise with an inline detail panel and deep links.
- **Team**, **Partnerships** (with a seamless partner-logo marquee), **About**, **Contact** and legal pages
  (**Impressum**, **Privacy Policy**, **Terms & Conditions**).
- **Contact form** with server-side validation, spam protection and email delivery through Resend.
- **Request Private Documents** — email verification by one-time code, then delivery of PDF documents by email.
- GSAP / ScrollTrigger motion system with full `prefers-reduced-motion` support.
- Accessible, keyboard-operable, responsive from 320 px to 2560 px.

## Site map

| Route | Page |
| --- | --- |
| `/` | Homepage — hero slider, About, Investment Universe, Sectors, Philosophy, Expertise, Approach, Global Perspective, Partnerships, Contact CTA |
| `/about` | About Nexea — identity, perspective, governance, journey |
| `/investments` | Investment sectors, approach, philosophy and criteria |
| `/services` | Services & expertise (nine proposed areas) |
| `/team` | Board of Directors and executive management |
| `/partnerships` | Partnership perspective, partner network marquee, collaboration framework |
| `/contact` | Enquiry form, corporate information, location, document requests |
| `/impressum` | Legal notice, registration details and disclosures |
| `/privacy-policy` | Privacy Policy |
| `/terms-and-conditions` | Website terms |
| `/sitemap.xml` | Generated sitemap |
| `/api/contact` | Contact form endpoint |
| `/api/request-documents/{start,resend,verify}` | Private document request endpoints |

Deep links used by the navigation:

- `/investments?category=<real-assets|technology|industry|health>#sectors`
- `/investments?sector=<sector-slug>#sectors`
- `/services?service=<service-slug>#services-list`
- `/contact?type=<investment|partnership|corporate|other>`

## Technology stack

| Area | Technology |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) 16 (App Router, Turbopack), [React](https://react.dev) 19 |
| Language | TypeScript 6 |
| Styling | [Tailwind CSS](https://tailwindcss.com) 4 (CSS-first `@theme` tokens) |
| Animation | [GSAP](https://gsap.com) 3 + `@gsap/react` + ScrollTrigger; CSS transitions for lightweight effects |
| Icons | [lucide-react](https://lucide.dev) |
| Images | `next/image` (AVIF/WebP, responsive `sizes`) |
| Fonts | `next/font/google` — Instrument Serif (display), Manrope (UI), DM Sans (body) |
| Email | [Resend](https://resend.com) REST API (plain `fetch`, no SDK) |
| Linting | ESLint 9 with `eslint-config-next` |

There are no UI-kit, carousel or state-management dependencies: the slider, mega menus, marquee and modal are custom components.

## Homepage hero slider

`src/components/sections/HeroSlider.tsx` with its content in `src/data/hero-slides.ts`.

- Three slides — *Corporate Identity*, *Strategic Investments*, *Global Perspective* — each with its own photograph
  (`public/images/slider/`), copy and call-to-action pair.
- **Transition:** the next photograph fades in over the previous one (which stays painted underneath, so rapid
  navigation never flashes), eases from 1.04× to 1×, while the eyebrow, masked headline lines, description and buttons
  enter in sequence. Implemented with CSS transitions; no timers drive the animation.
- **Autoplay:** 7 s per slide, looping, driven by the progress line's `animationend`, so the indicator and the slide
  change can never drift apart. Autoplay continues while the pointer is over the slider. It holds only for the visitor's
  own Pause, keyboard focus inside the slider, a hidden browser tab, or when the hero is scrolled out of view.
- **Navigation:** three numbered, labelled progress segments, Previous / Next, `01 / 03` counter, Pause/Play,
  arrow-key support and horizontal swipe on touch devices (vertical scrolling is untouched).
- **Performance:** only the first photograph is preloaded; the others load when the browser is idle.
- **Accessibility:** a single visually-hidden `h1`; slide headlines are `h2`; inactive slides are `inert` and
  `aria-hidden`; slide changes are announced only after manual navigation; reduced-motion visitors get no autoplay
  and instant changes.

## Header and mega menus

`src/components/layout/Header.tsx`, `MegaMenus.tsx`, `src/data/navigation.ts`.

- Floating glass bar (translucent Obsidian, backdrop blur) that compacts on scroll.
- **Investments** panel: dark directory of the 15 sectors in four categories. **Services** panel: light directory of the
  nine areas of expertise. Opens on hover or click; stays open between trigger and panel; closes on Escape, outside
  press and navigation; parent labels remain real links to the landing pages.
- Disclosure pattern with `aria-expanded` / `aria-controls` (no application-menu roles for ordinary links).
- **Mobile:** full-height drawer with scroll lock, focus trap, focus restoration, safe-area insets and nested
  accordions (Investments → categories → sectors; Services → nine services).

## Investments and Services

- Investment data lives in `src/data/investment-sectors.ts`; the filterable directory is
  `src/components/investments/SectorDirectory.tsx` (reads `?category=` / `?sector=`, filters, scrolls and highlights).
- Service data lives in `src/data/services.ts`; `src/components/services/SvAreas.tsx` opens the matching detail panel
  for `?service=`.
- All investment and service descriptions are *proposed areas of interest / expertise*, not portfolio holdings or
  regulated services — the copy and legal pages are written accordingly.

## Private document requests (OTP)

A visitor chooses **Request Private Documents** (About and Contact pages), enters an email address, receives a six-digit
code and, after verifying it, receives the PDFs by email.

- Code generated with a CSPRNG, stored only as an HMAC-SHA-256 hash, expires (default 10 min), limited to 5 attempts,
  resend cooldown, per-email and per-IP rate limits, honeypot, same-origin and size checks.
- No code is sent unless documents are available to deliver; failures are reported honestly (never a false success).
- Glass dialog UI: `src/components/documents/`. Server: `src/app/api/request-documents/` and
  `src/lib/documents-access/`.
- **Documents:** the PDFs live in `private/documents/` and are committed to the repository, so every deployment ships
  them with the code. The folder is outside `public/`, so the website never serves the files directly; they are only
  attached to the verification email. Every PDF in the folder is attached. To change what visitors receive, add, replace
  or delete PDFs there and deploy.
- Pending codes are stored in a file (`.data/`, git-ignored). This needs a single persistent Node server; for
  serverless or multi-instance hosting replace `src/lib/documents-access/store.ts` with a shared store (Redis, database).

## Responsive design and accessibility

- Layouts verified from 320 px to 2560 px, including landscape phones; no horizontal overflow.
- Semantic landmarks, one `h1` per page, skip link, visible focus states, 44 px touch targets.
- Keyboard operable: header menus, hero slider, accordions, dialog (focus trap, Escape, focus restoration).
- Motion is progressive: content is visible without JavaScript and when `prefers-reduced-motion` is set.
- Contrast-checked text on dark and light surfaces; decorative images use empty `alt`.

## SEO and performance

- Per-page metadata (title, description, Open Graph, Twitter), generated `sitemap.xml`, favicon and Apple touch icon.
- `next/image` with AVIF/WebP and correct `sizes`; priority only on above-the-fold imagery; lazy loading elsewhere.
- Self-hosted fonts via `next/font`; GSAP registered once; ScrollTrigger refreshed on load, fonts and route changes.
- Static prerendering for all pages; only the API routes are dynamic.

> The canonical URL is `https://nexea-holding.com`. Set the production host before launch and review each page's
> `alternates.canonical`.

## Project structure

```text
.
├── public/
│   └── images/                 Photography, logos, hero slider images (slider/), partner logos (partners/)
├── private/
│   └── documents/              PDFs emailed on request (tracked; never web-served)
├── src/
│   ├── app/                    App Router routes, layout, sitemap, icons, API route handlers
│   │   ├── api/contact/
│   │   └── api/request-documents/{start,resend,verify}/
│   ├── components/
│   │   ├── layout/             Header, mega menus, footer, back-to-top, scroll refresh
│   │   ├── sections/           Homepage sections (HeroSlider, About, Philosophy, ...)
│   │   ├── about/ investments/ services/ team/ partnerships/ contact/ impressum/ legal/
│   │   ├── documents/          Request Private Documents dialog
│   │   └── ui/                 Button, Wordmark (logo), MaskedLines, SectionLabel, ...
│   ├── data/                   Typed content: company, navigation, sectors, services, team, hero slides, legal text
│   ├── hooks/                  useMotion (GSAP + reduced motion), useMediaQuery
│   └── lib/                    GSAP setup, animation helpers, validation, mailer, rate limiting, documents-access
├── deploy/                     Hostinger VPS deployment: PM2, Nginx, deploy / rollback scripts
├── .env.example                Environment variable template (names only)
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

## Getting started

Requirements: **Node.js 20+** (developed on Node 24) and npm.

```bash
git clone https://github.com/THINXIFY/Nexea-Holding-AG-website.git
cd Nexea-Holding-AG-website
npm install
cp .env.example .env.local      # then fill in the values (see below)
npm run dev                     # http://localhost:3000
```

Useful scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run lint` | ESLint |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |

## Environment variables

Copy `.env.example` to `.env.local`. **Never commit `.env.local` or real values.** Names only:

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes (email features) | Resend API key |
| `CONTACT_FROM_EMAIL` | Yes (email features) | Sender on a Resend-verified domain, e.g. `Nexea Holding AG <info@nexea-holding.com>` |
| `CONTACT_TO_EMAIL` | No | Recipient of contact-form enquiries (default `info@nexea-holding.com`) |
| `OTP_HASH_SECRET` | Yes in production | Secret (32+ random characters) protecting stored one-time codes |
| `OTP_TTL_MINUTES` | No | Code lifetime (default 10) |
| `OTP_MAX_ATTEMPTS` | No | Wrong attempts allowed per code (default 5) |
| `OTP_RESEND_COOLDOWN_SECONDS` | No | Delay before a code can be resent (default 60) |
| `DOCUMENTS_FROM_EMAIL` | No | Separate sender for document emails (defaults to `CONTACT_FROM_EMAIL`) |
| `DOCUMENTS_DIR` | No | Optional override folder for the PDFs; falls back to `./private/documents` when empty or unset |
| `OTP_STORE_PATH` | No | Challenge store file (default `./.data/otp-challenges.json`) |
| `RESEND_API_URL` | No | Provider endpoint override (testing only) |

Without email credentials the forms respond with an honest "not configured" error; nothing reports a false success.

## Production build and deployment

```bash
npm run typecheck && npm run lint
npm run build
npm run start            # next start; add -H 127.0.0.1 -p 3700 to bind to localhost on a server
```

Requirements: **Node.js 20.9+** (Node 22 LTS recommended), a **persistent Node.js server** (the rate limiter and the
file-backed OTP store are per-process, so run exactly one instance), HTTPS behind a reverse proxy that forwards the
client address, and a Resend-verified sender domain.

## Hostinger VPS deployment

Target: Ubuntu VPS, Nginx → Next.js on `127.0.0.1:3700`, PM2 (process `nexea-holding`), Let's Encrypt SSL, release-based
deployments from GitHub `main`. Everything lives in `deploy/`:

| File | Purpose |
| --- | --- |
| `deploy/server-setup.sh` | One-time, idempotent: read-only server report, dedicated `nexea` user, directories, locked-down env file |
| `deploy/deploy.sh` | Fetch `main`, build a new release, switch atomically, restart PM2, health-check, auto-rollback on failure |
| `deploy/rollback.sh` | Instantly switch back to the previous (or a named) release |
| `deploy/ecosystem.config.cjs` | PM2 definition (single instance, 127.0.0.1:3700, restart policy, memory limit, logs) |
| `deploy/nginx/nexea-holding.http.conf` | Nginx site before the certificate exists |
| `deploy/nginx/nexea-holding.https.conf` | Final Nginx site: HTTPS, www → apex redirect, HTTP → HTTPS |

Server layout (`/var/www/nexea-holding`):

```text
repo/       git clone used only as a fetch source (never reset or edited)
releases/   one folder per deployment (<timestamp>-<commit>); the last 3 are kept
current     symlink to the live release
shared/     PERSISTENT, never overwritten by a deployment
  ├── .env.local     secrets (mode 600), linked into every release
  ├── data/          OTP challenge store
  └── logs/          PM2 logs
```

### First-time setup (run on the VPS)

The VPS may host other sites; none of these steps replaces existing configuration. Steps 1–2 are read-only.

```bash
# 1. Check what is already there (as root). Node must be >= 20.9; port 3700 must be free.
node -v; pm2 -v; nginx -v; certbot --version
ss -ltnp | grep -E ':3700\b' || echo "port 3700 free"
ls /etc/nginx/sites-enabled; free -h; df -h /

# 2. Prerequisites that are missing (only run the lines you need)
#    Node 22 LTS:  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs
#    PM2:          sudo npm install -g pm2
#    Certbot:      sudo apt-get install -y certbot
#    A build needs ~1.5 GB RAM; on a small VPS add swap first.

# 3. User, directories and the server-side env file (as root)
sudo bash -c 'curl -fsSL https://raw.githubusercontent.com/THINXIFY/Nexea-Holding-AG-website/main/deploy/server-setup.sh -o /tmp/nexea-setup.sh && less /tmp/nexea-setup.sh'   # review, then:
sudo bash /tmp/nexea-setup.sh

# 4. Secrets: paste a NEWLY ROTATED Resend key (never reuse a key that was ever exposed)
sudo -u nexea nano /var/www/nexea-holding/shared/.env.local

# 5. (nothing to copy: the PDFs ship with the repository in private/documents/)

# 6. First deployment (as the nexea user)
sudo -u nexea bash -c 'cd /var/www/nexea-holding && git clone https://github.com/THINXIFY/Nexea-Holding-AG-website.git repo && bash repo/deploy/deploy.sh'
curl -I http://127.0.0.1:3700        # expect 200 before touching nginx

# 7. PM2 survives reboots (prints one command to run as root; run it)
sudo -u nexea pm2 startup systemd -u nexea --hp /home/nexea
sudo -u nexea pm2 save
```

### Nginx and SSL

DNS first: `nexea-holding.com` and `www.nexea-holding.com` must have **A records → 2.25.169.72** and no stale
`AAAA` record. Do not change MX, SPF, DKIM or DMARC records.

```bash
# A. HTTP site (adds one isolated file; the global config and other sites are untouched)
sudo cp /var/www/nexea-holding/current/deploy/nginx/nexea-holding.http.conf /etc/nginx/sites-available/nexea-holding.conf
sudo ln -s /etc/nginx/sites-available/nexea-holding.conf /etc/nginx/sites-enabled/nexea-holding.conf
sudo nginx -t && sudo systemctl reload nginx
curl -I http://nexea-holding.com                      # expect 200 from the app

# B. Certificate (covers both names), then enable the HTTPS site
sudo certbot certonly --webroot -w /var/www/certbot -d nexea-holding.com -d www.nexea-holding.com
sudo cp /var/www/nexea-holding/current/deploy/nginx/nexea-holding.https.conf /etc/nginx/sites-available/nexea-holding.conf
sudo nginx -t && sudo systemctl reload nginx

# C. Verify
curl -I https://nexea-holding.com          # 200
curl -I https://www.nexea-holding.com      # 301 -> https://nexea-holding.com/
curl -I http://nexea-holding.com           # 301 -> https://nexea-holding.com/
sudo certbot renew --dry-run               # automatic renewal works (certbot's systemd timer / cron)
```

Port 3700 is bound to 127.0.0.1 only; open just 80 and 443 in the firewall.

### Updating from GitHub

```bash
sudo -u nexea bash /var/www/nexea-holding/repo/deploy/deploy.sh          # deploy the latest main
sudo -u nexea bash /var/www/nexea-holding/repo/deploy/deploy.sh --status # deployed commit, releases, PM2, local response
sudo -u nexea bash /var/www/nexea-holding/repo/deploy/deploy.sh --force  # rebuild the same commit
```

`deploy.sh` fetches `main` (no reset, no force), exports the commit into a new release, runs `npm ci` and
`npm run build`, switches `current` atomically, reloads PM2 and health-checks `127.0.0.1:3700`. If the build or the
health check fails, the previous release keeps serving (or is restored automatically). `shared/` is never touched.

### Rollback

```bash
ls -1t /var/www/nexea-holding/releases                                         # newest first
sudo -u nexea bash /var/www/nexea-holding/repo/deploy/rollback.sh              # previous release
sudo -u nexea bash /var/www/nexea-holding/repo/deploy/rollback.sh <release-folder-name>
```

### Operations

```bash
sudo -u nexea pm2 status                  # process: nexea-holding
sudo -u nexea pm2 logs nexea-holding      # or: tail -f /var/www/nexea-holding/shared/logs/nexea-*.log
sudo -u nexea pm2 install pm2-logrotate   # keep logs small (optional)
sudo systemctl status nginx
```

Security notes: the app runs as the unprivileged `nexea` user; `shared/.env.local` is mode 600; the PDFs live in
`private/documents/` (outside `public/`, never web-served); Nginx overwrites `X-Forwarded-For` so clients cannot spoof their address for
rate limiting; no HSTS header is set until all subdomains are confirmed to support HTTPS.

## Content and maintenance

- **Copy and data** are typed modules in `src/data/` — edit these rather than the components.
- **Partner logos:** replace the placeholder PNGs in `public/images/partners/` and update `src/data/partners.ts`
  (mark each entry `approvedForPublication: true`, `isPlaceholder: false`); the preview notice then disappears.
- **Hero slides:** edit `src/data/hero-slides.ts` and the images in `public/images/slider/`.
- **Navigation:** `src/data/navigation.ts`. Items without a published destination are omitted, never shown as dead links.
- **Design tokens** (colours, type scale) live in `src/app/globals.css` (`@theme`).
- No portfolio, performance or financing claims should be added without verification; all investment and service
  descriptions are intentionally framed as proposed areas of interest or expertise.

## Contributing

1. Create a branch from `main` (`feat/…`, `fix/…`).
2. Keep changes focused; match the surrounding code style and the existing design system.
3. Before opening a pull request run `npm run typecheck`, `npm run lint` and `npm run build`.
4. Test at mobile (≈390 px) and desktop (≥1440 px) widths, with the keyboard, and with reduced motion enabled.
5. Never commit secrets, `.env*` files (other than `.env.example`) or the private PDFs.

---

© Nexea Holding AG, Sonnenbergstrasse 9, 6052 Hergiswil NW, Switzerland. All rights reserved.
