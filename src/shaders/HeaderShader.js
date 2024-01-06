/**
 *
 */


const HeaderShader = {
	
	type: 'O',
	
	weight: 1,

	uniforms: {

		tDiffuse:  { value: null },

	},

	vertexShader: /* glsl */`
	
		vec3 $( vec3 position ) {
			
			return position;
			
		}`,
		
	fragmentShader: /* glsl */`
	
		varying vec2 vUv;

		vec4 $( vec2 vUv ) {
			
			return texture2D( tDiffuse_$, vUv );
			
		}`
		
};


export { HeaderShader };