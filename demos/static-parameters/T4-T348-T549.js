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
			new THREE.TetrahedronGeometry( 1, 3 ),
			new THREE.MeshStandardMaterial( {
				color: 0x74b9a4,
				metalness: 0.47,
				roughness: 0.53,
				envMap: envMap,
				flatShading: true
			} )
		);

		// first subshape
		var platon1 = new THREE.Mesh(
				new THREE.TetrahedronGeometry( 1, 2 ),
				new THREE.MeshStandardMaterial( {
						color: 0xffffff,
						metalness: 0.95,
						roughness: 0.05,
						envMap: envMap,
						flatShading: true
				} )
			 );
			platon1.scale.setScalar( 0.995 );
	
		// second subshape
		var platon2 = new THREE.Mesh(
				new THREE.TetrahedronGeometry( 1, 4 ),
				new THREE.MeshStandardMaterial( {
						color: 0x0e0e0c,
						metalness: 0.47,
						roughness: 0.53,
						envMap: envMap,
						flatShading: true
				} )
			 );
			platon2.scale.setScalar( 0.973 );
	
		this.add( platon1, platon2 );
	} // Platon.constructor
} // Platon

		
export { Platon };
