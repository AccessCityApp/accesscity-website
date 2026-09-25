# Accessity — accessity.gr (Static Landing Page)

Preliminary static website for Accessity, focused on:

- Clear public information about the initiative
- Touch points for citizens, municipalities, partners, volunteers, and supporters
- Ultra SEO-friendly, fast, and fully accessible from every device

## Goals

- **Accessibility-first:** semantic HTML, keyboard support, visible focus, strong contrast, readable typography
- **Performance:** no heavy dependencies, minimal CSS, fast LCP
- **SEO:** clean headings, structured data (JSON-LD), Open Graph/Twitter cards, canonical URL
- **Maintainability:** one page, easy to edit copy, optional bilingual content

## Tech

- Static site with **HTML**, **CSS**, and a small **Eleventy** build for the blog
- Blog content stored as structured JSON files under `content/blog/`
- Blog editing configured for **Pages CMS** via `.pages.yml`

## Project Structure

- `index.html` — the landing page
- `assets/` — logos, styles, scripts, and shared assets

  Filenames carry a version suffix (`styles.v2.css`, `app.v3.js`, `logo.v2.png`).
  SiteGround serves these with a one-year `Cache-Control`, so when you change one,
  bump the suffix and update the references in `index.html`,
  `src/_includes/layouts/base.njk` and the payload check in
  `.github/workflows/deploy-production.yml` — otherwise returning visitors keep the
  old file against new HTML. Keep publishing the old name as well (the aliases in
  `.eleventy.js`): cached HTML still requests it, and the deploy deletes anything
  missing from `dist/`.
- `content/blog/` — structured blog post entries
- `src/` — Eleventy templates and generated blog sources
- `.pages.yml` — Pages CMS configuration for browser-based blog editing
- `dist/` — generated build output used for deployment

## Local Preview

For the landing page only, you can still open `index.html` directly in a browser.

For the full site, including the generated blog:

- `npm install`
- `npm run build`
- open `dist/index.html` in a browser

For local development with a preview server:

- `npm start`

- Eleventy will serve the generated site locally.

## Deployment

You can deploy this as static hosting:

- Cloudflare Pages / Netlify / Vercel / GitHub Pages
- Any traditional hosting with an `index.html`

### SiteGround Production Automation

Production deploys are automated with a GitHub Actions workflow that uploads the static site to SiteGround over FTP.

Files deployed to production:

- generated `dist/` output
- includes `index.html`, `blog.html`, `blog/*.html`, `robots.txt`, `sitemap.xml`, `.htaccess`, `assets/`, and `media/`

Files excluded from deployment:

- `.github/`
- `.vscode/`
- `.git/`
- `README.md`
- `deploy-production.command`

#### GitHub Secrets

Set these repository secrets before the first deploy:

- `FTP_USERNAME` — your SiteGround FTP username
- `FTP_PASSWORD` — your SiteGround FTP password

The workflow connects over FTPS (explicit TLS on port `21`) with `security: strict`, so the
password and files are encrypted and the server's certificate is verified. That certificate
only covers the server's hostname, so the host is set in the workflow as
`esm13.siteground.biz` rather than the site's domain, which fails the check. If SiteGround
moves the site to another server, update `server:` in the workflow to the new hostname.

#### Caching

`.htaccess` sends `Cache-Control: no-cache` for HTML, `sitemap.xml` and `robots.txt`, so
browsers revalidate them and SiteGround's Dynamic Cache never serves a page from before the
last deploy. Assets keep a one-year cache, which is why their filenames are versioned.

This needs **NGINX Direct Delivery off** (Site Tools → Speed → Caching). With it on, nginx
serves static files itself, ignores `.htaccess`, and gives HTML a 180-day cache.

The deploy deletes anything missing from `dist/`, so the file lives in the repo and the payload
check refuses to deploy without it. Change it here rather than on the server.

#### Trigger Options

The production workflow supports one trigger:

- manual deploy through GitHub Actions `workflow_dispatch`

There is also a local Mac trigger script at `./deploy-production.command`.

### CMS Actions

Pages CMS is configured with two repository-level actions in `.pages.yml`:

