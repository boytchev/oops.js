/*
	OOPS Effects KnowledgeBase
	
	KB = {
		shadername: {
			ignoreUniformBaking: [string,string,...],	// do not bake uniforms with these names
			defaultTextureName: string,					// default texture uniform name (or 'tDiffuse' if not defined)
			defaultUVCoordName: string,					// default UV coordinates name (or 'vUv' if not defined)
			simpleShader: boolean,						// if true, shader uses tDiffuse, vUv and has no passes
			fragmentPreprocessing: function(pass),		// called after loading a fragment shader
		}
	}
*/


import { renameWord } from './oops.utils.js';


const KB = {

	/*------------------------------------------------------
		The OuputShader defines toneMappingExposure not in
		the shade code, but in include file, so it is not
		possible to bake its value in the shader code.
	*/
	OutputShader: {
		simpleShader: false,
		ignoreUniformBaking: ['toneMappingExposure'],
	},

	
	/*------------------------------------------------------
		The fragment shader of FreiChenShader contains:
			vec3 sample;
		which causes:
			ERROR: 0:95: 'sample' : Illegal use of reserved word
		thus 'sample' is replaced by 'sampleRGB'
	*/
	FreiChenShader: {
		fragmentPreprocessing: fpFreiChenShader,
	}
	
}




function fpFreiChenShader( pass )
{
	pass.fragmentShader = renameWord( pass, 'fragmentShader', 'sample', 'sampleRGB' );

}

export { KB };
