# Validation record

## Executed in the development environment

- Production compilation and Vite build completed.
- ESLint completed with zero warnings.
- Strict TypeScript compilation and Prettier formatting checks completed.
- 14 unit and component tests passed across 2 files.
- All numeric and control behaviors described in those tests are covered.

The bundle report passed its enforced limits: entry JavaScript 118,069 gzip bytes, lazy scene JavaScript 259,408 gzip bytes, and CSS 4,580 gzip bytes in the first published build. These are compressed file sizes from Node's zlib, not claims about production user traffic or measured runtime performance.

## Browser verification limitation

The managed preview supervisor reported its supported URL, but the preview browser returned `net::ERR_BLOCKED_BY_CLIENT` when opening it. The public deployment subsequently opened successfully, and the desktop composition was inspected. Its controls were exercised in the browser: selecting Orbit and Copper updated the pressed state and live description; keyboard Home and ArrowRight changed the expansion to 1%.

The initial preview graphics environment reported `GL_VENDOR = Disabled, GL_RENDERER = Disabled` and could not create a WebGL context. The error boundary correctly presented the static illustration and retry control. Actual GPU output, physical-device behavior, reduced-motion browser emulation, WebGL screenshots, a screen-recorded 3D demonstration, Lighthouse scores, and browser E2E passes remain unverified. Do not represent the fallback screenshot as a 3D render.

The Playwright scenarios and GitHub Actions workflows are implemented. Their execution status must be checked after the repository receives the source and CI runs. Cross-browser coverage is configured for Chromium, Firefox, and compact-screen Chromium.
