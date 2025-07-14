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
- **37** – Switched `randomPaint.frag` to premultiplied alpha blending to remove dark edges. Lint and build pass.
- **38** – Revised `randomPaint.frag` to use alpha compositing with decay, preventing color blowout and keeping edges smooth. Lint and build pass.
- **39** – Refactored `ForegroundLayer` into `SvgMesh`, extracted `DraggableSvg` and `DemoControls` components, and updated README. Lint and build pass.

- **40** – Added text foreground option with tweakpane controls and new `TextMesh`. Updated demo to choose between diamond SVG and custom text. Lint and build pass.

- **41** – Reorganized Tweakpane controls with a new "Foreground Sizing" section, moved preprocess under "Foreground", and fixed text relative sizing by computing bounds from unscaled geometry. Lint warns on hooks; build succeeds.
- **42** – Updated text bounds to use `textRenderInfo.blockBounds` so relative sizing scales correctly. Lint warns on hooks; build succeeds.
- **43** – Retrieved text bounds from the generated geometry to further fix relative sizing. Lint warns on hooks; build succeeds.
- **44** – Calculated text bounds from `visibleBounds` scaled by `fontSize` and added console logging for debugging. Lint warns on hooks; build succeeds.
- **45** – Investigated text sizing further; troika-three-text metrics use font units and don't map cleanly to viewport pixels. Concluded reliable relative sizing isn't feasible without major redesign. Lint and build pass.
- **46** – Disabled 'relative' size mode when text source is active; Tweakpane now hides the option and reverts to scaled. Lint and build pass.
- **47** – Added `rippleFade.frag` shader to effect dropdown and updated shader map in demo. Lint and build pass.

- **47** – Allocated feedback render targets with `HalfFloatType` to eliminate residual trails at high decay. Lint and build pass.
- **48** – Added background chooser (wildflowers or white) in Tweakpane and threaded state through components. Lint and build pass.

- **48** – Added `uTime` uniform in `useFeedbackFBO` and implemented noise-driven warp in `rippleFade.frag`. Lint and build pass.
- **49** – Added "paint while still" option with Tweakpane checkbox to control snapshot painting at rest. Lint and build pass.
- **50** – Fixed "paint while still" checkbox using `addBinding` so it renders correctly. Lint and build pass.
- **51** – Added Perlin-noise offset to `rippleFade.frag` with tweakable speed and size; new sliders wired through `DemoControls` and `useFeedbackFBO`.

- **52** – Fixed "paint while still" so snapshots render every frame when enabled. Updated `useFeedbackFBO` and its call site. Lint and build pass.

- **53** – Reorganized Tweakpane sections, added effect-parameter folder with noise controls gated by shader selection, removed box blur, and adjusted defaults. Lint and build pass.

- **54** – Fixed foreground control ordering so size parameters stay above "paint while still" when switching options. Lint and build pass.
- **55** – Reordered size parameter logic so sliders reinsert above paint control when switching options. Lint and build pass.
- **56** – Updated defaults and parameter names, added URL param for text, new ripple fade zoom control, and renamed noise params to speed/displacement. Lint and build pass.
- **57** – Centered ripple zoom on foreground position with new uniform and limited range. Lint and build pass.
- **58** – Added "center zoom" toggle to switch ripple zoom between canvas center and foreground. Lint and build pass.
- **59** – Faded out new Overview panel on first drag and hid Tweakpane on small screens. Lint and build pass.
- **60** – Moved DemoControls outside the R3F Canvas by hoisting state to `App` and updating component props. Lint and build pass.
- **61** – Added noise "detail" parameter to ripple fade effect with new Tweakpane slider and shader uniform. Lint and build pass.
- **62** – Refactored effect registry to define ordered pass lists and updated `useFeedbackFBO` to run them sequentially. Components now look up passes by name. Updated README. Lint and build pass.
- **63** – Simplified feedback pipeline with implicit snapshot and per-pass buffers. Removed preprocess blur handling and updated components, shaders, and docs. Lint and build pass.
- **64** – Removed unused `uPreviousFrameLastPass` uniform and blur special casing. Blur now runs as a normal pass with radius from interpolation step. Updated shaders, hook, and docs. Lint and build pass.
- **65** – Fixed pass buffer allocation so multi-pass effects don't crash and ripple fade parameters work again. Lint and build pass.
- **66** – Corrected uniform names for pass parameters and ensured render targets resize when switching effects. Lint warns on hooks; build succeeds.
- **67** – Removed pass descriptor names, refactored parameter plumbing, added blur radius control, and fixed interp step to constant. Lint warns; build succeeds.
- **68** – Synced ripple effect parameters across effect switches using refs so tweakpane values persist. Lint warns; build succeeds.
- **69** – Refactored pass model to declare effect parameters per pass and auto-generate Tweakpane controls. Removed blur special-casing. Lint warns; build succeeds.
- **70** – Introduced pass registry and reused ripple fade pass for blurred ripple effect. Lint warns; build passes.

- **71** – Fixed mobile Safari viewport scroll by using `100dvh` height and `touch-action:none` on the canvas container. Updated meta viewport, added overflow locks, and disabled page scrolling. Lint warns; build succeeds.
- **72** – Converted `ensureTargets` to `useCallback` and updated dependencies. Lint and build pass.

- **72** – Documented URL query params, effect names, and Tweakpane defaults in README. Lint warns; build succeeds.

- **72** – Removed `console.log` debug statement from `TextMesh`. Lint warns on hooks; build succeeds.
- **72** – Added cleanup for shader materials and geometries in `useFeedbackFBO` when passes change. Lint and build pass.
- **73** – Disabled depth buffers in feedback render targets to reduce memory usage. Lint and build pass.
- **74** – Introduced generic `Pass` type with `setup` and `render` hooks and refactored shader passes and `useFeedbackFBO` to use it. Lint and build pass.

## Next Steps

- Implement more multi-pass effects using the new pipeline.
- Tune random paint and ripple fade blending for performance and visual quality.
- Profile high-DPR rendering performance and optimize FBO sizing.
- Expose additional shader uniforms via Tweakpane for experimentation.
- Consider alternate text display since reliable relative sizing is not feasible.
- Add more background images and color options to the new selector.
- Hook up effect-specific parameters for additional shaders.
- Add URL parameters for effect controls beyond text.
- Investigate "unsupported GSUB table LookupType 6" console warning from troika text.
- Audit for stray debugging logs and remove them from production code.
- Verify GPU resources are released when switching effects.
- Confirm memory savings from disabling FBO depth buffers.
