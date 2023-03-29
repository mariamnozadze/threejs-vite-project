import * as THREE from "three";
import "./style.css";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

//scene
const scene = new THREE.Scene();

//create sphere
const geometry = new THREE.SphereGeometry();
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  flatShading: true
});
const mesh = new THREE.Mesh(geometry, material);
// mesh.position.set(5,6,7);
scene.add(mesh);

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//lights
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(13, 15, 10);
scene.add(light);

//camera
const camera = new THREE.PerspectiveCamera(
  55,
  sizes.width / sizes.height,
);
camera.position.z = 10;
scene.add(camera);

//renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGL1Renderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

//controls 
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 4;

//resize
window.addEventListener("resize", () => {
  //update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //update camera
  camera.aspect = sizes.width / sizes.height;
  //updating bg itself. don't have to refresh
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// update camera position based on user input
const positionButton = document.querySelector("#positionButton");
positionButton.addEventListener("click", () => {
  const posX = Number(document.querySelector("#posX").value);
  const posY = Number(document.querySelector("#posY").value);
  const posZ = Number(document.querySelector("#posZ").value);

  camera.position.set(posX, posY, posZ);
  camera.lookAt(scene.position);
});

//adjust scene item's width/size to window's 
const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();
