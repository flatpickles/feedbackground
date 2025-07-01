# feedbackground — Project Plan

> **Tech stack:** React 18, React-Three-Fiber (R3F) + Drei, TypeScript, Vite, GLSL shaders, Jest + React Testing Library, Storybook (visual tests), ESLint + Prettier

---

Ongoing progress and next steps are tracked in [AGENTS.md](AGENTS.md).

## 0 · Project Intent & Vision

This is an interactive web demo for a subtly interactive hero element on an informational website. The project will largely be built with Codex, though in discrete steps that are guided and tested with human oversight. This document discusses the project plan and development milestones in detail.

At first glance, visitors see a static hero element: any SVG graphic of closed paths (commonly text) over a still background. Under the hood, a feedback renderer (continuous off-screen FBO loop) is already running decay but has no input until interaction.

**On drag:**

- **Pose update:** Each animation frame captures the SVG’s current translate(x,y).
- **Snapshot pass:** Render the SVG (all paths) into `snapshotRT` with alpha.
- **Feedback pass:** Composite `snapshotRT` into the feedback buffer using a fragment shader. The shader reads `uPrevFrame`, applies its decay logic (uniform or custom), then blends in the new snapshot.

Because the loop is always active, snapshots during dragging or spring return create a trail matching the exact SVG geometry. Releasing the drag triggers a spring tween back to center, feeding snapshots until rest; afterward, no new snapshots arrive and the buffer decays back to blank.

**Capabilities:**

- **Any SVG:** Supports arbitrary closed-path SVG (text, icons, logos).
- **Creative shaders:** Swap GLSL fragments (motion blur, chromatic smear, radial feedback).
- **Smooth trails:** Sub-frame interpolation for ultra-smooth motion.
- **Easter-egg UX:** Subtle, rewarding interactivity in a hero overlay.

---

## 1 · High-Level User Experience

| Phase       | What the visitor sees / does                                                            | Under the hood                                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Idle**    | Static hero: background + centered SVG; no trail visible.                               | Feedback loop decays an empty buffer; no snapshots rendered.                                                                     |
| **Hover**   | Cursor switches to grab-hand when over the SVG paths.                                   | Pointer hit-testing via `useDragAndSpring`; CSS cursor set to `grab`.                                                            |
| **Drag**    | SVG graphic moves with cursor; a colored, fading trail appears along the SVG’s outline. | Update pose to follow pointer; render SVG snapshot into `snapshotRT`; composite snapshot into feedback buffer via active shader. |
| **Release** | SVG springs back to center; trail continues until spring settles, then fades out.       | Spring tween drives pose back; snapshots feed buffer until rest; decay-only pass clears buffer afterward.                        |

---

## 2 · Architecture Overview

```text
App
 ├─ CanvasStage.tsx                – Sets up <Canvas> and root hooks
 ├─ <Canvas> (R3F)
 │   ├─ BackgroundPlane           – Static backdrop
 │   ├─ FeedbackPlane             – Full-screen quad sampling `readRT`
 │   └─ ForegroundLayer           – Mesh from any closed-path SVG (ShapeGeometry), applies pose
 ├─ hooks/
 │   ├─ useDragAndSpring()        – Pointer events + spring pose emitter
 │   ├─ useFrameInterpolator()    – Emit sub-frame poses for smooth trails
 │   └─ useFeedbackFBO()          – Manage ping-pong render targets; always run decay+composite
 ├─ shaders/
 │   ├─ motionBlur.frag           – Default feedback shader (history × uDecay + snapshot)
 │   ├─ blur.frag                 – Example custom shader from existing project
 │   └─ shaderRegistry.ts         – Register, compile, hot-swap shaders
 ├─ components/
 │   └─ UIControls.tsx            – Shader chooser, decay slider (optional)
 └─ tests/ (Jest, RTL, Storybook)
```

### 2.1 Always-On Feedback Loop

