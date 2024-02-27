/**
 *
 */


const FooterShader = {
	
	type: 'O',
	
	name: 'FooterShader',

	weight: 1,

	vertexShader: /* glsl */`
	
		varying vec2 vUv;

		void main()	{
			
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( $$(position), 1.0 );
			
		}`,

	fragmentShader: /* glsl */`
	
		void main() {
			
			gl_FragColor = $$( vUv );
			
		}`
		
};


export { FooterShader };