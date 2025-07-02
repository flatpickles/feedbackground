# AGENTS Log and Workflow

This file tracks Codex progress and upcoming tasks. Keep it chronological and append-only.

## Development Workflow

- After each Codex task that results in a commit, append a bullet under **Progress Log** describing the change.
- Update **Next Steps** to outline the next tasks toward the current milestone.
- Run `npm run lint` and `npm run build` before committing; note any failures.
- Human testers should run `npm run dev` (or open the Vercel preview) to confirm the UI renders.

## Progress Log

- **01** – M0 complete. Initialized Vite + React + R3F project with a placeholder `<CanvasStage />`. Lint and build pass.
- **02** – Removed "Next Steps" section from README and referenced AGENTS log. Lint and build pass.
- **03** – Added `ForegroundLayer` with SVG loading and demo in `CanvasStage`. Lint and build pass.
- **04** – Added diamond test SVG and background image support via URL params. Lint and build pass.
- **05** – Added `SvgSize` and configurable sizing modes for `ForegroundLayer`. Lint and build pass.
- **06** – Centered SVG geometry within `ForegroundLayer`. Lint and build pass.
- **07** – Started M2: implemented `useDragAndSpring` hook using `react-spring` and wired it up in `ForegroundLayerDemo`. Lint and build pass.
- **08** – Added cursor state management to `useDragAndSpring` so the canvas shows a grab hand when hovering/dragging. Lint and build pass.
- **09** – Started M3: added `useFeedbackFBO` hook, `motionBlur.frag` shader, and `FeedbackPlane` component. Wired into `ForegroundLayerDemo`. Lint and build pass.
- **10** – Linked `useFeedbackFBO` snapshot rendering to `useDragAndSpring` activity so trails appear only while dragging or springing. Lint and build pass.
- **11** – Fixed feedback FBO so the foreground remains visible while rendering snapshots only during motion. Lint and build pass.

- **12** – Added tweakpane controls for shader selection and decay; introduced session-random uniform and new `randomPaint.frag` shader. Lint and build pass.
- **13** – Modified `randomPaint.frag` to accumulate only alpha and ignore previous RGB history. Added ESLint ignores for Tweakpane usage. Lint passes with a warning; build succeeds despite a PostCSS warning.
- **14** – Revised `randomPaint.frag` to preserve per-pixel color and fade history, enabling multi-color painting. Lint warns on hooks; build succeeds.
- **15** – Added Prettier formatting, session-random reset on drag start, and fixed render blending so history color doesn't fade to black. Lint warns on hooks; build succeeds.
- **16** – Implemented `useFrameInterpolator` hook and wired it into `ForegroundLayerDemo` for smoother motion trails. Lint warns on hooks; build succeeds.
- **17** – Added intra-frame compositing using queued poses in `useFeedbackFBO`, configurable interpolation steps via Tweakpane, and fixed premature spring reset bug. Lint and build pass.
- **18** – Improved sub-frame blending with additive opacity per pose for smoother smears. Lint and build pass.
- **19** – Switched intra-frame blending to full-opacity normal mode to avoid dark trails and maintain union of poses. Lint and build pass.
- **20** – Fixed snapshot compositing by disabling autoClear and removing unnecessary material resets. Interpolated poses now accumulate correctly. Lint and build pass.
- **21** – Flushed interpolation queue when inactive so spring trails don't appear later. Lint and build pass.
- **22** – Switched interpolator to distance-based step sizing with dynamic counts. Lint and build pass.
- **23** – Converted interpolation step controls to pixel units and resized all FBOs using device pixel ratio. Lint and build pass.
- **24** – Updated Tweakpane controls with grouped folders. Decay now ranges 0.8–1, step is 1–25 with integer increments, and SVG size is configurable via dropdown and parameter blades. Lint and build pass.
- **25** – Corrected SVG sizing logic so "natural" uses viewbox pixels, "scaled" multiplies that by a factor, and "relative" sizes to the viewport. Lint and build pass.
- **26** – Fixed overshoot in relative sizing by computing viewport at the SVG layer depth.
- **27** – Corrected cursor state after drag release by checking pointer position and releasing pointer capture. Lint and build pass.
- **28** – Improved drag-release logic to use `elementFromPoint` so the cursor resets reliably when releasing outside the canvas.
- **29** – Simplified drag release handling with a requestAnimationFrame cursor check so the cursor resets once the shape moves. Lint and build pass.
- **30** – Refactored cursor checking to raycast against the dragged group using a shared ref; hooks accept the ref so cursor updates even when the shape moves. Lint and build pass.
- **31** – Fixed quick-release cursor bug by starting springing state before the animation and scheduling the cursor check reliably. Lint and build pass.
- **32** – Added bezier-style smoothing in `useFrameInterpolator`, tracking a previous pose and resetting on drag release. Updated hooks and demo. Lint and build pass.
- **33** – Added optional snapshot blur sized by interpolation step and controlled via Tweakpane. Lint and build pass.
- **34** – Fixed Tweakpane checkbox setup using `addInput` so blur toggle renders correctly. Lint and build pass.
- **35** – Replaced `addInput` with `addBinding` for the blur toggle to match Tweakpane v4 API and updated state syncing. Lint and build pass.
- **36** – Updated `randomPaint.frag` to blend snapshot alpha with history so blurred edges accumulate correctly. Lint and build pass.

## Next Steps

- Tune random paint blending for performance and visual quality.
- Profile high-DPR rendering performance and optimize FBO sizing.
- Expose additional shader uniforms via Tweakpane for experimentation.
