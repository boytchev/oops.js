# Preliminary Tests

This page contains a few preliminary tests. They are used to measure and compare
performance of the traditional use of postprocessing effects versus the new
approach. To isolate rendering time, each test runs N renderings per frame, where
N = 1, 2, 4, ... 1024. Reported values are the overall **FPS** for N renderings
in a frame and the **time for a single rendering**, i.e. 1000/(FPS&times;N) ms.

The tests are preliminary and not statistically sound.


## Test 1 [RGBShift, Vignette, Sepia]

#### EffectComposer + 5 traditional passes

* RenderPass
* ShaderPass with RGBShiftShader
* ShaderPass with VignetteShader
* ShaderPass with SepiaShader
* OutputPass

#### EffectComposer + 3 traditional passes + 1 oops pass

* RenderPass
* OOPSPass with RGBShiftShader + VignetteShader + SepiaShader
* OutputPass

#### Result