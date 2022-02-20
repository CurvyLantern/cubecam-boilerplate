import './style.css'

import * as THREE from 'three'
import * as dat from 'dat.gui'

let camera, scene, renderer
let geometry, material, mesh
let geometry2, material2, mesh2
let cubeCam, cubeRenderTarget
const c = document.getElementById('c')

const guiObj = {
  side: 0,
}
const gui = new dat.GUI({ width: 400 })
gui
  .add(guiObj, 'side', {
    front: 0,
    back: 1,
    both: 2,
  })
  .onChange((val) => {
    material.side = +val
  })

init()

function init() {
  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer({
    canvas: c,
    antialias: true,
  })

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10
  )
  camera.position.z = 3

  geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
  material = new THREE.MeshNormalMaterial()

  mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = -1
  // mesh.position.z = 1
  scene.add(mesh)

  /*
   * Rendered 2nd Object
   */
  geometry2 = new THREE.BoxGeometry()
  // material2 = new THREE.MeshBasicMaterial()
  material2 = new THREE.ShaderMaterial({
    vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
      void main(){
        vUv = uv;
        vPosition = position;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
    uniform samplerCube uTexture;
    varying vec2 vUv;
    varying vec3 vPosition;
      void main(){
        gl_FragColor = texture2D(uTexture , vPosition);
      }
    `,
    uniforms: {
      uTexture: {
        value: null,
      },
    },
  })

  mesh2 = new THREE.Mesh(geometry2, material2)
  mesh2.position.x = 1
  scene.add(mesh2)

  /*
   *  Cube Camera
   */
  cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
  })
  cubeCam = new THREE.CubeCamera(0.1, 1, cubeRenderTarget)
  // cubeCam.position.copy(mesh.position)
  cubeCam.position.set(-1, 0, 0)

  cubeCam.children.forEach((cam) => {
    const helper = new THREE.CameraHelper(cam)
    scene.add(helper)
  })
  cubeCam.update(renderer, scene)

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(animation)

  /* RESIZE */
  window.addEventListener('resize', onWindowResize, false)
}

function animation(time) {
  mesh.rotation.x = time / 2000
  mesh.rotation.y = time / 1000

  material2.uniforms.uTexture.value = cubeRenderTarget.texture

  cubeCam.update(renderer, scene)
  renderer.render(scene, camera)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}
