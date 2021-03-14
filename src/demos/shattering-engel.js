import { Demo } from "../demo"

export class ShatteringEngel extends Demo {
  constructor(app) {
    super(app)
    this.resources = ["models/engel/engel1.gltf", "models/engel/engel2.gltf"]
  }

  show(resources) {
    document.getElementById("ui-content").innerHTML = "<i class='far fa-hand-pointer fa-6x hand-pointer'></i>"

    this.app.renderer.backgroundColor = 0x87bbc9

    this.ambientLight = Object.assign(new PIXI3D.Light(), {
      type: "ambient", intensity: 1, color: [0.8, 0.8, 1]
    })
    this.spotLight = Object.assign(new PIXI3D.Light(), {
      type: "spot", intensity: 100, x: 0, y: 2, z: 5, color: [1, 1, 1], range: 30
    })
    this.spotLight.rotationQuaternion.setEulerAngles(0, 180, 0)

    this.lightingEnvironment = new PIXI3D.LightingEnvironment(
      this.app.renderer)
    this.lightingEnvironment.lights.push(this.spotLight)
    this.lightingEnvironment.lights.push(this.ambientLight)

    this.camera = new PIXI3D.Camera(this.app.renderer)
    this.camera.rotationQuaternion.setEulerAngles(-10, 180, 0)

    this.container = this.app.stage.addChild(new PIXI3D.Container3D())
    this.container.y = -3.3
    this.container.scale.set(0.85)

    this.model1 = this.container.addChild(PIXI3D.Model.from(
      resources["models/engel/engel1.gltf"].gltf))
    this.model1.visible = true
    this.model1.interactive = true
    this.model1.buttonMode = true
    this.model1.hitArea = new PIXI3D.PickingHitArea(this.app.renderer, this.model1, this.camera)
    this.model1.on("pointerdown", () => {
      this.model2.animations.forEach(animation => {
        animation.play()
        animation.position = 0.63
      })
      this.model1.visible = false
      this.model2.visible = true
      document.getElementById("ui-content").innerHTML = ""
    })
    this.model1.meshes.forEach(mesh => {
      mesh.material.camera = this.camera
      mesh.material.lightingEnvironment = this.lightingEnvironment
      mesh.material.exposure = 1
    })

    this.model2 = this.container.addChild(PIXI3D.Model.from(
      resources["models/engel/engel2.gltf"].gltf))
    this.model2.visible = false
    this.model2.meshes.forEach(mesh => {
      mesh.material.camera = this.camera
      mesh.material.lightingEnvironment = this.lightingEnvironment
      mesh.material.exposure = 1
    })
    this.model2.animations.forEach(animation => {
      animation.speed = 1.5
      animation.on("complete", () => {
        this.model1.visible = true
        this.model2.visible = false
      })
    })
  }

  hide() {
    this.model1.meshes.forEach((mesh) => {
      mesh.destroy()
    })
    this.model2.meshes.forEach((mesh) => {
      mesh.destroy()
    })
    this.app.stage.removeChildren()
    document.getElementById("ui-content").innerHTML = ""
  }
}