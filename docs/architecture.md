# Architecture and technical decisions

## State and rendering

The domain is deliberately small: `specimen`, `material`, `expansion`, and `paused`. A discriminated union restricts reducer actions. Expansion is normalized to `[0, 1]`, including non-finite inputs.

React components render semantic HTML controls. The scene receives the same typed configuration. `SceneSignals` carries pointer and scroll targets through a ref; the Three.js render loop reads it without React reconciliation on every frame. Exponential damping uses elapsed time and a capped delta rather than a fixed interpolation percentage.

## Graphics ownership

The canvas is loaded through `React.lazy`. The fallback is available before the renderer. R3F owns declarative geometries, materials, and canvas resources. Unmounting a specimen releases its geometry and materials; GSAP animations and ScrollTriggers are reverted through `gsap.context` cleanup. The context-loss listener is removed when its lifecycle component unmounts.

The local reflection environment uses rectangular area-light geometry, generated once per canvas. There are no remote presets or imported 3D models. Mobile remounts the one active canvas when moving between the introduction and controls; this avoids two simultaneous WebGL contexts at the cost of a brief renderer initialization.

## Performance boundaries

- Desktop pixel ratio: at most 1.75; compact-screen pixel ratio: at most 1.25.
- Compact screens reduce knot segments and environment-map resolution.
- No post-processing passes, soft-shadow render targets, or transparent physical transmission.
- `frameloop='never'` when the document is hidden or the experience is outside the viewport.
- `frameloop='demand'` with reduced motion; configuration changes render a new static frame.
- Procedural geometry generation occurs when a configuration changes, not continuously in the frame callback.

These are implemented policies, not claims about a particular FPS or Lighthouse score. Adaptive GPU profiling and measurements on physical mobile devices are future validation work.

## Accessibility

Native buttons expose `aria-pressed`; the range has a visible label and an output. A polite live region describes the selected specimen. Navigation uses anchors and an active location indicator. A skip link, visible focus rings, readable HTML content, and reduced-motion styling remain independent of the canvas. The canvas is decorative to assistive technology; the surrounding text carries its meaning.

## Testing boundaries

Unit tests cover reducer invariants, invalid numeric values, reset behavior, damping consistency, and render quality policy. Component tests cover keyboard selection, slider updates, material changes, pause/reset, and reduced motion. Playwright specs exercise actual WebGL readiness, mobile layout, keyboard navigation, reduced motion, and synthetic context-loss recovery. Browser tests require a graphics-capable browser environment; jsdom does not validate WebGL output.

## Scope

This project is a self-contained creative experience. Authentication, APIs, databases, and global state libraries would add no useful behavior here and are reserved for the later SaaS project.
