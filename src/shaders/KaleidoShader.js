/**
 *
 * Ported from examples/jsm/shaders/KaleidoShader.js
 *
 */
 
 
import { Vector2 } from 'three';


const KaleidoShader = {

	name: 'KaleidoShader',

	uniforms: {
		
		sides: { value: 6 },
		angle: { value: 0 },
		resolution: { value: new Vector2(innerWidth,innerHeight) },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec2 p = (vUv - 0.5);
			p.x *= resolution_$.x / resolution_$.y;
			
			float r = length(p);
			float a = atan(p.y, p.x) + angle;
			float tau = 2. * 3.1416 ;
			
			a = mod(a, tau/sides_$);
			a = abs(a - tau/sides_$/2.);
			
			p = r * vec2(cos(a), sin(a));
			
			return $$(p + 0.5);
			
		}`
		
};


export { KaleidoShader };