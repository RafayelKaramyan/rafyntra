# Rafyntra

**An interactive study of form, light, and motion.**

Rafyntra turns three mathematical objects into a material laboratory. Visitors can explore a continuously rotating sculpture, change its finish, adjust its expansion, and move between a visual introduction, the controls, and the engineering story.

Built by **Rafayel Karamyan**, a Frontend/UI Developer with commercial React, TypeScript, enterprise UI, and iGaming experience. This is an independent portfolio project, not a client deliverable.

**Live demo:** https://rafayelkaramyan.github.io/rafyntra/

## Explore

- **Helix:** a torus knot with an adjustable tube thickness.
- **Orbit:** three intersecting rings around a metallic centre.
- **Pulse:** twelve rings whose spacing responds to the expansion control.
- Three material finishes: Verdant, Porcelain, and Copper.
- Pointer-responsive framing, scroll-driven orientation, and an explicit motion toggle.
- Native, keyboard-accessible controls and respect for `prefers-reduced-motion`.
- Compact-screen rendering policy and a mobile preview beside the controls.
- A static material illustration and retry action after renderer failure or context loss.

## Run locally

Use Node.js 22.12+; CI targets Node.js 24.

```bash
npm ci
npm run dev
```

Open http://localhost:4173. To validate and build:

```bash
npm run check
npm run build
npm run analyze
npx playwright install --with-deps chromium firefox
npm run test:e2e
```

`npm run analyze` reports actual raw and gzip output sizes and enforces explicit size budgets. It does not measure frame rate or Core Web Vitals.

## Stack

React 19, strict TypeScript, Vite 8, Three.js, React Three Fiber, Drei, GSAP, authored CSS, Vitest, Testing Library, and Playwright. Fonts are bundled locally through Fontsource; no runtime font, model, texture, or environment-map downloads are required.

## Engineering decisions

1. **React owns intent; the render loop owns motion.** A typed reducer handles configuration. Mutable scene signals and Three.js references handle per-frame changes without scheduling React state updates on every frame.
2. **The scene is a separate lazy chunk.** The page, controls, and SVG fallback can render while the WebGL module loads. The WebGL chunk remains substantial, so its gzip size has its own enforced budget rather than an invented performance score.
3. **Geometry and light are procedural.** Local `Lightformer` sources produce reflections. Declarative geometries and materials stay inside the R3F lifecycle, allowing disposal on unmount.
4. **Motion has an accessibility policy.** Reduced motion uses demand rendering, removes automatic rotation and scroll/pointer response, and disables entrance and CSS animations. Hidden tabs and an off-screen study stop the frame loop.
5. **Mobile is a different composition.** Pixel ratio and geometry detail are capped. A single active 3D canvas moves to a dedicated laboratory preview when that section is active, so the controls and result remain close together.
6. **Failure preserves the interface.** An error boundary and WebGL context-loss listener switch to a static material illustration. Visitors can still change the accessible controls and retry rendering.

See [architecture](docs/architecture.md), [validation](docs/validation.md), and the [case study](docs/case-study.md).

## Project layout

```text
src/
  components/  Accessible controls, icons, fallback, and error boundary
  hooks/       Media-query and document-visibility subscriptions
  lib/         Typed configuration, state transitions, and rendering policy
  scene/       Lazy canvas, lifecycle handling, lights, and procedural objects
  test/        Component test setup
  App.tsx      Composition and scroll orchestration
tests/         Browser scenarios for desktop, compact screens, and recovery
docs/          Architecture, case study, validation, and showcase script
scripts/       Build-size reporting
```

## Validation status

Executed checks, browser capabilities, and remaining validation limits are recorded in [docs/validation.md](docs/validation.md). Automatic Pages deployments require a successful Quality checks workflow.

## Deployment

The live demonstration is deployed with GitHub Pages. The deployment workflow builds the application with Node.js 24, runs the code-quality checks, and publishes the static output. The Pages build sets `GITHUB_PAGES=true`, which adjusts Vite's asset base to `/rafyntra/`.

No backend, credentials, analytics, or data collection are needed for this experience.
