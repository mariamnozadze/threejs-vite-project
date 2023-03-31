import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//scene
const scene = new THREE.Scene();

//create sphere
const geometry = new THREE.SphereGeometry();
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  flatShading: true,
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
const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height);
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


//device orientation
let x = 0;
let y = 0;
let z = 0;

if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", (event) => {
    x = event.beta; // range from -180 to 180
    y = event.gamma; // range from -90 to 90
    z = event.alpha; // range from 0 to 360
  });
}

//update device position on screen
const devicePositionElement = document.getElementById("device-position");
const updateDevicePosition = () => {
  devicePositionElement.textContent = `Device position - x: ${x.toFixed(
    2
  )}, y: ${y.toFixed(2)}, z: ${z.toFixed(2)}`;
  requestAnimationFrame(updateDevicePosition);
};
updateDevicePosition();

//calculate device position
const radius = 5; // distance of sphere from camera
const position = new THREE.Vector3(); // create a new vector to hold the position
const calculateDevicePosition = () => {
  // convert angles from degrees to radians
  const xAngle = THREE.MathUtils.degToRad(x);
  const yAngle = THREE.MathUtils.degToRad(y);
  const zAngle = THREE.MathUtils.degToRad(z);

  // calculate position based on angles and radius
  position.set(
    radius * Math.sin(xAngle) * Math.sin(zAngle),
    radius * Math.cos(xAngle),
    -radius * Math.sin(xAngle) * Math.cos(zAngle)
  );

  // add the position to the camera's position to place the sphere relative to the camera
  position.add(camera.position);

  // set the sphere's position to the calculated position
  mesh.position.copy(position);
  requestAnimationFrame(calculateDevicePosition);
};
calculateDevicePosition();


//adjust scene item's width/size to window's
const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