- `Build check` → triggers `.github/workflows/build-check.yml`
- `Deploy production` → triggers `.github/workflows/deploy-production.yml`

Both actions are available from the **Actions** area in Pages CMS.

Recommended usage:

1. Run **Build check** after editing content.
2. If it passes and content is approved, run **Deploy production**.

#### Local Mac Deploy Script

The repository includes a clickable macOS script that triggers the GitHub Actions production workflow.

Setup:

1. Install GitHub CLI: `brew install gh`
2. Authenticate once: `gh auth login`
3. Make the script executable: `chmod +x deploy-production.command`

Usage:

- Double click `deploy-production.command` in Finder
- or run `./deploy-production.command`
- or deploy a different branch manually with `./deploy-production.command your-branch`

The script fetches `origin/<branch>` and refuses to deploy if your local branch is out of sync with the remote branch.

#### Workflow File

The production deployment workflow lives at `.github/workflows/deploy-production.yml`.

Server target:

- remote directory: `accessity.gr/public_html/`

Production domain:

- `https://accessity.gr`

## Editing Content

Landing page content still lives in `index.html`.

Blog content now lives in `content/blog/*.json` and is intended to be edited through Pages CMS.

### Blog editor workflow

1. Open the hosted Pages CMS app and connect this repository.
2. Use the `Blog posts` collection defined in `.pages.yml`.
3. Create or edit a post entry.
4. Save the entry so it writes back to `content/blog/<slug>.json`.
5. Trigger the production deploy workflow, or run a local build first if you want to review the generated output.

You can also run **Build check** and **Deploy production** directly from the Pages CMS **Actions** panel.

### Current blog entry model

Each blog post entry includes:

- core fields: `slug`, `status`, `publishDate`, `categoryKey`
- language groups: `greek` and `english`
- per-language fields: `title`, `excerpt`, optional `seoTitle`, optional `seoDescription`, `body`
- internal visual fields (`tagStyle`, `cardTheme`) that are hidden from normal editors in Pages CMS

### Editor behavior and fallbacks

- body fields use the rich text editor and are saved as Markdown
- if `seoTitle` is empty, the corresponding post title is used
- if `seoDescription` is empty, the corresponding excerpt is used
- category labels are derived from `categoryKey` for both languages
- date labels are generated from `publishDate` when not explicitly present

### Adding photos in a post

1. Open the post in Pages CMS.
2. In either body field (`greek.body` or `english.body`), keep **Editor** mode active.
3. Insert an image from the editor controls and upload/select from `media/`.
4. Save the post.

Image links are saved in content and served from `/media/...`.

### Authoring tips

- Keep heading hierarchy clean (`h1` once on the page, then `h2`, then `h3`).
- Write meaningful link text (avoid generic "click here").
- Always add alt text for images.
- Prefer clear, plain language.

## SEO Checklist (Production)

- [ ] Set correct `<title>` and meta description
- [ ] Confirm `canonical` points to `https://accessity.gr/`
- [ ] Add `og:image` at `https://accessity.gr/assets/og-accessity.jpg` (1200×630)
- [ ] Add `sitemap.xml` and `robots.txt`
- [ ] Ensure one `h1` only
- [ ] Validate JSON-LD (Organization + WebSite)
- [ ] Use real links to socials and contact
- [ ] Add FAQ content that matches real questions

## Accessibility Checklist (Baseline)

- [ ] Full keyboard navigation (Tab/Shift+Tab)
- [ ] Visible focus outlines
- [ ] Skip-to-content link works
- [ ] Color contrast meets WCAG AA
- [ ] Reduced-motion support
- [ ] Form fields have labels and hints
- [ ] No essential info only via color/position

## Bilingual Setup (Greek / English)

The landing page supports:

- Greek (default)
- English

Language switching:

- Accessible toggle button
- Updates `<html lang="">`
- Updates page title + meta description dynamically
- Works without page reload

SEO:

- `hreflang="el"` and `hreflang="en"` included
- Canonical points to main domain
- Structured data remains language neutral (brand-level)

## Contact

- Email: `info@accessity.gr`
