# Tutorials

This page describes the Oops.js API and demonstrates its features.


## Effect composer

The postprocessing effects in Oops.js are intentionally similar to those in
Three.js. The main element is `OOPSEffects`, which is extends the classic
`EffectComposer`. Creating an instance of `OOPSEffects` requires a [renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer),
a [scene](https://threejs.org/docs/#api/en/scenes/Scene) and
a [camera](https://threejs.org/docs/#api/en/cameras/Camera).

The following demo creates an empty `OOPSEffects`, which does
not activate any postprocessing effect.

```js
var composer = new OOPSEffects( renderer, scene, camera );
```

Run: [Empty effect demo](empty-effect/index.html)
	
[<img src="empty-effect/snapshot.jpg">](empty-effect/index.html)


## Video effect demo

This demo displayes a video via a [video texture](https://threejs.org/docs/#api/en/textures/VideoTexture)
and applies 4 postprocessing effects onto it:
* [Halftone](../examples/index.md#halftoneshader) to create dotted pattern of the video
* [HueSaturation](../examples/index.md#huesaturationshader) to change dynamically the color
* [Vignette](../examples/index.md#vignetteshader) to frame the image in an ellipse
* [TriangleBlur](../examples/index.md#triangleblurshader) to smooth effect transitions

Run: [Video effect demo](video-effect/index.html)
	
[<img src="video-effect/snapshot.jpg">](video-effect/index.html)

