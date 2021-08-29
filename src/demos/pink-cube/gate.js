import { TileMaterial } from "./materials/tile-material"

export class Gate extends PIXI3D.Container3D {
  constructor(x = 0, y = 0, z = 0, angle = 0) {
    super()

    this.position.set(x, y, z)

    this._mesh = this.addChild(PIXI3D.Mesh3D.createCube(new TileMaterial()))
    this._mesh.scale.set(0.5, 1, 0.1)
    this._mesh.material.color = PIXI3D.Color.fromBytes(200, 255, 200)
    if (angle === 90) {
      this._mesh.rotationQuaternion.setEulerAngles(0, 90, 0)
    }
  }

  open() {
    gsap.to(this._mesh, { y: -1.49, duration: 1, ease: "power2.out", delay: 0.2 })
  }

  close() {
    gsap.to(this._mesh, { y: 0, duration: 1, ease: "power2.out", delay: 0.2 })
  }
}