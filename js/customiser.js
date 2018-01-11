
var camera, controls, scene, renderer;
var skateboard;
var stats;

init();
animate();

function init() {
	camera = new THREE.PerspectiveCamera( 60, 1, 1, 1000 ); // Create camera
	camera.position.z = 125;

	controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];
	controls.addEventListener( 'change', render );

	// world
	scene = new THREE.Scene();
	//scene.background = new THREE.Color( 0xcccccc );
	// scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );


  // Load Skateboard
  var loader = new THREE.OBJLoader();
  loader.load('/Assets/3D/Skateboard.obj',	function(object){
    //object.rotation.set(new THREE.Vector3( 0, 0, 0));
    scene.add(object);
    object.rotateZ( 90 * Math.PI / 180 );
    skateboard = object;
  }, OnXHRLoad, OnError);

	// Lights
	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 1, 1, 1 );
	scene.add( light );

	var light = new THREE.AmbientLight( 0x222222 );
	scene.add( light );


	// renderer
  var container = document.getElementById( "three-container" );
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	container.appendChild( renderer.domElement );
  resizeCanvasToDisplaySize(true);

  stats = new Stats();
	container.appendChild( stats.dom );
}

function OnXHRLoad(xhr) {
  console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
}

function OnError(error) {
  console.log("An error Occured");
}

function animate() {
	requestAnimationFrame( animate );

  resizeCanvasToDisplaySize();
	controls.update();
  render();
  stats.update();

}

function render() {
	renderer.render( scene, camera );
}

function resizeCanvasToDisplaySize(force) {
  const parent = renderer.domElement.parentNode;
  const width = parent.clientWidth;
  const height = parent.clientHeight;

  // adjust displayBuffer size to match
  if (force || parent.width !== width || parent.height !== height) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}
