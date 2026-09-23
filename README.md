# Medeiros — Minecraft Developer Portfolio

A premium, responsive portfolio site for Medeiros. It is built with semantic HTML, modern CSS and dependency-free JavaScript.

## Run it

Open `index.html` directly for a quick local preview, or serve this folder from a small static server for the clean `/projects/<slug>` routes:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

The site is a lightweight single-page app. Navigation uses the History API and renders every route from the same reusable layout.

## Content management

### Add a new project

1. Open `data/projects.js`.
2. Add another object to `window.MEDEIROS_PROJECTS`.
3. Give it a unique `id` and `slug`.
4. Add the project fields: description, category, status, technologies, features, links, price, date and `featured`.
5. Add the image paths under `assets/projects/<slug>/`.

The new project card and project page will be generated automatically at:

```text
/projects/<slug>
```

You do not need to create a new HTML page.

### Replace project images

Each project keeps its assets in a clearly named folder. Current projects are `heavenlobby` and `yumi`:

```text
assets/projects/heavenlobby/hero.svg
assets/projects/heavenlobby/1.svg
assets/projects/heavenlobby/2.svg
assets/projects/heavenlobby/3.svg
assets/projects/yumi/hero.svg
assets/projects/yumi/1.svg
assets/projects/yumi/2.svg
assets/projects/yumi/3.svg
```

Replace those files while keeping the same names, or update the `images.hero` and `images.gallery` paths in `data/projects.js`. SVG is used for the included lightweight artwork, but PNG, JPG and WebP files work too.

### Change homepage content

- Hero copy, homepage section text and layout: `script.js`, in `renderHome()`.
- Featured projects: set `featured: true` in `data/projects.js`.
- Technology list and process copy: `data/site.js`.

### Change services

Edit the `services` array in `data/site.js`. Services are used on both the homepage and `/services`.

### Change contact information

Edit `contact.discord` and `contact.discordServer` in `data/site.js`. The current Discord contact is `smmezp`, and contact buttons open the configured server invite in a new tab. The commission form is intentionally frontend-only: submitting it creates a formatted brief, displays a copyable preview and copies the brief to the clipboard when the browser allows it.

### Brand assets

- Main logo: `assets/brand/logo-main.png`, used in the navbar and footer without cropping or distortion.
- Favicon source: `assets/brand/favicon-source.png`.
- The supplied outer backgrounds are transparent in the logo and favicon PNGs; the artwork itself is preserved.
- Generated favicon sizes: `assets/brand/favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`, `apple-touch-icon.png`, `favicon-192x192.png`, `favicon-512x512.png` and the legacy multi-size `favicon.ico`.
- HTML references live in `index.html`; installable metadata is in `manifest.webmanifest`.

### Remove a project

Delete its object from `data/projects.js` and remove its matching folder from `assets/projects/<slug>/`. The card, search result, filter result and `/projects/<slug>` page will disappear automatically. No HTML page needs to be edited.

## Routes

- `/` — Home
- `/projects` — Project catalog with category filters and search
- `/projects/heavenlobby` — Individual project page example
- `/projects/yumi` — Discord bot project page
- `/services` — Services
- `/about` — About
- `/contact` — Commission form

## Design and performance notes

- No framework or UI library is required.
- Project totals, featured totals, category totals and filter result counts are calculated from `window.MEDEIROS_PROJECTS`.
- Project gallery images use lazy loading; hero images are prioritized.
- Missing or broken project images render a `Project Preview / Images coming soon` state instead of a broken-image icon.
- Gallery images open in a keyboard- and mobile-friendly lightbox with full-size rendering, next/previous controls, counters, Escape/outside-click closing and swipe navigation.
- The visual system uses wide editorial containers with responsive edge spacing, full-width sections and compact mobile breakpoints; tune the composition in the final `Wide editorial composition` block in `style.css`.
- Optional project video and additional-information sections render only when their data exists.
- `prefers-reduced-motion` is respected.
- `sitemap.xml` and `robots.txt` are included as a starting point for deployment.
