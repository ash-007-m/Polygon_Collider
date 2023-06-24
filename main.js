import * as THREE from 'three';
import { Vector3, GJK, Simplex, far_point, support_point, check_case, line_case, tri_case, tetra_case } from './functions.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const polygon1 = new THREE.Mesh(cubeGeometry, cubeMaterial);

const cubeboidGeometry = new THREE.BoxGeometry(1, 1, 2);
const cubeboidMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const polygon2 = new THREE.Mesh(cubeboidGeometry, cubeboidMaterial);

polygon1.position.x = 10;
polygon2.position.x = -10;

scene.add(polygon1);
scene.add(polygon2);
camera.position.z = 5;

window.addEventListener('resize', onWindowResize);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

scene.background = new THREE.Color(0xdddddd);

onWindowResize();

function animate() {
  requestAnimationFrame(animate);

  polygon1.rotation.x += 0.005;
  polygon2.rotation.x += 0.005;
  polygon1.rotation.y += 0.005;
  polygon2.rotation.y += 0.005;
  polygon1.rotation.z += 0.005;
  polygon2.rotation.z += 0.005;

  polygon1.position.x -= 0.01;
  polygon2.position.x += 0.01;
  const vertices1 = polygon1.geometry.attributes.position.array;
  const vertices2 = polygon2.geometry.attributes.position.array;
  const updatedVertices1 = [];
  const updatedVertices2 = [];
  for (let i = 0; i < vertices1.length; i += 3) {
    const x1 = vertices1[i] + polygon1.position.x;
    const y1 = vertices1[i + 1] + polygon1.position.y;
    const z1 = vertices1[i + 2] + polygon1.position.z;
    updatedVertices1.push(new Vector3(x1, y1, z1));
  }

  for (let i = 0; i < vertices2.length; i += 3) {
    const x2 = vertices2[i] + polygon2.position.x;
    const y2 = vertices2[i + 1] + polygon2.position.y;
    const z2 = vertices2[i + 2] + polygon2.position.z;
    updatedVertices2.push(new Vector3(x2, y2, z2));
  }
  const collisionDetected = GJK(updatedVertices1, updatedVertices2);
  console.log(collisionDetected);
  if (collisionDetected == true) {
    polygon1.position.x = 10;
    polygon2.position.x = -10;
  }
  renderer.render(scene, camera);
}

animate();



