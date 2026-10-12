# Rafyntra: a procedural material laboratory

## Problem

A creative frontend project should communicate visual craft while giving an engineering reviewer concrete behavior to inspect. A passive 3D background provides little evidence of state management, accessibility, or failure handling.

## Approach

The experience centres on three mathematical forms. A restrained dark composition and locally generated reflections keep attention on the object. Visitors change the form, finish, and expansion through semantic HTML controls. The scroll narrative introduces the study, exposes its configuration, and explains its engineering.

## Decisions worth discussing

- **A reducer for discrete intent, refs for continuous motion.** This separates testable state transitions from the high-frequency graphics loop.
- **One active canvas.** Mobile moves the preview next to the controls rather than running a second renderer.
- **Procedural assets.** Geometry and lighting are generated in code, avoiding model and texture network requests.
- **Explicit rendering policies.** Pixel ratio, geometry detail, visibility, and reduced motion each have a defined effect.
- **Recovery before spectacle.** A lost graphics context preserves the readable page and controls, offers an illustration, and exposes a retry action.

## Evidence and limits

Consult `validation.md` for checks actually executed. Build-size measurements are available from `npm run analyze`. Frame-rate, Lighthouse, Core Web Vitals, physical-device results, and CI success are not claimed without a recorded run.

## Next improvements

Complete visual QA on the public deployment, collect physical-device GPU measurements, and capture a short real browser demonstration. Further effects should be justified by the composition and the measured performance budget.
