# AccessCity — accesscity.gr (Static Landing Page)

Preliminary static website for AccessCity, focused on:

- Clear public information about the initiative
- Touch points for citizens, municipalities, partners, volunteers, and supporters
- Ultra SEO-friendly, fast, and fully accessible from every device

## Goals

- **Accessibility-first:** semantic HTML, keyboard support, visible focus, strong contrast, readable typography
- **Performance:** no heavy dependencies, minimal CSS, fast LCP
- **SEO:** clean headings, structured data (JSON-LD), Open Graph/Twitter cards, canonical URL
- **Maintainability:** one page, easy to edit copy, optional bilingual content

## Tech

- Pure **HTML** + **CSS** (inline in `index.html` for simplicity)
- No build step required

## Project Structure

- `index.html` — the landing page
- (optional) `robots.txt`
- (optional) `sitemap.xml`
- (optional) `assets/` — logos, social preview image, press kit PDFs, etc.

## Local Preview

Just open the file in a browser:

- macOS: double click `index.html`
- or use a tiny local server (recommended so URLs behave like production):
  - `python3 -m http.server 5173`
  - then visit `http://localhost:5173`

## Deployment

You can deploy this as static hosting:

- Cloudflare Pages / Netlify / Vercel / GitHub Pages
- Any traditional hosting with an `index.html`

### SiteGround Production Automation

Production deploys are automated with a GitHub Actions workflow that uploads the static site to SiteGround over FTP.

Files deployed to production:

- `index.html`
- `robots.txt`
- `sitemap.xml`
- `assets/`

Files excluded from deployment:

- `.github/`
- `.vscode/`
- `.git/`
- `README.md`
- `deploy-production.command`

#### GitHub Secrets

Set these repository secrets before the first deploy:

- `FTP_SERVER` — your SiteGround FTP host
- `FTP_USERNAME` — your SiteGround FTP username
- `FTP_PASSWORD` — your SiteGround FTP password

This workflow is currently configured to connect on FTP port `21`.

If your SiteGround account requires FTPS-only configuration later, update the workflow at `.github/workflows/deploy-production.yml` before the next production run.

#### Trigger Options

The workflow supports one production trigger:

- manual deploy through GitHub Actions `workflow_dispatch`

There is also a local Mac trigger script at `./deploy-production.command`.

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

- remote directory: `public_html/`

Production domain:

- `https://accesscity.gr`

## Editing Content

Open `index.html` and edit the text within sections:

- Hero
- Mission / How it works
- Who it helps
- Get involved
- FAQ
- Contact

**Tip:** Keep headings hierarchical (`h1` once, then `h2`, then `h3`) and avoid skipping levels.

## SEO Checklist (Production)

- [ ] Set correct `<title>` and meta description
- [ ] Confirm `canonical` points to `https://accesscity.gr/`
- [ ] Add `og:image` at `https://accesscity.gr/assets/og-accesscity.jpg` (1200×630)
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

- Email: `info@accesscity.gr`
