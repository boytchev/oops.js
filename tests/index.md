# Preliminary Tests

This page contains a few preliminary tests to measure and compare performance
of the traditional use of postprocessing effects versus the new approach. To
isolate rendering time, each test runs 1, 2, ... 1024 renderings per frame.
A temporal average is calculated every second and the final results are
collected after continuous full-screen running for 20 seconds.

The tests are preliminary and not statistically sound.


## Test 1 [RGBShift + Vignette + Sepia]

This test applies 3 simple shaders &ndash;
[RGBShiftShader](../examples/index.md#rgbshiftshader),
[VignetteShader](../examples/index.md#vignetteshader) and
[SepiaShader](../examples/index.md#sepiashader).
In the traditional case each shader is wrapped in individual
ShaderPass. In the new approach the shaders are merged into
one shader which is wrapped in a single ShaderPass.

* Run: [test-1.html](test-1.html)
* Performance gain 40%-55%
* [Detailed results](test-1-logs.md)
		
[<img src="test-1.jpg">](test-1.html)

