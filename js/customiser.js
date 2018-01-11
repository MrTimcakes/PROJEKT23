var CurrentSKU = {Name: "VisiBoard", Deck: "sticker", Wheels: "Blue", Price: 149.99}

var camera, controls, scene, renderer;
var skateboard;
//var stats;
var container = document.getElementById( "three-container" );

var defaultTextures = {
  "Topside": "griptape.jpg",
  "Rim": "plywood.jpg"
}

init();
animate();
createSwatches();
//loadLastEdit();

function init() {
	camera = new THREE.PerspectiveCamera( 60, container.clientWidth / container.clientHeight, 1, 1000 ); // Create camera Assign aspect ratio later
	camera.position.z = 125;

	initControls();
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf6f6ff );
  loadSkateboard();

	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 1, 1, 1 );
	scene.add( light );
	var light = new THREE.AmbientLight( 0x222222 );
	scene.add( light );

	renderer = new THREE.WebGLRenderer( { canvas: document.querySelector("#three-canvas"),antialias: true } );
  renderer.setSize(container.clientWidth, container.clientHeight);
	//renderer.setPixelRatio( window.devicePixelRatio );
	//container.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );
}

function initControls(){
  controls = new THREE.TrackballControls( camera, container );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];
	controls.addEventListener( 'change', render );
}

function loadSkateboard(){
  var TextureLoader = new THREE.TextureLoader();
  var rootDir = "/Assets/3D/Textures/"
  var defaultTextures = {
    "Topside": new THREE.MeshBasicMaterial({map: TextureLoader.load(rootDir + "griptape.jpg")}),
    "Rim": new THREE.MeshBasicMaterial({map: TextureLoader.load(rootDir + "plywood.jpg")})
  }

  // Load Skateboard
  var loader = new THREE.OBJLoader();
  loader.load('/Assets/3D/Skateboard.obj',	function(object){
    //object.rotation.set(new THREE.Vector3( 0, 0, 0));
    scene.add(object);
    object.rotateY( 45 * Math.PI / 180 );
    object.rotateZ( 270 * Math.PI / 180 );

    for(texture in defaultTextures){
      object.getObjectByName(texture).material = defaultTextures[texture];
    }

    skateboard = object;
    loadLastEdit();
  }, OnXHRLoad, OnError);
}

function onWindowResize(){
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  render();
}

function OnXHRLoad(xhr) {
  console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
}

function OnError(error) {
  console.log("An error Occured");
}

function animate() {
	requestAnimationFrame( animate );

  //resizeCanvasToDisplaySize();
	controls.update();
  render();

}

function render() {
	renderer.render( scene, camera );
}

function updateBoard(){
  var TextureRoot = "/Assets/3D/Textures/";
  var TextureLoader = new THREE.TextureLoader();
  var texture = TextureLoader.load(TextureRoot + CurrentSKU.Deck + ".jpg");
  texture.offset.set(-0.9,0);
  texture.repeat.set(4.25,1);
  // texture.repeat.set(2.25,1);
  // texture.offset.set(-0.25,0);
  var material = new THREE.MeshBasicMaterial({map: texture})
  // material.repeat.x = 2.25;
  skateboard.getObjectByName("Underside").material = material;

  for(i=1; i<5; i++){
    skateboard.getObjectByName("Wheel"+i).material.color.setHex( document.querySelectorAll('[data-color-name~="' + CurrentSKU.Wheels + '"]')[0].dataset.color );
  }

  localStorage.setItem("VisiBoardLastEdit", JSON.stringify(CurrentSKU))
}

function loadLastEdit(){
  if(localStorage["VisiBoardLastEdit"]){
    CurrentSKU = JSON.parse( localStorage.getItem("VisiBoardLastEdit") );
    updateBoard();
  }
}

function decalSwatchOnClick(){
  CurrentSKU.Deck = this.dataset.decal;
  updateBoard();
}

function colorSwatchOnClick(){
  CurrentSKU.Wheels = this.dataset.colorName;
  updateBoard();
}

function createSwatches(){
  var DecalRoot = "/Assets/3D/Textures/Thumbs/";
  var Decals = {
    "Sticker": "sticker",
    "Carbon Fibre": "carbon-fibre"
  }
  var Wheels = {
    "Red": 0xff0000,
    "Orange": 0xffa500,
    "Yellow": 0xffff00,
    "Green": 0x008000,
    "Blue": 0x0000ff,
    "Saddlebrown": 0x8b4513,
    "Indego": 0x4b0082,
    "Lime": 0x00ff00,
    "Cyan": 0x00ffff
  }

  for(texture in Decals){
    var newSwatch = document.createElement("div");
    newSwatch.className = "swatch";
    var newDemo = document.createElement("div");
    newDemo.style.backgroundImage = "url('" + DecalRoot + Decals[texture] + ".jpg')"
    var newName = document.createElement("span");
    var decalName = document.createTextNode(texture);

    newName.appendChild(decalName);
    newSwatch.appendChild(newDemo);
    newSwatch.appendChild(newName);

    newSwatch.dataset.decal = Decals[texture];
    newSwatch.addEventListener("click", decalSwatchOnClick);
    document.querySelector("#deck-swatches").appendChild(newSwatch);
  }

  for(color in Wheels){
    var newSwatch = document.createElement("div");
    newSwatch.className = "swatch";
    var newDemo = document.createElement("div");
    newDemo.style.backgroundColor = "rgb(" + (Wheels[color] >> 16) + "," + (Wheels[color]>>8&0xFF) + "," + (Wheels[color]&0xFF) + ")"
    var newName = document.createElement("span");
    var colorName = document.createTextNode(color);

    newName.appendChild(colorName);
    newSwatch.appendChild(newDemo);
    newSwatch.appendChild(newName);

    newSwatch.dataset.color = Wheels[color];
    newSwatch.dataset.colorName = color;
    newSwatch.addEventListener("click", colorSwatchOnClick);
    document.querySelector("#color-swatches").appendChild(newSwatch);
  }
}

document.querySelector("#AddToCartBtn").addEventListener("click", function(e){
  e.preventDefault();
  var cart;
  if(localStorage["Cart"]){
    cart = JSON.parse( localStorage.getItem("Cart") );
  }else{
    cart = [];
  }
  cart.push( JSON.stringify(CurrentSKU) )
  localStorage.setItem("Cart", JSON.stringify(cart))
})
