# references directory

This directory contains files from a previous project that used plain Three.js (not React Three Fiber) to implement a ping-pong feedback system. `FragShaderProject` is a subclass of `Project`, designed to ingest and render fragment shaders like `blur.frag`.

These files demonstrate the core principles of the visual effect pipeline we're building in this project: feeding a dynamic input texture into a feedback buffer, blending via shader logic, and managing render targets manually.

While the code here doesn’t use R3F (as our main `feedbackground` project will), it’s still useful as a reference for FBO setup, shader integration, and structuring an open-ended feedback effect system. The `blur` shader is just a simple example — the architecture supports swapping in more creative fragment shaders.
