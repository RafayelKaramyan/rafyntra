# Showcase plan and LinkedIn draft

## A 24-second browser recording

Record at 1920 × 1080 or 1440 × 900 with browser chrome hidden. Use the actual live application. Avoid presenting generated footage as a screen recording.

| Time    | Action                                       | What it demonstrates                       |
| ------- | -------------------------------------------- | ------------------------------------------ |
| 0–5 s   | Hold on the hero and move the pointer slowly | Real-time geometry and responsive framing  |
| 5–9 s   | Enter the laboratory                         | Scroll narrative and scene orientation     |
| 9–14 s  | Select Orbit, then Copper                    | Typed UI state driving geometry and finish |
| 14–18 s | Select Pulse and increase expansion          | Controlled procedural geometry             |
| 18–21 s | Pause motion and reset                       | Explicit visitor control                   |
| 21–24 s | Scroll to engineering                        | Decisions behind the visual experience     |

## Screenshot targets

1. Hero with the Verdant Helix.
2. Laboratory with Copper Orbit and visible controls.
3. Compact-screen laboratory with Pulse.

## LinkedIn draft

I built Rafyntra, an interactive material study with React, TypeScript, and Three.js.

The idea was to make a 3D experience that visitors can actually explore: three procedural forms, three finishes, and an expansion control connected to the geometry.

A few engineering decisions behind it:

• React manages the configuration; the graphics loop handles continuous motion through refs.
• Geometry and reflections are generated locally, without downloaded models or textures.
• Native controls work with the keyboard, and reduced motion changes both the animations and rendering policy.
• The interface remains usable when the renderer fails, with a static preview and retry action.

This is the first project in a new series of independent frontend engineering studies.

Demo: https://rafyntra.rafayelchess.chatgpt.site
Source: https://github.com/RafayelKaramyan/rafyntra

#FrontendEngineering #React #TypeScript #ThreeJS #WebGL

Publish this draft only after the live experience and source are available. Attach a real browser recording; do not imply that unexecuted browser tests or CI runs have passed.
