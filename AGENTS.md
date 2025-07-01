# AGENTS Log and Workflow

This file tracks Codex progress and upcoming tasks. Keep it chronological and append-only.

## Development Workflow

- After each Codex task that results in a commit, append a bullet under **Progress Log** describing the change.
- Update **Next Steps** to outline the next tasks toward the current milestone.
- Run `npm run lint` and `npm run build` before committing; note any failures.
- Human testers should run `npm run dev` (or open the Vercel preview) to confirm the UI renders.

## Progress Log
- **2025-07-01** – Removed "Next Steps" section from README and referenced AGENTS log. Lint and build pass.

- **2025-07-01** – M0 complete. Initialized Vite + React + R3F project with a placeholder `<CanvasStage />`. Lint and build pass.
- **2025-07-02** – Added `ForegroundLayer` with SVG loading and demo in `CanvasStage`. Lint and build pass.
- **2025-07-02** – Added diamond test SVG and background image support via URL params. Lint and build pass.
- **2025-07-03** – Added `SvgSize` and configurable sizing modes for `ForegroundLayer`. Lint and build pass.

- **2025-07-04** – Centered SVG geometry within `ForegroundLayer`. Lint and build pass.

- **2025-07-04** – Started M2: implemented `useDragAndSpring` hook using `react-spring` and wired it up in `ForegroundLayerDemo`. Lint and build pass.

- **2025-07-04** – Added cursor state management to `useDragAndSpring` so the canvas shows a grab hand when hovering/dragging. Lint and build pass.

- **2025-07-05** – Started M3: added `useFeedbackFBO` hook, `motionBlur.frag` shader, and `FeedbackPlane` component. Wired into `ForegroundLayerDemo`. Lint and build pass.

- **2025-07-05** – Linked `useFeedbackFBO` snapshot rendering to `useDragAndSpring` activity so trails appear only while dragging or springing. Lint and build pass.
- **2025-07-05** – Fixed feedback FBO so the foreground remains visible while rendering snapshots only during motion. Lint and build pass.

## Next Steps
- Add shader hot-swap UI controls to switch feedback fragments.
