export class Crate extends PIXI3D.Container3D {
  constructor(gltf, bouancyPosition, exposure) {
    super()

    this.model = this.addChild(PIXI3D.Model.from(gltf))
    this.model.scale.set(1.9)
    this.model.meshes.forEach(mesh => {
      mesh.enableRenderPass("color")
      mesh.material.exposure = exposure
    })
  
    this.tween = gsap.to(this.model, {
      duration: 1, y: bouancyPosition, yoyo: true, repeat: -1, ease: "sine.inOut"
    })
  }

  destroy(options) {
    super.destroy(options)
    this.tween.kill()
  }
}