# Preliminary Tests

This page contains a few preliminary tests. They are used to measure and compare
performance of the traditional use of postprocessing effects against the new
approach. To isolate rendering time, each test allows to run 1, 2, 4, ... 1024
renderings per frame.

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