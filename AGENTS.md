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

## Next Steps

- Tune random paint blending for performance and visual quality.
- Experiment with interpolation step counts and potential spline curves.
- Explore path-based interpolation curves for even smoother motion.
