import * as THREE from 'three';


var ENV_MAP = `
			data:image/webp;base64,UklGRvQAAABXRUJQVlA4IOgAAACwBwCdASpAA
			CAAPzmKuFcvKKSjrBVcyeAnCWkAANdzA1rLAldOvERUBuXCMxWu8PTFAEhc+
			jSI084Gao/ed1/AFYd0190AAP7x7UV8jvooHvqAq7Zzp2izqEV1DjjUcckWz
			YyXH0FbSK5VYbnpyRUHpCQjMs61fBmGxJQQFkU4n9ESEPSzjkWDYskyKkosB
			hdDzYsQg9J0JhuZTul59yDyKxsICZO6VwPjau2LpVz47pqkoGbUvqJ+lfX0l
			MGYEMPr88lTDud5SKQVjTUkqKLR/e38wqfmobmC+qBvm6lneQLBJD0qsAAA`;

var envMap = new THREE.TextureLoader().load( ENV_MAP );
	envMap.mapping = THREE.EquirectangularReflectionMapping;
	

// Platon class definition

class Platon extends THREE.Mesh
{
	constructor( radius, level )
	{
		// main shape
		super(
			new THREE.TetrahedronGeometry( 1, 1 ),
			new THREE.MeshStandardMaterial( {
				color: 0xbd9400,
				metalness: 0.47,
				roughness: 0.53,
				envMap: envMap,
				envMapIntensity: 1,
				flatShading: true
			} )
		);

		// first subshape
		var platon1 = new THREE.Mesh(
				new THREE.TetrahedronGeometry( 1, 3 ),
				new THREE.MeshStandardMaterial( {
						color: 0xffffff,
						metalness: 0.47,
						roughness: 0.53,
						envMap: envMap,
						envMapIntensity: 1,
						flatShading: true
				} )
			 );
			platon1.scale.setScalar( 0.809 );
	
		// second subshape
		var platon2 = new THREE.Mesh(
				new THREE.OctahedronGeometry( 1, 4 ),
				new THREE.MeshStandardMaterial( {
						color: 0x850000,
						metalness: 0.47,
						roughness: 0.53,
						envMap: envMap,
						envMapIntensity: 1,
						flatShading: true
				} )
			 );
			platon2.scale.setScalar( 0.709 );
	
		this.add( platon1, platon2 );
	} // Platon.constructor
} // Platon

		
export { Platon };
