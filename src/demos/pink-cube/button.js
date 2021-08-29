import { TileMaterial } from "./materials/tile-material"

export class Button extends PIXI3D.Container3D {
  constructor(x = 0, y = 0, z = 0) {
    super()

    this.position.set(x, y, z)

    const tone = ((x % 2 === 0) ? (z % 2 === 1) : (z % 2 === 0)) ? 1.0 : 0.95

    this._mesh = this.addChild(PIXI3D.Mesh3D.createCube(new TileMaterial()))
    this._mesh.scale.set(0.5, 0.5, 0.5)
    this._mesh.material.color = new PIXI3D.Color(0.2 * tone, 1.0 * tone, 0.4 * tone)
    this._mesh.position.set(0, -0.90, 0)
  }

  press() {
    gsap.to(this._mesh, { y: -1.0, duration: 0.2 })
  }

  release() {
    gsap.to(this._mesh, { y: -0.93, duration: 0.2 })
  }
}