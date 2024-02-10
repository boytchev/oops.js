# Tutorials

This page describes the Oops.js API and demonstrates its features.


## Using Oops.js

### Initializing effect composer

The postprocessing effects in Oops.js are intentionally similar to those in
Three.js. The effect composer of Oops.js is called `Effects`. Creating an
instance of `Effects` requires a renderer, a scene and a camera.

`Effects` is a manager of postprocessing effects. Initially the composer is
empty. If its `.render` is called it will just render the scene without any
effect. The following demo shows how to create an empty `Effects` and use it
to render the scene.

```js
var composer = new Effects(renderer,scene,camera);
:
function animationLoop( )
{
	composer.render( );
}
```

Run: [Empty effect demo](empty-effect/index.html)
	
[<img src="empty-effect/snapshot.jpg">](empty-effect/index.html)



### Adding effects

The effect composer collects effects and renders them in the animation loop.
Effects are added with the composer's `.addEffect` method and the name of the
effect. Effects are always applied in the order they are added. The composer
attempts to merge effects in order to increase the overall rendering speed.
The following demo shows application of two effects:
* [Sepia](../examples/index.md#sepiashader) to colorize the scene in [sepia color](https://en.wikipedia.org/wiki/Sepia_(color))
* [Film](../examples/index.md#filmshader) to add dynamic TV-like noise


```js
var composer = new Effects(renderer,scene,camera);

composer.addEffect( 'Sepia' );
composer.addEffect( 'Film' );
```

The `.addEffect` method is chainable, so the same code couls be shortened as:

```js
var composer = new Effects(renderer,scene,camera)
    .addEffect( 'Sepia' )
    .addEffect( 'Film' );
```



Run: [Simple effects demo](simple-effects/index.html)
	
[<img src="simple-effects/snapshot.jpg">](simple-effects/index.html)

For a list of available effects see the [Examples](../examples) page.





## Video effect demo

This demo displayes a video via a [video texture](https://threejs.org/docs/#api/en/textures/VideoTexture)
and applies 4 postprocessing effects onto it:
* [Halftone](../examples/index.md#halftoneshader) to create dotted pattern of the video
* [HueSaturation](../examples/index.md#huesaturationshader) to change dynamically the color
* [Vignette](../examples/index.md#vignetteshader) to frame the image in an ellipse
* [TriangleBlur](../examples/index.md#triangleblurshader) to smooth effect transitions

Run: [Video effect demo](video-effect/index.html)
	
[<img src="video-effect/snapshot.jpg">](video-effect/index.html)

