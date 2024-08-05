import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import nubela from "./assets/img/nebula.jpg";
import stars from "./assets/img/stars.jpg";

const gokuUrl = new URL("./assets/img/goku.glb", import.meta.url);
const renderer = new THREE.WebGLRenderer();
// đổ bóng
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-10, 30, 30);

// xoay góc nhìn camera
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

//tạo trục helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// tạo hộp vuông
const boxGeometry = new THREE.BoxGeometry(); //b1 tạo khung
const boxMaterial = new THREE.MeshBasicMaterial({ color: "gray" }); //tạo vật liệu bọc bên ngoài
const box = new THREE.Mesh(boxGeometry, boxMaterial); //bao quát vật liệu vào khung
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30); //
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});

// tạo mặt phằng
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.receiveShadow = true;
plane.rotation.x = -0.5 * Math.PI;
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

// quả cầu
const sphereGeometry = new THREE.SphereGeometry(4);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: "#ffea00",
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

// ============ Ánh sáng ================
// ánh sáng môi trường
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// // ánh sáng hướng
// const direcionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// scene.add(direcionalLight);
// direcionalLight.position.set(-30, 50, 0);
// direcionalLight.castShadow = true;
// direcionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(direcionalLight, 5);
// scene.add(dLightHelper);
// const dLightShadowHelper = new THREE.CameraHelper(
//   direcionalLight.shadow.camera
// );
// scene.add(dLightShadowHelper);

// ánh sáng nón
const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// const fog = new THREE.Fog(0xffffff, 0, 200);
const fog = new THREE.FogExp2(0xffffff, 0.01);
scene.fog = fog;

// renderer.setClearColor("pink");

const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(stars);
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  nubela,
  nubela,
  stars,
  stars,
  stars,
  stars,
]);

const box2Geometry = new THREE.BoxGeometry();
const box2Material = new THREE.MeshStandardMaterial({
  // color: "blue",
  // map: textureLoader.load(nubela),
});
const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nubela) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nubela) }),
];
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
box2.position.set(0, 15, 10);
scene.add(box2);
box2.material.map = textureLoader.load(nubela);
box2.name = "thebox";

const assetLoader = new GLTFLoader();

assetLoader.load(
  gokuUrl.href,
  function (gltf) {
    const goku = gltf.scene;
    scene.add(goku);
    goku.scale.set(2, 2, 2);
    goku.castShadow = true;
    goku.position.set(-12, 4, 10);
    goku.rotation.y = Math.PI / 2;
  },
  undefined,
  function (e) {
    console.error("An error occurred while loading the goku model: ", e);
  }
);

const gui = new dat.GUI();
const options = {
  sphereColor: "#ffea00",
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 10000,
};

gui.addColor(options, "sphereColor").onChange(function (event) {
  sphere.material.color.set(event);
});
gui.add(options, "wireframe").onChange(function (event) {
  sphere.material.wireframe = event;
});
gui.add(options, "speed", 0, 0.1);
gui.add(options, "angle", 0, 1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 0, 200000);

let step = 0;

const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

function animate() {
  requestAnimationFrame(animate);

  // Xoay hộp
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;

  // Render cảnh
  renderer.render(scene, camera);

  //   nảy quả bóng
  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  // bóng spotLight
  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  sLightHelper.update();

  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children);
  console.log(intersects);
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.id === sphere.id) {
      sphere.material.color.set("red");
    }
    if (intersects[i].object.name === "thebox") {
      intersects[i].object.rotation.x += 0.01;
      intersects[i].object.rotation.y += 0.01;
    }
  }
}

animate();
