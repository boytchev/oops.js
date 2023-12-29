
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


var oldTime = ( performance || Date ).now( ),
	counter = 0,
	fps = 'pending';


function update( params, gui )
{
	counter++;
	
	var time = ( performance || Date ).now( );

	if( time-oldTime < 1000 ) return;
	
	
	var fps = 1000 * counter / (time-oldTime );
	
	params.fps = fps.toFixed(1) + ' / ' + (1000/fps/params.count).toFixed(2)+' ms';
	
	oldTime = time;
	counter = 0;
	
	if( gui ) gui.controllers[1].updateDisplay( );
}		


export { update };
