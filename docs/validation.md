# Validation record

## Code quality and production build

- Strict TypeScript compilation completed.
- ESLint completed with zero warnings.
- Prettier formatting checks completed.
- 14 unit and component tests passed across 2 files.
- Production compilation, Vite build, and the enforced bundle budgets passed.

The local bundle report measured entry JavaScript at 118,098 gzip bytes, lazy scene JavaScript at 259,416 gzip bytes, and CSS at 4,582 gzip bytes. These are compressed file sizes from Node's zlib. Frame rate and Core Web Vitals have not been measured.

## Browser coverage

The [recorded CI run](https://github.com/RafayelKaramyan/rafyntra/actions/runs/38315276194) completed successfully with all nine browser scenarios. Eight passed on their first attempt; the desktop Chromium controls scenario passed on its retry after reaching the 30-second test limit. The suite now allocates 60 seconds per CI scenario and waits for the slider's Home transition before sending ArrowRight.

| Environment              | Rendering verified                  | Other checks                                                                                                                      |
| ------------------------ | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Desktop Chromium         | Actual WebGL scene                  | Configuration controls, reset, keyboard input, layout overflow, reduced motion, context-loss handling, and retry                  |
| Compact-screen Chromium  | Actual WebGL scene                  | Configuration controls, reset, keyboard input, layout overflow, reduced motion, context-loss handling, and retry                  |
| Firefox on the CI runner | Static fallback; WebGL2 unavailable | Configuration controls, reset, keyboard input, layout overflow, reduced motion, retry, and continued control access after failure |

Chromium scenarios require the real renderer. Firefox probes WebGL2 availability independently: it must use the real renderer when a context can be created, and otherwise must preserve the fallback interface. A fallback pass does not establish Firefox GPU rendering compatibility. Context-loss scenarios dispatch the browser event to exercise the application handler; they do not simulate a physical driver failure.

The public GitHub Pages deployment opened successfully. Its fallback composition and controls were also inspected manually in an environment without WebGL support. The test report retains failures and includes initial-scene screenshots from Chromium runs.

## Remaining validation

- Firefox rendering on a graphics-capable device.
- Physical iOS and Android devices, and Safari.
- Runtime profiling, frame-rate measurements, and Lighthouse/Core Web Vitals.
- A screen-recorded 3D showcase.

The static illustration is a recovery interface and must not be presented as a WebGL render. Current checks and automatic publication results are visible in [GitHub Actions](https://github.com/RafayelKaramyan/rafyntra/actions).
