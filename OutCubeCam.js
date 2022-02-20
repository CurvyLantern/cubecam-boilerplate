'use strict'

import { Object3D } from 'three/src/core/Object3D.js'
import { Vector3 } from 'three/src/math/Vector3.js'
import { Matrix4 } from 'three/src/math/Matrix4'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js'

const fov = 90,
  aspect = 1

class OutCubeCam extends Object3D {
  constructor(sides = 1, near, renderTarget) {
    super()

    this.type = 'CubeCamera'

    if (renderTarget.isWebGLCubeRenderTarget !== true) {
      console.error(
        'THREE.CubeCamera: The constructor now expects an instance of WebGLCubeRenderTarget as third parameter.'
      )
      return
    }

    this.renderTarget = renderTarget
    const safeInc = 0.001
    const far = sides * 0.5 + safeInc * 2
    const side = sides + safeInc

    // 0 = px
    const cameraPX = new PerspectiveCamera(fov, aspect, near, far)
    cameraPX.position.x = side
    cameraPX.lookAt(this.position)
    this.add(cameraPX)
    // 1 = nx
    const cameraNX = new PerspectiveCamera(fov, aspect, near, far)
    cameraNX.position.x = -side
    cameraNX.lookAt(this.position)
    this.add(cameraNX)
    // 2 = ny
    const cameraNY = new PerspectiveCamera(fov, aspect, near, far)
    cameraNY.position.y = -side
    cameraNY.lookAt(this.position)
    this.add(cameraNY)
    // 3 = py
    const cameraPY = new PerspectiveCamera(fov, aspect, near, far)
    cameraPY.position.y = side
    cameraPY.lookAt(this.position)
    this.add(cameraPY)
    // 4 = pz
    const cameraPZ = new PerspectiveCamera(fov, aspect, near, far)

    cameraPZ.position.z = side
    cameraPZ.lookAt(this.position)
    this.add(cameraPZ)
    // 5 = nz
    const cameraNZ = new PerspectiveCamera(fov, aspect, near, far)
    cameraNZ.position.z = -side
    cameraNZ.lookAt(this.position)
    this.add(cameraNZ)

    /* IDK YET .. BUT THIS JUST WORKS */
    /* This fixes the mirrored angle problem */
    // this.applyMatrix4(new Matrix4().makeScale(1, 1, 1))
  }

  update(renderer, scene) {
    if (this.parent === null) this.updateMatrixWorld()

    const renderTarget = this.renderTarget

    const [cameraPX, cameraNX, cameraPY, cameraNY, cameraPZ, cameraNZ] =
      this.children

    const currentXrEnabled = renderer.xr.enabled
    const currentRenderTarget = renderer.getRenderTarget()

    renderer.xr.enabled = false

    const generateMipmaps = renderTarget.texture.generateMipmaps

    renderTarget.texture.generateMipmaps = false

    renderer.setRenderTarget(renderTarget, 0)
    renderer.render(scene, cameraPX)

    renderer.setRenderTarget(renderTarget, 1)
    renderer.render(scene, cameraNX)

    renderer.setRenderTarget(renderTarget, 2)
    renderer.render(scene, cameraPY)

    renderer.setRenderTarget(renderTarget, 3)
    renderer.render(scene, cameraNY)

    renderer.setRenderTarget(renderTarget, 4)
    renderer.render(scene, cameraPZ)

    renderTarget.texture.generateMipmaps = generateMipmaps

    renderer.setRenderTarget(renderTarget, 5)
    renderer.render(scene, cameraNZ)

    renderer.setRenderTarget(currentRenderTarget)

    renderer.xr.enabled = currentXrEnabled

    renderTarget.texture.needsPMREMUpdate = true
  }
}

export { OutCubeCam }