- **Decay pass:** Runs every frame, fading the existing buffer by shader-defined logic (uniform `uDecay` or custom per-pixel).
- **Input pass:** Only when dragging or springing do we render SVG snapshots into the buffer, producing visible trails.
- **Customizability:** Each shader can override or extend decay behavior for unique effects.

---

## 3 · Rendering Pipeline (per animation frame)

1. **Pose computation:** `useDragAndSpring` + `useFrameInterpolator` yield one or more `{ x, y }` transforms.
2. **Snapshot pass (A):** If motion active, render `ForegroundLayer` to offscreen `snapshotRT`.
3. **Feedback pass (B):** Draw full-screen quad with the active shader:
   ```glsl
   vec4 history = texture2D(uPrevFrame, vUv);
   vec4 snap    = texture2D(uSnapshot, vUv);
   gl_FragColor = customBlend(history, snap);
   ```
   Swap `writeRT` ↔ `readRT`.
4. **Composite pass (C):** Render `BackgroundPlane`, then `FeedbackPlane` (sampling `readRT`), then `ForegroundLayer` on top.

---

## 4 · Modularity & Extensibility

| Part                | How to swap                             | Default                     |
| ------------------- | --------------------------------------- | --------------------------- |
| **SVG source**      | Pass any SVG URL or path data           | Hero text SVG               |
| **Feedback shader** | `shaderRegistry.setActive(name)`        | `motionBlur.frag`           |
| **Decay logic**     | Uniform `uDecay` or custom code         | Exponential decay (uniform) |
| **Interpolation**   | Configure `useFrameInterpolator` params | Linear sub-sampling         |
| **Physics engine**  | Swap `react-spring`                     | `react-spring`              |
| **Input methods**   | Extend for touch, gesture, gamepad      | Mouse/pointer               |

---

## 5 · Development Roadmap & Test Plan

| Milestone                     | Deliverable                                                                         | Tests                                                                        |
| ----------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **M0 – Boilerplate**          | Vite + React + R3F setup; CanvasStage smoke.                                        | Lint passes; CanvasStage renders.                                            |
| **M1 – SVG support**          | Load arbitrary closed-path SVG in ForegroundLayer.                                  | Storybook: snapshots for text, icon, logo.                                   |
| **M2 – Drag & Spring**        | `useDragAndSpring`: pointer drag + spring-back.                                     | Unit: hook outputs; integration: drag moves mesh; spring-on-release.         |
| **M3 – FBO core + shader**    | `useFeedbackFBO` + `motionBlur.frag`; manual snapshot via test control.             | Unit: shaders compile; integration: snapshot decay over frames.              |
| **M4 – Automatic trail**      | Link snapshot pass to drag/spring flags; trail visible & decays correctly.          | Visual regression: trail only during/after motion; fade timing as specified. |
| **M5 – Shader hot-swap**      | Integrate example `blur.frag`; UI controls to switch shaders & tweak decay.         | Integration: hot-swap without errors; shaders render distinct effects.       |
| **M6 – Sub-frame interp**     | Implement `useFrameInterpolator` for N sub-poses; compare linear vs. Bezier curves. | Unit: interpolation math; visual: smoothness at low FPS.                     |
| **M7 – Production readiness** | WebGL fallback; responsive scaling; SEO prerender snapshot.                         | Jest: fallback component; Lighthouse performance & accessibility audit.      |

---

## 6 · Suggested Folder Structure

```text
src/
 ├─ components/
 ├─ hooks/
 ├─ shaders/
 ├─ utils/
 ├─ types/
 └─ tests/
```

---

## 7 · Risks & Mitigations

| Risk                      | Impact            | Mitigation                                            |
| ------------------------- | ----------------- | ----------------------------------------------------- |
| **Complex SVGs**          | High CPU/GPU load | Pre-bake path data; simplify complex curves.          |
| **WebGL context failure** | No effect         | Fallback to static hero; optional CSS-only trail.     |
| **Shader compile errors** | Blank or noisy UI | Precompile & cache shaders; revert to default shader. |

---
