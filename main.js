import * as THREE from "three";

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const axesHelper = new THREE.AxesHelper(5);

scene.add(axesHelper);

// camera.position.z = 5;
// camera.position.y = 2;

camera.position.set(0, 2, 5);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const boxMaterial = new THREE.MeshLambertMaterial({ color: "gray" });

const box = new THREE.Mesh(boxGeometry, boxMaterial);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // (màu, độ sáng)
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 10, 5);

scene.add(pointLight);

scene.add(box);
Loop();

renderer.render(scene, camera);

function Loop() {
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;

  renderer.render(scene, camera);
  requestAnimationFrame(Loop);
}
