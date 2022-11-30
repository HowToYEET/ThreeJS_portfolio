import * as THREE from "three";
import { GLTFLoader } from "GLTFLoaders";
import { OrbitControls } from "OrbitController";
import { CSS2DRenderer, CSS2DObject } from "dd";
const black = new THREE.Color("rgb(0, 0, 0)");
const scene = new THREE.Scene();
const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);
const raycaster = new THREE.Raycaster();
const Mouse_pointer = new THREE.Vector2();
const clock = new THREE.Clock();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.x = 0;
camera.position.z = 1;
camera.position.y = 0;
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff);
const width = window.innerWidth - 20;
const height = window.innerHeight - 130;
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(width, height);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
document.body.appendChild(labelRenderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.minDistance = 5;
orbitControls.maxDistance = 150;
orbitControls.enablePan = false;
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
orbitControls.dispose();
orbitControls.update();

const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(0, 1, 7);
scene.add(light);
let mixer;
let stickman;
let Actions;
let Run;
let Idle;
let Animation_Idle;
let Animation_Run;

manager.onLoad = function () {
  console.log("Loading complete!");
};
// LOAD STICKMAN
loader.load(
  "stickman.glb",
  function (glb) {
    //console.log(glb);
    console.log(glb.scene);
    const model = glb.scene;
    model.scale.set(1.3, 1.3, 1.3);
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const animations = glb.animations;

    Idle = THREE.AnimationClip.findByName(animations, "Idle");
    Run = THREE.AnimationClip.findByName(animations, "Run");

    //console.log(Idle, Run);
    stickman = Create_Stickman(model, mixer, Actions, orbitControls, camera);
    mixer.clipAction(Idle).play();
    Animation_Idle = mixer.clipAction(Idle);
    console.log(Animation_Idle);
    Animation_Run = mixer.clipAction(Run);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error(error);
  }
);
let frame;
loader.load(
  "frame.glb",
  function (glb) {
    console.log(glb.scene);
    const model = glb.scene;
    /*model.traverse((child) =>{
      if(child.isObject3D && child.material){
        console.log("hello")
        child.material.color.setHex(0xff9999)
      }
    })*/
    model.scale.set(1, 1, 1);
    model.position.set(9, -1.3, -1);
    model.rotation.z = 0;
    model.rotation.y = Math.PI / 2;
    model.rotation.x = 0;
    //model.material.color.set(0x999999)
    console.log(model);
    frame = model;
    scene.add(model);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("an error has occoured: " + error);
  }
);
let exit;
loader.load(
  "exit.glb",
  function (glb) {
    console.log(glb.scene);
    const model = glb.scene;
    model.position.set(11.5, 1.3, 0);
    model.scale.set(0.2, 0.2, 0.0001);
    model.rotation.z = 0;
    model.rotation.y = 0;
    model.rotation.x = 0;
    console.log(model.children[0].children[0]);
    //model.material.color.set(0x999999)
    exit = model;
    scene.add(model);
    exit.traverse((child) => {
      if (child.isMesh) {
        child.material.transparent = true;
        child.material.opacity = 0;
      }
    });
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("an error has occoured: " + error);
  }
);

// Declare text-containers (mostly mesh)
const geometry = new THREE.BoxGeometry(0, 0, 0);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const Textmesh = new THREE.Mesh(geometry, material);
scene.add(Textmesh);
Textmesh.layers.enableAll();
// create a new div element
const first_mini = document.createElement("div");
const first_text_1 = document.createElement("div");
first_mini_setup();
first_mini.appendChild(first_text_1);
function first_mini_setup() {
  first_mini.className = "label";
  first_mini.id = "first";
  first_mini.setAttribute("style", "white-space: pre;");
  first_mini.style.fontFamily = "Comic Sans MS, Comic Sans, cursive";
  first_mini.textContent =
    "Problem definition: \nHvordan kan IoT bidrage til at minimere unødig kørsel i Aalborg grundet manglende information om ledighed på gratis parkeringspladser?\n\n";
  first_mini.style.color = "black";
  first_mini.style.width = "1280px";
  first_mini.style.height = "700px";
  first_mini.style.overflowY = "scroll";
  first_mini.style.position = "center";
  first_mini.style.overflowX = "hidden";
  first_text_1.setAttribute("style", "white-space: pre;");
  first_text_1.textContent =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's \nstandard dummy text ever since the 1500s, when an unknown printer took a galley\nof type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining\nessentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop\npublishing software like Aldus PageMaker including versions of Lorem Ipsum.\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's \nstandard dummy text ever since the 1500s, when an unknown printer took a galley\nof type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining\nessentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop\npublishing software like Aldus PageMaker including versions of Lorem Ipsum.\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's \nstandard dummy text ever since the 1500s, when an unknown printer took a galley\nof type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining\nessentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop\npublishing software like Aldus PageMaker including versions of Lorem Ipsum.\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's \nstandard dummy text ever since the 1500s, when an unknown printer took a galley\nof type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining\nessentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop\npublishing software like Aldus PageMaker including versions of Lorem Ipsum.\n ";
  first_text_1.textContent +=
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's \nstandard dummy text ever since the 1500s, when an unknown printer took a galley\nof type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining\nessentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop\npublishing software like Aldus PageMaker including versions of Lorem Ipsum.\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's \nstandard dummy text ever since the 1500s, when an unknown printer took a galley\nof type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining\nessentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop\npublishing software like Aldus PageMaker including versions of Lorem Ipsum.\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's \nstandard dummy text ever since the 1500s, when an unknown printer took a galley\nof type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining\nessentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop\npublishing software like Aldus PageMaker including versions of Lorem Ipsum.\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's \nstandard dummy text ever since the 1500s, when an unknown printer took a galley\nof type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining\nessentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop\npublishing software like Aldus PageMaker including versions of Lorem Ipsum.\n ";
  first_text_1.style.width = "1em";
}

const CSS_FIRST_MINI = new CSS2DObject(first_mini);
//console.log(CSSOBJ);
CSS_FIRST_MINI.position.set(8.3, -0.5, 0);
CSS_FIRST_MINI.element.hidden = true;
console.log(CSS_FIRST_MINI);
// create a new div element
const second_mini = document.createElement("div");
second_mini.className = "label";
const CSS_SECOND_MINI = new CSS2DObject(second_mini);
CSS_SECOND_MINI.position.set(19, 1, 0.1);

const btn = document.createElement("button");
btn.className = "label_btn";
btn.textContent = "Expand";
const CSS_BTN = new CSS2DObject(btn);
CSS_BTN.position.set(8.3, 2.17, -1);

const explain = document.createElement("div");
explain.style.fontFamily = "Comic Sans MS, Comic Sans, cursive";
explain.textContent = "Click EXPAND or press SPACEBAR for expanding";
explain.style.visibility = "hidden";
const CSS_EXPLAIN = new CSS2DObject(explain);
CSS_EXPLAIN.position.set(6, 2, -1);

const fst_abstract = document.createElement("div");
fst_abstract.textContent =
  "First mini project. \n  \n how to optimize \n parking in  Aalborg";
fst_abstract.setAttribute("style", "white-space: pre;");
fst_abstract.width = "20px";
fst_abstract.style.textAlign = "center";
fst_abstract.style.fontFamily = "Comic Sans MS, Comic Sans, cursive";
const CSSFIRST = new CSS2DObject(fst_abstract);
CSSFIRST.position.set(8.3, 1.2, -0.99);

const image_explain = fst_abstract.cloneNode();
image_explain.textContent = "Here are some images from the first project";
const CSSFIRSTIMAGETEXT = new CSS2DObject(image_explain)
console.log(CSSFIRSTIMAGETEXT)
CSSFIRSTIMAGETEXT.position.set(18.2,0, 0)
// Add text to screen here
Textmesh.add(CSS_FIRST_MINI);
Textmesh.add(CSS_SECOND_MINI);
Textmesh.add(CSS_BTN);
Textmesh.add(CSS_EXPLAIN);
Textmesh.add(CSSFIRST);
Textmesh.add(CSSFIRSTIMAGETEXT);

// instantiate a Textureloader
const ProfileImageTexture = new THREE.TextureLoader().load("images/profil.jpg");
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const image_geometry = new THREE.BoxGeometry(1.23, 1.5, 1);
const Prifle_image_material = new THREE.MeshBasicMaterial({ map: ProfileImageTexture });
const Profile_imageMesh = new THREE.Mesh(image_geometry, Prifle_image_material);
Profile_imageMesh.position.set(-12, 1, -1);

const Keychain_tech = new THREE.TextureLoader().load("images/Keychain_electronics.jpg");
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const Keychain_tech_image_geometry = new THREE.BoxGeometry(3, 2.4, 3);
const Keychain_tech_image_material = new THREE.MeshBasicMaterial({ map: Keychain_tech });
const Keychain_tech_mesh = new THREE.Mesh(Keychain_tech_image_geometry, Keychain_tech_image_material);
Keychain_tech_mesh.position.set(25, 0, -2);

const Keychain = new THREE.TextureLoader().load("images/keychain.jpg");
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const Keychain_image_material = new THREE.MeshBasicMaterial({ map: Keychain });
const Keychain_image_geometry = new THREE.BoxGeometry(2, 2, 2);
const Keychain_mesh = new THREE.Mesh(Keychain_image_geometry, Keychain_image_material);
Keychain_mesh.position.set(21, 1.5, -2);

const Skabelon = new THREE.TextureLoader().load("images/skabelon.jpg");
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const Skabelon_image_geometry = new THREE.BoxGeometry(2, 2, 2);
const Skabelon_image_material = new THREE.MeshBasicMaterial({ map: Skabelon });
const Skabelon_mesh = new THREE.Mesh(Skabelon_image_geometry, Skabelon_image_material);
Skabelon_mesh.position.set(21, -1.5, -2);

const Proces_1 = new THREE.TextureLoader().load("images/process_1.jpg");
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const Proces_1_image_geometry = new THREE.BoxGeometry(2, 2, 2);
const Proces_1_image_material = new THREE.MeshBasicMaterial({ map: Proces_1 });
const Proces_1_Mesh = new THREE.Mesh(Proces_1_image_geometry, Proces_1_image_material);
Proces_1_Mesh.position.set(16, 1.5, -2);

const future_keychain = new THREE.TextureLoader().load("images/future_keychain.jpg");
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const future_keychain_image_geometry = new THREE.BoxGeometry(2, 2, 2);
const future_keychain_image_material = new THREE.MeshBasicMaterial({ map: future_keychain });
const future_Mesh = new THREE.Mesh(future_keychain_image_geometry, future_keychain_image_material);
future_Mesh.position.set(16, -1.5, -2);

scene.add(Profile_imageMesh);
scene.add(Proces_1_Mesh);
scene.add(Keychain_tech_mesh);
scene.add(Keychain_mesh);
scene.add(Skabelon_mesh)
scene.add(future_Mesh)
function Create_Stickman(model, mixer, animations, orbit, camera) {
  let stickman = {
    model: model,
    mixer: mixer,
    Actions: animations,
    orbitcontroller: orbit,
    camera: camera,
  };
  stickman.model.position.y = -1.9;
  stickman.model.position.z = 0.3;
  return stickman;
}

function checkKeydown(e) {
  if (e.keyCode == "37") {
    // left arrow
    //Animation_Idle.fadeOut(1)
    Animation_Idle.stop();
    Animation_Run.play();
    stickman.model.position.x -= 0.08;
    camera.position.x = stickman.model.position.x;
    stickman.model.rotation.y = -Math.PI / 2;
    opacity_stickman();
  } else if (e.keyCode == "39") {
    //right arrow
    Animation_Idle.stop();
    Animation_Run.play();
    stickman.model.rotation.y = Math.PI / 2;
    stickman.model.position.x += 0.08;
    camera.position.x = stickman.model.position.x;
    opacity_stickman();
    // SPACEBAR press
  } else if (e.keyCode == "32") {
    if (stickman.model.position.x > 6 && stickman.model.position.x < 10) {
      open = true;
      Hide_first_mini();
    }
  }
}

function checkKeyup() {
  Animation_Run.stop();
  Animation_Idle.play();
  stickman.model.rotation.y = 0;
}

function Hide_first_mini() {
  console.log("gg");
  fst_abstract.style.filter = "blur(10px)";
  btn.style.filter = "blur(10px)";

  CSS_EXPLAIN.element.hidden = true;
  CSS_FIRST_MINI.element.hidden = false;

  frame.traverse((child) => {
    if (child.isObject3D && child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0.05;
    }
  });
  exit.traverse((child) => {
    if (child.isMesh) {
      child.material.transparent = true;
      child.material.color = black;
      child.material.opacity = 1;
    }
  });

  stickman.model.traverse((child) => {
    if (child.isObject3D && child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0.05;
    }
  });
}

function opacity_stickman(){
  if(stickman.model.position.x > 13 && stickman.model.position.x < 28){
    stickman.model.traverse((child) => {
      if (child.isObject3D && child.isMesh) {
        child.material.transparent = true;
        child.material.opacity = 0.05;
      }
    });
  }else{
    stickman.model.traverse((child) => {
      if (child.isObject3D && child.isMesh) {
        child.material.transparent = true;
        child.material.opacity = 1;
      }
    });
  }
}

function Show_first_mini() {
  stickman.model.traverse((child) => {
    if (child.isObject3D && child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 1;
    }
  });
  frame.traverse((child) => {
    if (child.isObject3D && child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 1;
    }
  });
  exit.traverse((child) => {
    if (child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0;
    }
  });
  fst_abstract.style.filter = "blur(0px)";
  btn.style.filter = "blur(0px)";
  CSS_EXPLAIN.element.hidden = false;
  CSS_FIRST_MINI.element.hidden = true;
}

document.addEventListener("click", (event) => {
  if (!first_mini.contains(event.target)) {
    Show_first_mini(event);
  }
  if (btn.contains(event.target)) {
    Hide_first_mini(event);
  }
});
document.addEventListener("keydown", (event) => {
  checkKeydown(event);
  ShowText();
});
document.addEventListener("keyup", () => {
  checkKeyup();
});
window.addEventListener("resize", () => {
  const width = window.innerWidth - 20;
  const height = window.innerHeight - 150;
  let aspect = width / height;
  console.log(aspect);
  renderer.setSize(width, height);
  //camera.fov = aspect
  camera.aspect = aspect;
  camera.updateProjectionMatrix();

  //stickman.model.scale.set(1*aspect, 1*aspect, 1*aspect)
});

document.addEventListener("mousedown", onDocumentMouseDown, false);
function onDocumentMouseDown(event) {
  event.preventDefault();

  Mouse_pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  Mouse_pointer.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(Mouse_pointer, camera);

  var intersects = raycaster.intersectObjects(exit.children);
  console.log(intersects);
  if (intersects.length > 1) {
    Show_first_mini();
  }
}

function ShowText() {
  if (stickman.model.position.x > 6 && stickman.model.position.x < 10) {
    setTimeout(() => {
      explain.style.visibility = "visible";
    }, 5000);
  } else {
    explain.style.visibility = "hidden";
  }
}
//END
animate();

function animate() {
  requestAnimationFrame(animate);
  if (mixer) {
    mixer.update(clock.getDelta());
    Profile_imageMesh.rotation.y += 0.001;
  }
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}
