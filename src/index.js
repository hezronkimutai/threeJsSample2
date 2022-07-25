import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

import Stats from 'three/examples/jsm/libs/stats.module'

var speed = 0.01;
let index = 0;
var transitionx = 0;
var transitiony = 0;
var transitionz = 0;

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(0))

var axis = new THREE.Vector3(1, 10, 60).normalize();


const light1 = new THREE.SpotLight()
light1.position.set(-200, -200, -200)
scene.add(light1)

const light2 = new THREE.SpotLight()
light2.position.set(200, 200, 200)
scene.add(light2)

const light3 = new THREE.SpotLight()
light3.position.set(-200, 200, 200)
scene.add(light3)

const light4 = new THREE.SpotLight()
light4.position.set(200, -200, 200)
scene.add(light4)

const light5 = new THREE.SpotLight()
light5.position.set(200, 200, -200)
scene.add(light5)


const stats = Stats()
document.body.appendChild(stats.dom)


const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  1500
)
camera.position.z = 150;
camera.position.y = -150;
camera.position.x = 150;


const renderer = new THREE.WebGLRenderer()
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(window.innerWidth - 50, window.innerHeight - 50)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.update();

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

const envTexture = new THREE.CubeTextureLoader().load([
  '',
  '',
  '',
  '',
  '',
  ''
])
envTexture.mapping = THREE.CubeReflectionMapping


const material = new THREE.MeshPhysicalMaterial({
  color: 0xb2ffc8,
  envMap: envTexture,
  metalness: 0.25,
  roughness: 0.1,
  opacity: 1.0,
  transparent: true,
  transmission: 0.99,
  clearcoat: 1.0,
  clearcoatRoughness: 0.25
});

const loader = new STLLoader()
loader.load(
  '../3d.stl',
  function (geometry) {
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },
  (error) => {
    console.log(error)
  }
)
const fbxLoader = new FBXLoader()


let transitionxUp = true;
let transitionyUp = true;
let transitionzUp = true;

function animate() {
  requestAnimationFrame(animate)
  fbxLoader.load(
    '../fbx3d.fbx',
    (object) => {
      object.name = `object_${index}`;
      scene.add(object);
      object.rotateX(2);
      object.rotateY(2);

      try {
        if (index) {
          var selectedObject = scene.getObjectByName(`object_${index - 1}`);
          console.log({ selectedObject, index, object, scene });
          scene.remove(selectedObject);
        }
        index++;

      } catch (error) {

      }

      object.translateZ((transitionz += (transitionzUp ? 0.05 : -0.06)));
      object.translateX((transitionx += (transitionxUp ? 0.1 : -0.1)));
      object.translateY((transitiony += (transitionyUp ? -0.05 : 0.06)));

      if (transitionz >= 70) {
        transitionzUp = false;
      }
      if (transitionz <= -70) {
        transitionzUp = true;

      }


      if (transitionx >= 70) {
        transitionxUp = false;
      }
      if (transitionx <= -70) {
        transitionxUp = true;

      }




      if (transitiony >= 70) {
        transitionyUp = false;
      }
      if (transitiony <= -70) {
        transitionyUp = true;

      }



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
  renderer.render(scene, camera);
  renderer.setClearColor(0xffffff, 0);

}

animate()