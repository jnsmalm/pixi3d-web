import { Demo } from "../demo"
import { Crate } from "./walrus-cave/crate"
import { Shark } from "./walrus-cave/shark"
import { Sky } from "./walrus-cave/sky"
import { Water } from "./walrus-cave/water"

export class WalrusCave extends Demo {
  constructor(app) {
    super(app)
    this.resources = [
      "assets/walrus-cave/cave.glb",
      "assets/walrus-cave/shark.glb",
      "assets/walrus-cave/sky.glb",
      "assets/walrus-cave/sky.jpg",
      "environments/photo_studio/diffuse.cubemap",
      "environments/photo_studio/specular.cubemap",
      "assets/walrus-cave/surface.glb",
      "assets/walrus-cave/water-normal.png",
      "assets/walrus-cave/water-height.png",
      "assets/walrus-cave/crate.glb"
    ]
    let hammertime = new Hammer(document.getElementById("demo-canvas"), {})
    hammertime.on("pan", (e) => {
      if (this.control) {
        this.control.angles.y += e.velocityX * 2
      }
      if (this.tween) {
        this.tween.kill()
      }
    })
    hammertime.on("panend", (e) => {
      if (this.control) {
        this.tween = gsap.to(this.control.angles, {
          duration: 1, y: -105, ease: "power2.out"
        })
      }
    })
  }

  show(resources) {
    PIXI3D.Camera.main.far = 100

    this.control = new PIXI3D.CameraOrbitControl(this.app.view)
    this.control.angles.x = 15
    this.control.angles.y = -105
    this.control.target = { x: 0, y: 0, z: 1.8 }
    this.control.distance = 20
    this.control.allowControl = false

    this.ticker = new PIXI.Ticker()
    this.ticker.start()

    let pipeline = this.app.renderer.plugins.pipeline

    this.colorRenderTexture = PIXI.RenderTexture.create({
      width: this.app.renderer.width,
      height: this.app.renderer.height
    })
    this.colorRenderTexture.rotate = 8
    this.colorRenderTexture.framebuffer.addDepthTexture()

    this.ticker.add(() => {
      this.colorRenderTexture.resize(this.app.renderer.width, this.app.renderer.height)

      let aspectRatio = this.app.renderer.width / this.app.renderer.height
      if (aspectRatio > 0.8) {
        PIXI3D.Camera.main.fieldOfView = 60
      } else {
        PIXI3D.Camera.main.fieldOfView = 90
      }
    })

    this.colorPass = new PIXI3D.MaterialRenderPass(this.app.renderer, "color")
    this.colorPass.renderTexture = this.colorRenderTexture

    let depthTexture = new PIXI.Texture(this.colorRenderTexture.framebuffer.depthTexture)

    pipeline.renderPasses.unshift(this.colorPass)

    let lightContainer = this.app.stage.addChild(new PIXI3D.Container3D())
    lightContainer.rotationQuaternion.setEulerAngles(0, 270, 0)

    let directionalLight = lightContainer.addChild(Object.assign(new PIXI3D.Light(), {
      intensity: 1,
      type: "directional",
      enabled: false
    }))
    directionalLight.rotationQuaternion.setEulerAngles(25, 0, 0)
    directionalLight.position.set(0, 10, 10)
    PIXI3D.LightingEnvironment.main.lights.push(directionalLight)

    let imageBasedLighting = new PIXI3D.ImageBasedLighting(
      resources["environments/photo_studio/diffuse.cubemap"].cubemap,
      resources["environments/photo_studio/specular.cubemap"].cubemap)
    PIXI3D.LightingEnvironment.main.imageBasedLighting = imageBasedLighting

    this.cave = this.app.stage.addChild(
      PIXI3D.Model.from(resources["assets/walrus-cave/cave.glb"].gltf))
    this.cave.meshes.forEach(mesh => {
      mesh.enableRenderPass("color")
    })

    this.sharks = [
      this.app.stage.addChild(
        new Shark(resources["assets/walrus-cave/shark.glb"].gltf, -13, -40, 0.25, 0.4)),
      this.app.stage.addChild(
        new Shark(resources["assets/walrus-cave/shark.glb"].gltf, -15, -70, 0.25, 0.3)),
      this.app.stage.addChild(
        new Shark(resources["assets/walrus-cave/shark.glb"].gltf, -14, 170, 0.25, 0.45))
    ]

    let crate1 = this.app.stage.addChild(
      new Crate(resources["assets/walrus-cave/crate.glb"].gltf, 0.3, 3))
    crate1.y = 0.8
    crate1.x = 7
    crate1.rotationQuaternion.setEulerAngles(-10, -10, 0)

    let crate2 = this.app.stage.addChild(
      new Crate(resources["assets/walrus-cave/crate.glb"].gltf, -0.3, 4))
    crate2.y = 1
    crate2.x = 9
    crate2.z = 2
    crate2.rotationQuaternion.setEulerAngles(8, 25, 0)

    this.crates = [crate1, crate2]

    this.sky = this.app.stage.addChild(new Sky(resources["assets/walrus-cave/sky.glb"].gltf))

    this.water = this.app.stage.addChild(
      new Water(resources["assets/walrus-cave/surface.glb"].gltf, this.app.renderer, this.colorPass, depthTexture))
    this.water.y = 1.4
  }

  hide() {
    this.colorRenderTexture.destroy()
    this.cave.destroy(true)
    this.sky.destroy(true)
    this.sharks.forEach(shark => {
      shark.destroy(true)
    })
    this.crates.forEach(crate => {
      crate.destroy(true)
    })
    this.water.destroy(true)
    this.ticker.stop()

    PIXI3D.Camera.main.far = 1000
    PIXI3D.Camera.main.fieldOfView = 60

    let pipeline = this.app.renderer.plugins.pipeline
    pipeline.renderPasses.splice(pipeline.renderPasses.indexOf(this.colorPass), 1)
    console.log(pipeline.renderPasses)
    this.colorPass.renderTexture = undefined

    this.app.stage.removeChildren()
  }
}