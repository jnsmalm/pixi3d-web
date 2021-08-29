export class Block extends PIXI3D.Container3D {
  constructor(x = 0, y = 0, z = 0, lightingEnvironment) {
    super()

    this.position.set(x, y, z)

    this._mesh = this.addChild(PIXI3D.Mesh3D.createCube())
    this._mesh.scale.set(0.5, 0.5, 0.5)
    this._mesh.material.lightingEnvironment = lightingEnvironment
    this._mesh.material.metallic = 0
    this._mesh.material.roughness = 0.2
    this._mesh.material.unlit = false
    this._mesh.material.baseColor = new PIXI3D.Color(0.1, 0.1, 0.1)
    this._mesh.position.set(0, 0, 0)
  }

  move(dir) {
    gsap.to(this, { 
      x: this.x + dir.x, z: this.z + dir.z, duration: 0.2, ease: "power1.out" 
    })
  }

  moveFall(dir, y) {
    gsap.to(this, { x: this.x + dir.x, z: this.z + dir.z, duration: 0.2 })
    gsap.to(this, { y, duration: 0.3, delay: 0, ease: "back.in" })
  }
}