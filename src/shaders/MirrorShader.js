/**
 *
 * Ported from examples/jsm/shaders/MirrorShader.js
 *
 */
 
 
const MirrorShader = {
	
	type: 'O',
	
	weight: 1,

	uniforms: {
		
		side: { value: 1, type: 'int' },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec2 p = vUv;
			
			if (side_$ == 0){
				if (p.x > 0.5) p.x = 1.0 - p.x;
			}else if (side_$ == 1){
				if (p.x < 0.5) p.x = 1.0 - p.x;
			}else if (side_$ == 2){
				if (p.y < 0.5) p.y = 1.0 - p.y;
			}else if (side_$ == 3){
				if (p.y > 0.5) p.y = 1.0 - p.y;
			}
			
			return $$( p );
			
		}`
		
};


export { MirrorShader };