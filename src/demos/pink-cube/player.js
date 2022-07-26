export class Player extends PIXI3D.Container3D {
  constructor(camera, resources, lightingEnvironment) {
    super()

    this._camera = camera
    this._isMoving = false

    this._mesh = this.addChild(PIXI3D.Mesh3D.createCube())
    this._mesh.material.lightingEnvironment = lightingEnvironment
    this._mesh.material.metallic = 0
    this._mesh.material.roughness = 0.5
    this._mesh.material.baseColor = new PIXI3D.Color(0.8, 0.2, 0.6)
    this._mesh.material.exposure = 3
    this._mesh.scale.set(0.5)

    this._model = this.addChild(PIXI3D.Model.from(resources["assets/pink-cube/crash.glb"].gltf))
    this._model.scale.set(0)
    this._model.rotationQuaternion.setEulerAngles(0, 180, 0)
    this._model.meshes.forEach(mesh => {
      mesh.material.lightingEnvironment = lightingEnvironment
      mesh.material.metallic = 0
      mesh.material.roughness = 0.5
      mesh.material.baseColor = new PIXI3D.Color(0.8, 0.2, 0.6)
      mesh.material.exposure = 3
    })
  }

  get isMoving() {
    return this._isMoving
  }

  get worldPosition() {
    return {
      x: this._mesh.worldTransform.position[0],
      y: this._mesh.worldTransform.position[1],
      z: this._mesh.worldTransform.position[2],
    }
  }

  reset() {
    this._model.scale.set(0)
    this._mesh.visible = true
    this._mesh.rotationQuaternion.set(0, 0, 0, 1)
    this._mesh.position.set(0, 0, 0)
  }

  start() {
    this._mesh.y = 2
    gsap.to(this._mesh, {
      delay: 0, duration: 0.5, y: 0, ease: "bounce.out"
    })
  }

  crash() {
    const target = { angle: 0 }
    gsap.to(target, {
      delay: 0, duration: 1.7, angle: 270, ease: "power2.out", onUpdate: () => {
        this._mesh.rotationQuaternion.setEulerAngles(0, 0, target.angle)
      }
    })
    gsap.to(this, {
      duration: 0.9, y: this.y + 2, ease: "power1.out"
    })
    gsap.to(this, {
      duration: 0.4, y: 0, ease: "power1.in", delay: 1, onComplete: () => {
        gsap.to(this._model.animations[0], {
          duration: 0.4, speed: 0.2, ease: "slow(0.7, 0.7)"
        })
        this._model.animations[0].speed = 1
        this._model.animations[0].play()
        this._model.animations[0].position = 1.65
        this._mesh.visible = false
        this._model.scale.set(0.5)
      }
    })
    gsap.to(this, {
      delay: 0.1, duration: 1.7, x: this.x - 2.6, ease: "power1.out"
    })
  }

  move(dir) {
    this._roll(dir, 90 * PIXI.DEG_TO_RAD, 0.30, false, true, true)
  }

  moveBlocked(dir) {
    this._roll(dir, 10 * PIXI.DEG_TO_RAD, 0.12, true, false, false)
  }

  moveJump(dir, y, duration = 0.3) {
    this._roll(dir, 90 * PIXI.DEG_TO_RAD, duration, false, true, true)
    gsap.to(this, { y, duration, ease: "back.out" })
  }

  moveFall(dir, y) {
    this._roll(dir, 90 * PIXI.DEG_TO_RAD, 0.30, false, true, true)
    gsap.to(this, { y, duration: 0.3, ease: "back.in" })
  }

  goal(dir, y, complete) {
    this._roll(dir, 90 * PIXI.DEG_TO_RAD, 0.30, false, true, true)
    gsap.to(this, {
      y, duration: 0.3, ease: "back.in", onComplete: () => {
        if (complete) {
          complete()
        }
      }
    })
  }

  _roll(dir, angle, duration, yoyo, cameraTrack, completeMovement) {
    if (this._isMoving) {
      return
    }
    this._isMoving = true

    const target = { value: 0 }
    const transformMatrix = PIXI3D.Mat4.copy(this._mesh.localTransform.array)
    const repeat = yoyo ? 1 : 0

    gsap.to(target, {
      duration, value: angle, yoyo, repeat, onUpdate: () => {
        let matrix = PIXI3D.Mat4.create()
        PIXI3D.Mat4.translate(matrix, [-dir.x, -1, +dir.z], matrix)
        if (dir.x !== 0) {
          PIXI3D.Mat4.rotateZ(matrix, target.value * dir.x, matrix)
        } else {
          PIXI3D.Mat4.rotateX(matrix, target.value * dir.z, matrix)
        }
        PIXI3D.Mat4.translate(matrix, [dir.x, 1, -dir.z], matrix)
        PIXI3D.Mat4.multiply(transformMatrix, matrix, matrix)
        this._mesh.transform.setFromMatrix(new PIXI3D.Matrix4(matrix))
        if (cameraTrack) {
          this._camera.track(this.worldPosition)
        }
      }, onComplete: () => {
        if (completeMovement) {
          this.x -= dir.x
          this.z += dir.z
        }
        this._mesh.scale.set(0.5)
        this._mesh.rotationQuaternion.set(0, 0, 0, 1)
        this._mesh.position.set(0)
        this._mesh.transform.updateLocalTransform()
        this._isMoving = false
      }
    })
  }
}