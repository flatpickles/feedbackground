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

## Next Steps
- Begin planning M2 (`useDragAndSpring`) once SVG support is confirmed.
- Document usage of `ForegroundLayer` and create placeholder tests.
