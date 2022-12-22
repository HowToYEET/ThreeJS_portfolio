import * as THREE from "three";
import { GLTFLoader } from "GLTFLoaders";
import { OrbitControls } from "OrbitController";
import { CSS2DRenderer, CSS2DObject } from "dd";
const black = new THREE.Color("rgb(0, 0, 0)");
const scene = new THREE.Scene();
const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);
const raycaster = new THREE.Raycaster();
const raycaster_exit_2nd = new THREE.Raycaster();
const raycaster_image = new THREE.Raycaster();
const Mouse_pointer = new THREE.Vector2();
const clock = new THREE.Clock();
let objects = [];
let stickman_object = [];
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
let frame_fst;
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
    frame_fst = model;
    scene.add(model);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("an error has occoured: " + error);
  }
);
let exit_fst;
loader.load(
  "exit.glb",
  function (glb) {
    console.log(glb.scene);
    const model = glb.scene;
    model.position.set(10.8, 1.3, 0);
    model.scale.set(0.2, 0.2, 0.0001);
    model.rotation.z = 0;
    model.rotation.y = 0;
    model.rotation.x = 0;
    console.log(model.children[0].children[0]);
    //model.material.color.set(0x999999)
    exit_fst = model;
    scene.add(model);
    exit_fst.traverse((child) => {
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
let exit_2nd;
loader.load(
  "exit.glb",
  function (glb) {
    console.log(glb.scene);
    const model = glb.scene;
    model.position.set(38.2, 1.60, 0);
    model.scale.set(0.2, 0.2, 0.0001);
    model.rotation.z = 0;
    model.rotation.y = 0;
    model.rotation.x = 0;
    console.log(model.children[0].children[0]);
    //model.material.color.set(0x999999)
    exit_2nd = model;
    scene.add(model);
    exit_2nd.traverse((child) => {
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
let frame_2nd;
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
    model.position.set(35, -1.3, -1);
    model.rotation.z = 0;
    model.rotation.y = Math.PI / 2;
    model.rotation.x = 0;
    //model.material.color.set(0x999999)
    console.log(model);
    frame_2nd = model;
    scene.add(model);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("an error has occoured: " + error);
  }
);

let exit_3rd;
loader.load(
  "exit.glb",
  function (glb) {
    console.log(glb.scene);
    const model = glb.scene;
    model.position.set(93, 1.65, 0);
    model.scale.set(0.2, 0.2, 0.0001);
    model.rotation.z = 0;
    model.rotation.y = 0;
    model.rotation.x = 0;
    console.log(model.children[0].children[0]);
    //model.material.color.set(0x999999)
    exit_3rd = model;
    scene.add(model);
    exit_3rd.traverse((child) => {
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

let frame_3rd;
loader.load(
  "frame.glb",
  function (glb) {
    console.log(glb.scene);
    const model = glb.scene;
    model.scale.set(1, 1, 1);
    model.position.set(90, -1.3, -1);
    model.rotation.z = 0;
    model.rotation.y = Math.PI / 2;
    model.rotation.x = 0;
    //model.material.color.set(0x999999)
    console.log(model);
    frame_3rd = model;
    scene.add(model);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("an error has occoured: " + error);
  }
);

let plant;
loader.load(
  "plant.glb",
  function (glb) {
    console.log(glb.scene)
    const model = glb.scene;
    model.scale.set(0.1, 0.1, 0.1)
      model.traverse((child) =>{
      if(child.isObject3D && child.material){
        console.log("hello")
        child.material.color.setHex(0xff9999)
      }
    })
    //scene.add(model)
  },
  function (xhr) {},
  function (error) {}
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
  
  first_mini.style.position = "center";
  first_mini.style.overflowX = "hidden";
  first_text_1.setAttribute("style", "white-space: pre;");
  first_text_1.style.width = "1em";
  fetch("first_mini.txt")
    .then((response) => response.text())
    .then((text) => (first_text_1.textContent = text));
  first_mini.style.overflowY = "scroll";
}

const CSS_FIRST_MINI = new CSS2DObject(first_mini);
//console.log(CSSOBJ);
CSS_FIRST_MINI.position.set(8.3, -0.5, 0);
CSS_FIRST_MINI.element.hidden = true;
console.log(CSS_FIRST_MINI);

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
const CSSFIRSTIMAGETEXT = new CSS2DObject(image_explain);
console.log(CSSFIRSTIMAGETEXT);
CSSFIRSTIMAGETEXT.position.set(18.45, 0, 0);

// INTRO
const intro = first_text_1.cloneNode(true);
intro.setAttribute("style", "white-space: pre;");
intro.style.fontFamily = "Comic Sans MS, Comic Sans, cursive";
fetch("intro.txt")
.then((response) => response.text())
.then((text) => (intro.textContent = text));
const CSS_INTRO = new CSS2DObject(intro);
CSS_INTRO.position.set(0, 1, 0);

// create a new div element
const second_mini = first_mini.cloneNode();
const second_mini_text = first_text_1.cloneNode(true);

console.log(second_mini_text);
second_mini_setup();
second_mini.appendChild(second_mini_text);
console.log(second_mini.innerText);
function second_mini_setup() {
  second_mini.removeAttribute("hidden");
  second_mini.className = "second_mini_label";
  fetch("second_mini.txt")
    .then((response) => response.text())
    .then((text) => (second_mini_text.textContent = text));
}

const CSS_SECOND_MINI = new CSS2DObject(second_mini);
CSS_SECOND_MINI.position.set(35, -0.5, 0);
CSS_SECOND_MINI.element.hidden = true;

const second_btn = btn.cloneNode(true);
const CSS_BTN_SECOND = new CSS2DObject(second_btn);
CSS_BTN_SECOND.position.set(34.3, 2.17, -1);

const second_abstract = fst_abstract.cloneNode();
second_abstract.textContent =
  "Second mini project \n \n How to show emotions \n on a plant based on \n basic needs";
const CSS_SECOND_ABSTRACT = new CSS2DObject(second_abstract);
CSS_SECOND_ABSTRACT.position.set(34.27, 1.2, -0.99);
const second_explain = explain.cloneNode(true);
const CSS_EXPLAIN_SECOND = new CSS2DObject(second_explain);
CSS_EXPLAIN_SECOND.position.set(32, 2, -1);

const second_image_text = fst_abstract.cloneNode();
second_image_text.textContent = "Here is the second mini project images";
const CSS_SECOND_IMAGE = new CSS2DObject(second_image_text);
CSS_SECOND_IMAGE.position.set(50, 1.5, -1);

const third_mini = first_mini.cloneNode();
const third_mini_text = first_text_1.cloneNode(true);

console.log(third_mini_text);
third_mini_setup();
third_mini.appendChild(third_mini_text);
console.log(second_mini.innerText);
function third_mini_setup() {
  third_mini.removeAttribute("hidden");
  third_mini.className = "third_mini_label";
  fetch("third_mini.txt")
    .then((response) => response.text())
    .then((text) => (third_mini_text.textContent = text));

  //second_mini_text.textContent = "hej"; //Insert Second mini porject text here
}

const CSS_THIRD_MINI = new CSS2DObject(third_mini);
CSS_THIRD_MINI.position.set(90, -0.5, 0);
CSS_THIRD_MINI.element.hidden = true;

const third_btn = btn.cloneNode(true);
const CSS_BTN_THIRD = new CSS2DObject(third_btn);
CSS_BTN_THIRD.position.set(89.3, 2.17, -1);

const third_abstract = fst_abstract.cloneNode();
third_abstract.textContent =
  "Third mini project \n \n How to simplify \n the workload for \n temporal nusing staffs";
const CSS_THIRD_ABSTRACT = new CSS2DObject(third_abstract);
CSS_THIRD_ABSTRACT.position.set(89.28, 1.2, -0.99);
const third_explain = explain.cloneNode(true);
const CSS_EXPLAIN_THIRD = new CSS2DObject(third_explain);
CSS_EXPLAIN_THIRD.position.set(87, 2, -1);

const third_image_text = fst_abstract.cloneNode();
third_image_text.textContent = "Here is the third mini project images";
const CSS_THIRD_IMAGE = new CSS2DObject(third_image_text);
CSS_THIRD_IMAGE.position.set(105, 1.5, -3.1);

Textmesh.add(CSS_INTRO);
// Add first mini to screen here
Textmesh.add(CSS_FIRST_MINI);
Textmesh.add(CSS_BTN);
Textmesh.add(CSS_EXPLAIN);
Textmesh.add(CSSFIRST);
Textmesh.add(CSSFIRSTIMAGETEXT);
// Add second mini to screen here
Textmesh.add(CSS_SECOND_MINI);
Textmesh.add(CSS_BTN_SECOND);
Textmesh.add(CSS_SECOND_ABSTRACT);
Textmesh.add(CSS_EXPLAIN_SECOND);
Textmesh.add(CSS_SECOND_IMAGE);
// Add third mini to screen here
Textmesh.add(CSS_THIRD_MINI);
Textmesh.add(CSS_THIRD_ABSTRACT);
Textmesh.add(CSS_THIRD_IMAGE);
Textmesh.add(CSS_BTN_THIRD);
Textmesh.add(CSS_EXPLAIN_THIRD);

// instantiate a Textureloader
const ProfileImageTexture = new THREE.TextureLoader().load("images/profil.jpg");
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const image_geometry = new THREE.BoxGeometry(1.23, 1.5, 1);
const Prifle_image_material = new THREE.MeshBasicMaterial({
  map: ProfileImageTexture,
});
const Profile_imageMesh = new THREE.Mesh(image_geometry, Prifle_image_material);
Profile_imageMesh.position.set(-12, 1, -1);

const Keychain_tech = new THREE.TextureLoader().load(
  "images/Keychain_electronics.jpg"
);
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const Keychain_tech_image_geometry = new THREE.BoxGeometry(3, 2.4, 0.1);
const Keychain_tech_image_material = new THREE.MeshBasicMaterial({
  map: Keychain_tech,
});
const Keychain_tech_mesh = new THREE.Mesh(
  Keychain_tech_image_geometry,
  Keychain_tech_image_material
);
Keychain_tech_mesh.position.set(25, 0, -2);
objects.push(Keychain_tech_mesh);
const Keychain = new THREE.TextureLoader().load("images/keychain.jpg");
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const Keychain_image_material = new THREE.MeshBasicMaterial({ map: Keychain });
const Keychain_image_geometry = new THREE.BoxGeometry(2, 2, 0.1);
const Keychain_mesh = new THREE.Mesh(
  Keychain_image_geometry,
  Keychain_image_material
);
Keychain_mesh.position.set(21, 1.5, -2);
objects.push(Keychain_mesh);
const Skabelon = new THREE.TextureLoader().load("images/skabelon.jpg");
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const Skabelon_image_geometry = new THREE.BoxGeometry(2, 2, 0.1);
const Skabelon_image_material = new THREE.MeshBasicMaterial({ map: Skabelon });
const Skabelon_mesh = new THREE.Mesh(
  Skabelon_image_geometry,
  Skabelon_image_material
);
Skabelon_mesh.position.set(21, -1.5, -2);
objects.push(Skabelon_mesh);
const Proces_1 = new THREE.TextureLoader().load("images/process_1.jpg");
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const Proces_1_image_geometry = new THREE.BoxGeometry(2, 2, 0.1);
const Proces_1_image_material = new THREE.MeshBasicMaterial({ map: Proces_1 });
const Proces_1_Mesh = new THREE.Mesh(
  Proces_1_image_geometry,
  Proces_1_image_material
);
Proces_1_Mesh.position.set(16, 1.5, -2);
objects.push(Proces_1_Mesh);
const future_keychain = new THREE.TextureLoader().load(
  "images/future_keychain.jpg"
);
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const future_keychain_image_geometry = new THREE.BoxGeometry(2, 2, 0.1);
const future_keychain_image_material = new THREE.MeshBasicMaterial({
  map: future_keychain,
});
const future_Mesh = new THREE.Mesh(
  future_keychain_image_geometry,
  future_keychain_image_material
);
future_Mesh.position.set(16, -1.5, -2);
objects.push(future_Mesh);

const randomF = new THREE.TextureLoader().load("images/random_forest.png");
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const randomF_geometry = new THREE.BoxGeometry(15, 5, 0.1);
const randomF_material = new THREE.MeshBasicMaterial({
  map: randomF,
});
const randomF_mesh = new THREE.Mesh(randomF_geometry, randomF_material);
randomF_mesh.position.set(50, -1, -3.1);
objects.push(randomF_mesh);

const sketch = new THREE.TextureLoader().load("images/sketch.JPG");
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const sketch_geometry = new THREE.BoxGeometry(6, 5, 5);
const sketch_material = new THREE.MeshBasicMaterial({
  map: sketch,
});
const sketch_mesh = new THREE.Mesh(sketch_geometry, sketch_material);
sketch_mesh.position.set(65, 0, -3.1);
objects.push(sketch_mesh);

const sensors = new THREE.TextureLoader().load("images/sensors.JPG");
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const sensors_geometry = new THREE.BoxGeometry(6, 5, 5);
const sensors_material = new THREE.MeshBasicMaterial({
  map: sensors,
});
const sensors_mesh = new THREE.Mesh(sensors_geometry, sensors_material);
sensors_mesh.position.set(75, 0, -3.1);
objects.push(sensors_mesh);

const box_inside = new THREE.TextureLoader().load("images/box_inside.jpg");
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const Box_I_geometry = new THREE.BoxGeometry(6, 5, 0.1);
const Box_I_material = new THREE.MeshBasicMaterial({
  map: box_inside,
});
const Box_I_mesh = new THREE.Mesh(Box_I_geometry, Box_I_material);
Box_I_mesh.position.set(100, 1, -3.1);
objects.push(Box_I_mesh);

const box_outside = new THREE.TextureLoader().load("images/box_outside.jpg");
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const Box_O_geometry = new THREE.BoxGeometry(6, 5, 0.1);
const Box_O_material = new THREE.MeshBasicMaterial({
  map: box_outside,
});
const Box_O_mesh = new THREE.Mesh(Box_O_geometry, Box_O_material);
Box_O_mesh.position.set(110, 1, -3.1);
objects.push(Box_O_mesh);

const Wallmount = new THREE.TextureLoader().load("images/Wall_mount_setup.JPG");
// Declare container to image here (mostly a mesh) Important -> MeshBasicMaterial for image rendering or else weird-looking
const Wallmount_geometry = new THREE.BoxGeometry(6, 5, 0.1);
const Wallmount_material = new THREE.MeshBasicMaterial({
  map: Wallmount,
});
const Wallmount_mesh = new THREE.Mesh(Wallmount_geometry, Wallmount_material);
Wallmount_mesh.position.set(120, 1, -3.1);
objects.push(Wallmount_mesh);



scene.add(Profile_imageMesh);
scene.add(Proces_1_Mesh);
scene.add(Keychain_tech_mesh);
scene.add(Keychain_mesh);
scene.add(Skabelon_mesh);
scene.add(future_Mesh);
scene.add(randomF_mesh);
scene.add(sketch_mesh);
scene.add(sensors_mesh);
scene.add(Box_I_mesh);
scene.add(Box_O_mesh);
scene.add(Wallmount_mesh);

function Create_Stickman(model, mixer, animations, orbit, camera) {
  let stickman = {
    model: model,
    mixer: mixer,
    Actions: animations,
    orbitcontroller: orbit,
    camera: camera,
  };
  stickman.model.position.y = -1.9;
  stickman.model.position.z = 0;
  stickman_object.push(stickman);
  return stickman;
}
let scale = 1.3;
let open = 2;
let stick_speed = 0.3;
function checkKeydown(e) {
  if (e.key == "ArrowLeft") {
    // left arrow
    Animation_Idle.stop();
    Animation_Run.play();
    stickman.model.position.x -= stick_speed;
    camera.position.x = stickman.model.position.x;
    stickman.model.rotation.y = -Math.PI / 2;
    //ArrowUp
  } else if (e.key == "ArrowUp") {
    if (stickman.model.scale.x < 2.3) {
      scale += 0.1;
      stick_speed += 0.05;
      stickman.model.scale.set(scale, scale, scale);
    }
  } else if (e.key == "ArrowRight") {
    //right arrow
    Animation_Idle.stop();
    Animation_Run.play();
    stickman.model.rotation.y = Math.PI / 2;
    stickman.model.position.x += stick_speed;
    camera.position.x = stickman.model.position.x;
    //ArrowDown
  } else if (e.key == "ArrowDown") {
    if (stickman.model.scale.x > 0.6) {
      scale -= 0.1;
      if (stick_speed >= 0.11) {
        //alert(stick_speed)
        stick_speed -= 0.05;
      }
      stickman.model.scale.set(scale, scale, scale);
    } // SPACEBAR press
  } else if (e.key == " ") {
    if (stickman.model.position.x > 6 && stickman.model.position.x < 10) {
      if (open % 2 === 0) {
        Hide_first_mini();
        open += 1;
      } else {
        Show_first_mini();
        open -= 1;
      }
    }
    if (stickman.model.position.x > 33 && stickman.model.position.x < 36) {
      if (open % 2 === 0) {
        Hide_Second_mini();
        open += 1;
      } else {
        Show_second_mini();
        open -= 1;
      }
    }
    if (stickman.model.position.x > 87 && stickman.model.position.x < 91) {
      if (open % 2 === 0) {
        Hide_third_mini();
        open += 1;
      } else {
        Show_third_mini();
        open -= 1;
      }
    }
    console.log(open);
    // C
  } else if (e.keyCode == "67") {
    console.log("C");
    stickman.model.traverse((child) => {
      if (child.isMesh) {
        console.log(child);
        child.material.emissive.setHex(Math.random() * 0xffffff);
      }
    });
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

  frame_fst.traverse((child) => {
    if (child.isObject3D && child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0.05;
    }
  });
  exit_fst.traverse((child) => {
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

function Show_first_mini() {
  stickman.model.traverse((child) => {
    if (child.isObject3D && child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 1;
    }
  });
  frame_fst.traverse((child) => {
    if (child.isObject3D && child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 1;
    }
  });
  exit_fst.traverse((child) => {
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

function Hide_Second_mini() {
  second_abstract.style.filter = "blur(10px)";
  second_btn.style.filter = "blur(10px)";

  CSS_EXPLAIN_SECOND.element.hidden = true;
  CSS_SECOND_MINI.element.hidden = false;

  frame_2nd.traverse((child) => {
    if (child.isObject3D && child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0.05;
    }
  });
  exit_2nd.traverse((child) => {
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

function Show_second_mini() {
  stickman.model.traverse((child) => {
    if (child.isObject3D && child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 1;
    }
  });
  frame_2nd.traverse((child) => {
    if (child.isObject3D && child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 1;
    }
  });
  exit_2nd.traverse((child) => {
    if (child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0;
    }
  });
  second_abstract.style.filter = "blur(0px)";
  second_btn.style.filter = "blur(0px)";
  CSS_EXPLAIN_SECOND.element.hidden = false;
  CSS_SECOND_MINI.element.hidden = true;
}

function Hide_third_mini() {
  third_abstract.style.filter = "blur(10px)";
  third_btn.style.filter = "blur(10px)";

  CSS_EXPLAIN_THIRD.element.hidden = true;
  CSS_THIRD_MINI.element.hidden = false;

  frame_3rd.traverse((child) => {
    if (child.isObject3D && child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0.05;
    }
  });
  exit_3rd.traverse((child) => {
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

function Show_third_mini() {
  stickman.model.traverse((child) => {
    if (child.isObject3D && child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 1;
    }
  });
  frame_3rd.traverse((child) => {
    if (child.isObject3D && child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 1;
    }
  });
  exit_3rd.traverse((child) => {
    if (child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0;
    }
  });
  third_abstract.style.filter = "blur(0px)";
  third_btn.style.filter = "blur(0px)";
  CSS_EXPLAIN_THIRD.element.hidden = false;
  CSS_THIRD_MINI.element.hidden = true;
}
document.addEventListener("click", (event) => {
  if (!first_mini.contains(event.target)) {
    if (open % 2 !== 0) open -= 1;
    Show_first_mini(event);
  }
  if (btn.contains(event.target)) {
    if (open % 2 === 0) open += 1;
    Hide_first_mini();
  }
  if (stickman.model.position.x > 16) {
    if (!second_mini.contains(event.target)) {
      if (open % 2 !== 0) open -= 1;
      Show_second_mini();
    }
    if (second_btn.contains(event.target)) {
      Hide_Second_mini();
      if (open % 2 === 0) open += 1;
    }
  }
  if (stickman.model.position.x > 80) {
    if (!third_mini.contains(event.target)) {
      if (open % 2 !== 0) open -= 1;
      Show_third_mini();
    }
    if (third_btn.contains(event.target)) {
      Hide_third_mini();
      if (open % 2 === 0) open += 1;
    }
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
  renderer.setSize(width, height);
  //stickman.model.scale.set(1*aspect, 1*aspect, 1*aspect)
});

document.addEventListener("mousedown", imageClickingSpin, false);
let cancelID;
let speed = 0.1;
function imageClickingSpin(event) {
  event.preventDefault();

  const mouse = {
    x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
  };
  //console.log(mouse);
  raycaster_image.setFromCamera(mouse, camera);

  var intersects = raycaster_image.intersectObjects(objects);
  console.log(intersects);
  if (intersects.length > 0) {
    function spinImage() {
      intersects[0].object.rotation.y += speed;
      speed -= 0.0001129;
      cancelID = requestAnimationFrame(spinImage);
      if (intersects[0].object.rotation.y >= (Math.PI / 2) * 16) {
        cancelAnimationFrame(cancelID);
        speed = 0.1;
        intersects[0].object.rotation.y = 0;
      }
      if (intersects[0].object.rotation.y < 0) {
        speed = 0.1;
        intersects[0].object.rotation.y = 0;
      }
    }
    cancelID = requestAnimationFrame(spinImage);
  }
}

document.addEventListener("mousedown", onDocumentMouseDown, false);
function onDocumentMouseDown(event) {
  event.preventDefault();
  let raycaster_exit_3rd = new THREE.Raycaster();
  Mouse_pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  Mouse_pointer.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(Mouse_pointer, camera);
  raycaster_exit_2nd.setFromCamera(Mouse_pointer, camera);
  raycaster_exit_3rd.setFromCamera(Mouse_pointer, camera);

  var intersects = raycaster.intersectObjects(exit_fst.children);
  var intersects_exit_2nd = raycaster_exit_2nd.intersectObjects(
    exit_2nd.children
  );
  var intersects_3rd = raycaster_exit_3rd.intersectObjects(exit_3rd.children);
  if (
    intersects.length > 1 ||
    intersects_exit_2nd.length > 1 ||
    intersects_3rd.length > 1
  ) {
    console.log("hell");
    Show_second_mini();
    Show_first_mini();
    Show_third_mini();
  }
}
function ShowText() {
  if (stickman.model.position.x > 6 && stickman.model.position.x < 10) {
    setTimeout(() => {
      explain.style.visibility = "visible";
    }, 1);
  } else if (stickman.model.position.x > 33 && stickman.model.position.x < 36) {
    second_explain.style.visibility = "visible";
  } else if (stickman.model.position.x > 87 && stickman.model.position.x < 91) {
    third_explain.style.visibility = "visible";
  } else {
    second_explain.style.visibility = "hidden";
    explain.style.visibility = "hidden";
    third_explain.style.visibility = "hidden";
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
