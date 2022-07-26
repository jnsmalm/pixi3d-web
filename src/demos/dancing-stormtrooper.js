import { Demo } from "../demo"

export class DancingStormtrooper extends Demo {
  constructor(app) {
    super(app)
    this.resources = [
      "models/dancing_stormtrooper/scene.gltf",
      "environments/photo_studio/diffuse.cubemap",
      "environments/photo_studio/specular.cubemap"
    ]
  }

  show(resources) {
    this.app.renderer.backgroundColor = 0x009933

    this.dirLight = Object.assign(new PIXI3D.Light(), {
      type: "directional", intensity: 1.5, x: 0, y: 0, z: 5
    })
    this.dirLight.rotationQuaternion.setEulerAngles(10, 180, 0)

    let imageBasedLighting = new PIXI3D.ImageBasedLighting(
      resources["environments/photo_studio/diffuse.cubemap"].cubemap,
      resources["environments/photo_studio/specular.cubemap"].cubemap)

    this.lightingEnvironment = new PIXI3D.LightingEnvironment(
      this.app.renderer, imageBasedLighting)
    this.lightingEnvironment.lights.push(this.dirLight)

    this.camera = new PIXI3D.Camera(this.app.renderer)
    this.camera.rotationQuaternion.setEulerAngles(-10, 180, 0)

    this.ticker = new PIXI.Ticker()
    this.ticker.add(() => {
      let aspectRatio = this.app.renderer.width / this.app.renderer.height
      if (aspectRatio > 0.8) {
        this.camera.fieldOfView = 60
      } else {
        this.camera.fieldOfView = 77
      }
    })
    this.ticker.start()

    this.container = this.app.stage.addChild(new PIXI3D.Container3D())

    this.model = this.container.addChild(PIXI3D.Model.from(
      resources["models/dancing_stormtrooper/scene.gltf"].gltf))
    this.model.scale.set(2.3)
    this.model.y = -5.2
    this.model.rotationQuaternion.setEulerAngles(0, 0, 0)

    this.model.meshes.forEach((mesh) => {
      mesh.material.camera = this.camera
      mesh.material.lightingEnvironment = this.lightingEnvironment
      mesh.material.exposure = 1.1
    })

    this.model.animations[0].loop = true
    this.model.animations[0].play()

    this.shadowCastingLight = new PIXI3D.ShadowCastingLight(
      this.app.renderer, this.dirLight, { shadowTextureSize: 1024, quality: PIXI3D.ShadowQuality.medium })
    this.shadowCastingLight.softness = 1
    this.shadowCastingLight.shadowArea = 25

    let pipeline = this.app.renderer.plugins.pipeline
    pipeline.enableShadows(this.model, this.shadowCastingLight)
  }

  hide() {
    let pipeline = this.app.renderer.plugins.pipeline
    this.shadowCastingLight.destroy()
    this.model.meshes.forEach((mesh) => {
      mesh.destroy()
    })
    this.ticker.stop()
    pipeline.shadowPass.removeShadowCastingLight(this.shadowCastingLight)
    this.app.stage.removeChildren()
  }
}