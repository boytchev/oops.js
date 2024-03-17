# Performance Tests

This page contains preliminary tests to measure and compare performance of the
traditional use of postprocessing effects versus the new approach. Each test
renders the scene 1, 2, ... 1024 times per frame. A temporal average is
calculated every second and the final results are collected after continuous
full-screen running for around 20 seconds or more.

| № | Test | Gain |
| :-: | :-- | :-- |
| 1 | Two simple effects | 20%-28% |
| 2 | Three simple effects | 40%-56% |
| 3 | Four simple shaders | 65%-78% |


## Test №1: Two simple effects

This test merges 2 simple effects ([RGBShift](../gallery/index.md#rgbshift)
and [Colorify](../gallery/index.md#colorify)). Performance is increased by
**20%-28%** ([raw data](test-1/rawdata.md)).

Run: [test-1.html](test-1/index.html)
	
[<img src="test-1/snapshot.jpg">](test-1/index.html)



## Test №2: Three simple effects

This test merges 3 simple effects ([RGBShift](../gallery/index.md#rgbshift),
[Colorify](../gallery/index.md#colorify) and [BrightnessContrast](../gallery/index.md#brightnesscontrast)).
Performance is increased by **40%-56%** ([raw data](test-2/rawdata.md)).

Run: [test-2.html](test-2/index.html)
	
[<img src="test-2/snapshot.jpg">](test-2/index.html)



## Test №3: Four simple shaders

This test merges 4 simple effects ([RGBShift](../gallery/index.md#rgbshift),
[Film](../gallery/index.md#film), [Vignette](../gallery/index.md#vignette) and
[BleachBypass](../gallery/index.md#bleachbypass)). Performance is increased by
**65%-78%** ([raw data](test-3/rawdata.md)).

Run: [test-3.html](test-3/index.html)
	
[<img src="test-3/snapshot.jpg">](test-3/index.html)



## Test 4: Two heavy shaders

This test uses 2 heavy shaders ([Halftone](../gallery/index.md#halftone) and
[Convolution](../gallery/index.md#convolution)).

([raw data](test-4/details.md)).

Run: [test-4.html](test-4/index.html)
	
[<img src="test-4/snapshot.jpg">](test-4/index.html)




<!--
## Test 5<br><small>[Splitting shaders with many samplings]</small>

This test uses 2 shaders ([HalftoneShader](../gallery/index.md#halftoneshader)
and [ConvolutionShader](../gallery/index.md#convolutionshader)) automatically
split into to separate passes. The performance increase is because of baked
uniforms. The overall results is that in this case splitting
**increases performance by 5%-70%** ([details](test-5/details.md)).

Run: [test-5.html](test-5/index.html)
	
[<img src="test-5/snapshot.jpg">](test-5/index.html)

-->