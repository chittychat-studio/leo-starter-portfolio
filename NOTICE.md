# Notices

The template's own code (`index.html`, `styles.css`, `main.js`, `hero3d.js`, `content.js`,
`assets/`) is original work, released under the MIT licence in `LICENSE`.

The third-party files below are included unchanged. Each keeps its own licence. The Cardzo MIT
licence does not cover them.

## three.js 0.186.1 (MIT)

- Files: `vendor/three/three.module.js`, `vendor/three/three.core.js`
- Licence: MIT, full text in `vendor/three/LICENSE` (Copyright 2010-2026 three.js authors)
- Source: https://registry.npmjs.org/three/-/three-0.186.1.tgz (npm tarball, files from `build/`)
- Tarball integrity checked against the npm registry (sha512).
- SHA-256 of the vendored files:
  - `three.module.js` 9052042d676cb0fdc1ddfefe193053f34b7ac0513a616fdac4535d49987812ea
  - `three.core.js` 9edde002b066a9a05676a6127f67735b62baf399bdea529f2f7e31657da769e6

## GSAP 3.15.0 and ScrollTrigger 3.15.0 (Standard "No Charge" GSAP License, NOT MIT)

- Files: `vendor/gsap/gsap.min.js`, `vendor/gsap/ScrollTrigger.min.js`
- Source: https://registry.npmjs.org/gsap/-/gsap-3.15.0.tgz (npm tarball, files from `dist/`)
- Tarball integrity checked against the npm registry (sha512).
- SHA-256: `gsap.min.js` 92bb9a96476f983d212a2bc4f54c889039c1696dd4461d40a736860938570fbb,
  `ScrollTrigger.min.js` b0b14d67b55b0c43c756ac0b106cfcb09d0879945f6ead64451065b0672916a2
- Licence: the Standard "No Charge" GSAP License from Webflow, effective 30 April 2025.
  Canonical page: https://gsap.com/standard-license. A copy of the text is in
  `vendor/gsap/LICENSE-GSAP-STANDARD.txt` (taken from the ScanCode LicenseDB mirror,
  https://scancode-licensedb.aboutcode.org/gsap-standard-no-charge-2025.html, because the gsap.com
  page renders its text with JavaScript). Always check the canonical page for the current terms.

### What the GSAP licence allows, in plain words (not legal advice)

- **Allowed:** using, reproducing, displaying and implementing GSAP "on any website, web application,
  or digital interface", free of charge, including commercial sites and client work.
- **Not allowed without written consent from Webflow:** using GSAP in a tool that lets people build
  visual animations without code, where that helps create something that competes with Webflow's
  visual animation builder.
- **Also not allowed:** reverse engineering GSAP to build a competing product, or removing or
  changing the copyright notices and branding in the GSAP files. Keep the header comments in
  `vendor/gsap/*.js` as they are.
- **Ownership:** Webflow keeps all rights in GSAP. Webflow can end the licence if its terms are
  broken, and can update the terms by posting a new version (older GSAP versions stay usable under
  the terms you accepted).
- **Selling this template:** the licence does not mention templates or themes that are sold. It
  grants rights to *use* GSAP in websites, and it does not give you a right to sublicense GSAP. If
  you sell or redistribute this template, the GSAP files stay under Webflow's licence (not MIT), so
  tell your buyers that and point them to https://gsap.com/standard-license. If the product you sell
  is itself a visual, no-code animation builder, you need Webflow's written consent first. When in
  doubt, ask Webflow or a lawyer, or remove GSAP (see the README: the site works without it).

## Fonts (SIL Open Font License 1.1)

The font files are embedded, unmodified, as base64 in `fonts/fonts.css` so they also load when the
page is opened from disk. Original file names are listed below.

- Instrument Serif, Copyright 2022 The Instrument Serif Project Authors.
  Files: `instrument-serif-latin-400-normal.woff2` (SHA-256 5eb09b5ac0e28b67c2f041c8ba6d244604ca0c0980d65912ab2d47fed84ddc31),
  `instrument-serif-latin-400-italic.woff2` (SHA-256 5a51946dfffa82972bc98745359c46761515641fda557c25116459a9f83da4a7).
  Licence: `fonts/LICENSE-instrument-serif.txt`.
  Source: https://registry.npmjs.org/@fontsource/instrument-serif/-/instrument-serif-5.3.0.tgz
- Hanken Grotesk (variable), Copyright 2021 The Hanken Grotesk Project Authors.
  File: `hanken-grotesk-latin-wght-normal.woff2` (SHA-256 e9201eddf1d41d0b62253295d869ce3cf65768f7102b797f02c7f8c876b4a9d5).
  Licence: `fonts/LICENSE-hanken-grotesk.txt`.
  Source: https://registry.npmjs.org/@fontsource-variable/hanken-grotesk/-/hanken-grotesk-5.3.0.tgz

The OFL lets you use, bundle and sell the fonts with software. You cannot sell the font files on
their own.

## Ideas and guidance (no code copied)

- Layout and section ideas were informed by popular MIT portfolio templates such as
  cobiwave/simplefolio and codewithsadee/vcard-personal-portfolio. No code from them is included.
- Typography, colour, spacing and motion choices follow the design guidance in
  pbakaus/impeccable (Apache-2.0). No files from that project are included.
