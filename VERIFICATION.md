# Verification notes

Checked on 23 October 2026 using the local Next.js app and its exported static site in Chromium.

## Checks run

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run format:check` — passed.
- `npm run build` — passed; prerendered static routes.
- `npm run build:pages` — passed with `/ui-herosection` as the base path.
- `npm audit --omit=dev` — zero reported vulnerabilities. See the README for the development-only audit advisory.

## Browser checks

- Desktop opening screen: headline, all four metrics, loaded car image, and scene controls visible above the fold.
- Phone layouts at 390 × 844 and 360 × 640: no horizontal overflow; compact layout fits the viewport.
- Tablet layout at 768 × 1024: larger car composition and adjusted scenery.
- Native scroll: progress advanced from 00 to 48 and the car's transform changed while the hero stayed at the top of the viewport.
- Reverse scroll: progress returned to 00 and the car returned to its initial position.
- Chapter buttons: moved through the sequence and updated the active chapter.
- Keyboard: Enter activated a chapter button.
- Day/night controls: updated the scene appearance and pressed states.
- Manual motion-off: removed car transforms, disabled chapter controls, and reduced the runway to the height of the hero.
- Static export: the `/ui-herosection/` page, car image, fonts, and scripts loaded locally. No console warnings or errors were observed during these checks.

The system reduced-motion path is implemented with both CSS and GSAP matchMedia. Its code path was reviewed; the operating system preference was not changed during testing. Manual motion-off was tested in the browser.

No deployment was performed. No Lighthouse score or cross-browser certification is claimed. Before submission, check your actual deployed URL and add it to the README.
