# Leo's starter: Portfolio

A polished personal portfolio site with a 3D hero and smooth scroll motion. Plain HTML, CSS and
JavaScript. No build step, no framework, no trackers. Part of Leo's starters from
[Replore](https://replore.cardzo.co.in), a Cardzo product.

![Desktop, light theme](docs/desktop-light.png)

| Dark theme | Phone |
| --- | --- |
| ![Desktop, dark theme](docs/desktop-dark.png) | ![Phone, light theme](docs/phone-light.png) |

## What you get

- Hero with your name, role, a short line and two buttons, next to a slowly turning low-poly stone
  drawn with three.js. It tilts toward the pointer and turns as you scroll.
- About, selected work, experience timeline, contact and footer sections.
- One authored intro (your name lifts out of a mask) and scroll motion with GSAP ScrollTrigger:
  project images open from an inset frame, the career line fills as you read.
- A reading progress bar made with a CSS scroll-driven animation (`animation-timeline: scroll()`),
  shown only in browsers that support it.
- Light and dark themes. Follows the visitor's system setting until they pick one.
- Respects reduced motion: no movement, no 3D, a static version of the stone instead.
- Contact by email: a `mailto:` link plus a "Copy email address" button. No backend, no form service.
- Self-hosted fonts (Instrument Serif and Hanken Grotesk). No requests to other sites.
- All words, links and projects live in one file: `content.js`.

## Quick start

1. **Edit `content.js`.** Change the name, role, email, projects and links. Replace the images in
   `assets/` (keep the same file names, or update the paths in `content.js`).
2. **Open it.** Double-click `index.html` to preview. For the full 3D hero, serve the folder instead,
   because browsers only load JavaScript modules (three.js) over http:

   ```
   python -m http.server 8000
   ```

   Then open http://localhost:8000. Opened straight from disk, the page shows a static drawing of
   the stone instead of the 3D one. Everything else works the same.
3. **Deploy it.** Pick one:

   **GitHub Pages**
   1. Create an empty repository on GitHub, for example `portfolio`.
   2. In this folder run:
      ```
      git remote add origin https://github.com/YOUR-NAME/portfolio.git
      git push -u origin main
      ```
   3. On GitHub open **Settings > Pages**. Under **Build and deployment** choose
      **Source: Deploy from a branch**, then **Branch: main** and **/ (root)**, and click **Save**.
   4. After a minute your site is live at `https://YOUR-NAME.github.io/portfolio/`.

   **Cloudflare Pages**
   1. In the Cloudflare dashboard open **Workers & Pages > Create > Pages**.
   2. Choose **Upload assets**, give the project a name and click **Create project**.
   3. Drag this whole folder onto the upload box and click **Deploy site**.
   4. Or choose **Connect to Git** instead, pick your repository, set **Framework preset: None**,
      leave **Build command** empty and set **Build output directory** to `/`.

   **Netlify**
   1. Go to https://app.netlify.com/drop and drag this folder onto the page. That is it.
   2. Or in Netlify choose **Add new site > Import an existing project**, pick your repository,
      leave **Build command** empty and set **Publish directory** to `.`.

## Customising

- **Colours:** edit the tokens at the top of `styles.css` (`--bg`, `--ink`, `--accent` and friends).
  There is one block for light and one for dark. The 3D stone reads `--accent` and `--ink`, so it
  follows your palette automatically.
- **Fonts:** `fonts/fonts.css` holds the fonts as base64 so they work even from disk. To use other
  fonts, replace its `@font-face` rules (for a hosted site, `src: url("your-font.woff2")` is fine)
  and update `--font-display` and `--font-body` in `styles.css`.
- **Sections:** each section is a plain `<section>` in `index.html`. Remove one by deleting it and
  its link in the header.
- **Motion:** all GSAP code is in the "motion" block of `main.js`. Delete that block and the two
  `vendor/gsap` script tags to run without GSAP; the page stays fully readable.
- **3D hero:** `hero3d.js`. Change the shape (`IcosahedronGeometry`), the number of orbit points or
  the speed (`spin += dt * 0.18`). Delete the `loadHero3d` call in `main.js` to keep only the static
  drawing.
- **Projects:** add or remove objects in `projects.items` in `content.js`. Leave `live` or `code`
  empty (`""`) to hide that link.

## Credits

- Built by Cardzo for Replore. Code: MIT licence, see `LICENSE`.
- [three.js](https://threejs.org) (MIT) for the 3D hero.
- [GSAP](https://gsap.com) with ScrollTrigger for motion, under the Standard "No Charge" GSAP
  License, which is not MIT. Read `NOTICE.md` before selling or redistributing this template.
- Fonts: Instrument Serif and Hanken Grotesk, SIL Open Font License.
- Design guidance: [Impeccable](https://github.com/pbakaus/impeccable).

Full licence details, versions and download sources are in `NOTICE.md`.
