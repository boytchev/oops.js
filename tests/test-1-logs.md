# Test 1 [RGBShift + Vignette + Sepia]

This test applies 3 simple shaders &ndash;
[RGBShiftShader](../examples/index.md#rgbshiftshader),
[VignetteShader](../examples/index.md#vignetteshader) and
[SepiaShader](../examples/index.md#sepiashader).
In the traditional case each shader is wrapped in individual
ShaderPass. In the new approach the shaders are merged into
one shader which is wrapped in a single ShaderPass.

### Case A: EffectComposer + 5 passes + 3 shaders

* RenderPass
* ShaderPass with RGBShiftShader
* ShaderPass with VignetteShader
* ShaderPass with SepiaShader
* OutputPass

### Case B: EffectComposer + 3 passes + 1 oops shader

* RenderPass
* ShaderPass with OOPSSader(RGBShift, Vignette & Sepia shaders)
* OutputPass

# Run №1

* Intel UHD Graphics 630 + ANGLE(Direct3D11)
* 12/30/2023, 4:15:44 PM
* Performance gain 40%

| Renderings | A fps | B fps | Gain |
| :-: | :-: | :-: | :-: |
| 1 | 127.767 | 143.817 | &ndash; |
| 2 | 83.867 | 109.360 | 30% |
| 4 | 48.098 | 62.896 | 31% |
| 8 | 25.963 | 36.001 | 39% |
| 16 | 13.623 | 18.983 | 39% |
| 32 | 6.953 | 9.764 | 40% |
| 64 | 3.508 | 4.952 | 41% |
| 128 | 1.763 | 2.489 | 41% |
| 256 | 0.882 | 1.251 | 42% |
| 512 | 0.442 | 0.627 | 42% |
| 1024 | 0.221 | 0.314 | 42% |

<small>*Note: The browser restricts FPS to 144*</small>


# Run №2

* NVIDIA GeForce GTX 1660 Ti + ANGLE(Direct3D11)
* 12/30/2023, 5:59:08 PM
* Performance gain 55%

| Renderings | A fps | B fps | Gain |
| :-: | :-: | :-: | :-: |
| 1 | 144.034 | 143.866 | &ndash; |
| 2 | 144.03 | 144.027 | &ndash; |
| 4 | 144.027 | 144.031 | &ndash; |
| 8 | 144.035 | 144.024 | &ndash; |
| 16 | 144.028 | 144.028 | &ndash; |
| 32 | 75.447 | 116.845 | 55% |
| 64 | 38.102 | 59.453 | 56% |
| 128 | 19.171 | 30.097 | 57% |
| 256 | 9.63 | 15.121 | 57% |
| 512 | 4.823 | 7.601 | 58% |
| 1024 | 2.485 | 3.803 | 53% |

<small>*Note: The browser restricts FPS to 144*</small>
