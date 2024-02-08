# Tests

This page contains a few preliminary tests to measure and compare performance
of the traditional use of postprocessing effects versus the new approach. To
isolate rendering time, each test runs N = 1, 2, ... 1024 renderings per frame.
A temporal average is calculated every second and the final results are
collected after continuous full-screen running for 20 seconds.

The tests are preliminary and not statistically sound. However, they show that
the reduction of number of passes increaces performance, but merging shaders with
many samplings may actually decrease it (see Test 4).


## Test 1<br><small>[Merging 2 shaders in one]</small>

This test merges 2 simple shaders ([RGBShiftShader](../examples/index.md#rgbshiftshader)
and [ColorifyShader](../examples/index.md#colorifyshader))
into one OOPS shader. The shader is used by a ShaderPass in an EffectComposer.
Merging increases performance by **20%-40%** ([details](test-1/details.md)).

Run: [test-1.html](test-1/index.html)
	
[<img src="test-1/snapshot.jpg">](test-1/index.html)



## Test 2<br><small>[Merging 3 shaders in one]</small>

This test merges 3 simple shaders ([RGBShiftShader](../examples/index.md#rgbshiftshader),
[ColorifyShader](../examples/index.md#colorifyshader) and
[BrightnessContrastShader](../examples/index.md#brightnesscontrastshader)) into
one OOPS shader. The shader is used by a ShaderPass in an EffectComposer.
Merging increases performance by **40%-70%** ([details](test-2/details.md)).

Run: [test-2.html](test-2/index.html)
	
[<img src="test-2/snapshot.jpg">](test-2/index.html)



## Test 3<br><small>[Merging 4 shaders in one]</small>

This test merges 4 simple shaders ([RGBShiftShader](../examples/index.md#rgbshiftshader),
[FilmShader](../examples/index.md#filmshader),
[VignetteShader](../examples/index.md#vignetteshader) and
[BleachBypassShader](../examples/index.md#bleachbypassshader)) into one OOPS
shader. The shader is used by a ShaderPass in an EffectComposer.
Merging increases performance by **70%-100%** ([details](test-3/details.md)).

Run: [test-3.html](test-3/index.html)
	
[<img src="test-3/snapshot.jpg">](test-3/index.html)



## Test 4<br><small>[Merging shaders with many samplings]</small>

This test merges 2 shaders ([HalftoneShader](../examples/index.md#halftoneshader)
and [ConvolutionShader](../examples/index.md#convolutionshader)) into one OOPS
shader. The shader is used by a ShaderPass in an EffectComposer. The shaders
samples a texture 109 and 25 times. Using the shaders in separate passes results
in 109+25=134 samplings per fragment, while merging the shaders results to 
109&times;25=2725 samplings. The overall results is that in this case merging
**decreases performance by 65%-80%** ([details](test-4/details.md)).

Run: [test-4.html](test-4/index.html)
	
[<img src="test-4/snapshot.jpg">](test-4/index.html)




## Test 5<br><small>[Splitting shaders with many samplings]</small>

This test uses 2 shaders ([HalftoneShader](../examples/index.md#halftoneshader)
and [ConvolutionShader](../examples/index.md#convolutionshader)) automatically
split into to separate passes. The performance increase is because of baked
uniforms. The overall results is that in this case splitting
**increases performance by 5%-70%** ([details](test-5/details.md)).

Run: [test-5.html](test-5/index.html)
	
[<img src="test-5/snapshot.jpg">](test-5/index.html)

