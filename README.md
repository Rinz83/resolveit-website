# Resolve IT Website

A rebuild of [www.resolveit.nl](https://www.resolveit.nl) in [Astro](https://astro.build) — fast, code-controlled, and self-hostable on your own server.

## Tech stack

- **Astro** (hybrid rendering) — all pages are static HTML; only the contact API runs server-side
- **No database** — content lives in `.astro` files, easy to edit directly
- **Nodemailer** — contact form sends email over your own SMTP server

## Local development

```bash
npm install
npm run dev      # → http://localhost:4321
```

## Build for production

```bash
npm run build    # outputs to ./dist
```

Because the contact form uses server-side rendering (hybrid mode), the build produces
a Node server in `dist/server/`. Run it with:

```bash
node ./dist/server/entry.mjs
```

By default it listens on `http://0.0.0.0:4321`. Set `HOST` and `PORT` env vars to change.

> **Want a pure static site instead** (no contact-form backend)?
> Change `output: 'hybrid'` to `output: 'static'` in `astro.config.mjs`, delete
> `src/pages/api/contact.ts`, and the `npm run build` output in `dist/` becomes plain
> HTML you can serve with any web server — no Node process required.

## Contact form configuration

1. Copy `.env.example` to `.env`
2. Fill in your SMTP credentials (host, port, user, pass) and recipient address
3. Restart the server

If SMTP is not configured, submissions are logged to the console instead of being lost.

## Deployment options

### Option A — Node server behind Nginx (recommended, keeps the contact form)

Run the built server with a process manager like [pm2](https://pm2.keymetrics.io/):

```bash
npm install -g pm2
pm2 start ./dist/server/entry.mjs --name resolveit
pm2 save
```

Nginx reverse proxy:

```nginx
server {
    listen 80;
    server_name resolveit.nl www.resolveit.nl;

    location / {
        proxy_pass http://127.0.0.1:4321;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Add HTTPS with [Certbot](https://certbot.eff.org/): `sudo certbot --nginx`.

### Option B — Docker

```bash
docker build -t resolveit .
docker run -d -p 4321:4321 --env-file .env --name resolveit resolveit
```

### Option C — Pure static (no form backend)

Switch to `output: 'static'` (see note above), then `npm run build` and serve `dist/`
with Nginx, Apache, Netlify, Vercel, or any static host.

## Project structure

```
src/
  components/    Nav, Footer, reusable ServiceDetail
  layouts/       Layout.astro (shared <head>, header, footer)
  pages/         One file per route
    diensten/    Service pages
    producten/   Product pages
    api/         contact.ts (server-side form handler)
  styles/        global.css (design system)
public/          favicon, images
```

## Editing content

- **Text & sections**: edit the relevant `.astro` file in `src/pages/`
- **Navigation**: `src/components/Nav.astro`
- **Footer**: `src/components/Footer.astro`
- **Colors & fonts**: CSS variables at the top of `src/styles/global.css`
  (brand greens, purple accent, charcoal darks — matched to resolveit.nl)

## Writing blog posts

Blog posts are Markdown files in `src/content/blog/`. To add a post, create a new
`.md` file with frontmatter:

```markdown
---
title: "Your title"
description: "Short summary for the card and SEO."
pubDate: 2026-06-01
author: "Author Name"
category: "Salesforce"
image: "/images/some-image.jpg"   # optional
draft: false                       # set true to hide
---

Your **Markdown** content here.
```

The post automatically appears on `/blog` and gets its own page at `/blog/<filename>`.

## Brand assets

Logos, icons, and photos in `public/images/` were taken from the existing
resolveit.nl site (your own property / licensed assets). The hero and section
photos are licensed Adobe Stock images already in use on your current site.

## Theme

The design is matched to the real resolveit.nl brand:
- **Greens** `#6db757` / `#85b160` (primary), **purple** `#6c4494` (accent)
- **Charcoal** dark sections `#1d2327` / `#2c3338`
- Warm near-black text `#2d2e2b`, pill-shaped buttons, light-weight headings
- **Manrope** font (a free, close match to the site's TT Norms Pro)

## TODO / nice-to-haves

- Swap the **Manrope** font for licensed **TT Norms Pro** if you own a webfont license
- Have the legal pages (`/privacybeleid`, `/cookiebeleid`, `/algemene-voorwaarden`)
  reviewed by a lawyer — they are templates
- Replace the generic Calendly link in `src/pages/contact.astro` with your real one
- Add an `og:image` (`public/images/og-default.jpg`) for nicer link previews
