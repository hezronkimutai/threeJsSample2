import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import Stats from 'three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))


const light1 = new THREE.SpotLight()
light1.position.set(-20, -20, -20)
scene.add(light1)

const light2 = new THREE.SpotLight()
light2.position.set(20, 20, 20)
scene.add(light2)

const light3 = new THREE.SpotLight()
light3.position.set(-20, -20, -20)
scene.add(light3)

const light4 = new THREE.SpotLight()
light4.position.set(-40, 40, 40)
scene.add(light4)

const light5 = new THREE.SpotLight()
light5.position.set(20, -20, 20)
scene.add(light5)

let object1;


const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 20;
camera.position.y = -20;
camera.position.x = 20;
const renderer = new THREE.WebGLRenderer()
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
// controls.autoRotate = true
// controls.autoRotateSpeed = 10;



const envTexture = new THREE.CubeTextureLoader().load([
  '../160920-irish-2.jpg',
  '../160920-irish-2.jpg',
  '../160920-irish-2.jpg',
  '../160920-irish-2.jpg',
  '../160920-irish-2.jpg',
  '../160920-irish-2.jpg',
])
envTexture.mapping = THREE.CubeReflectionMapping

// const material = new THREE.MeshPhysicalMaterial({
//   color: 0xffffff,
//   envMap: envTexture,
//   metalness: 0.25,
//   roughness: 0.1,
//   opacity: 1.0,
//   transparent: true,
//   transmission: 0.99,
//   clearcoat: 1.0,
//   clearcoatRoughness: 0.25
// })

// var geometry = new THREE.BoxGeometry(1, 1, 1);

// var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);





window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}
controls.update();

const stats = Stats()
document.body.appendChild(stats.dom)

var axis = new THREE.Vector3(4, 0, 7).normalize();
var speed = 0.01;
let index = 0;

function animate() {
  requestAnimationFrame(animate)

  const fbxLoader = new FBXLoader()
  fbxLoader.load(
    '../scene.fbx',
    (object) => {
      object.name = `object_${index}`;
      scene.add(object)
      try {
        if (index) {
          var selectedObject = scene.getObjectByName(`object_${index - 1}`);
          console.log({ selectedObject, index, object, scene });
          scene.remove(selectedObject);
        }
        index++;

      } catch (error) {

      }
      object.rotateOnAxis(axis, speed += 0.01);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
      console.log(error)
    }
  )
  render()

  stats.update()
}

function render() {
  renderer.render(scene, camera)
}

animate()