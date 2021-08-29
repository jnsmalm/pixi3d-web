import { TileMaterial } from "./materials/tile-material"

export class Floor extends PIXI3D.Container3D {
  constructor(x = 0, y = 0, z = 0) {
    super()

    this.position.set(x, y, z)

    let tone = ((x % 2 === 0) ? (z % 2 === 1) : (z % 2 === 0)) ? 1.0 : 0.95

    this._mesh = this.addChild(PIXI3D.Mesh3D.createCube(new TileMaterial()))
    this._mesh.scale.set(0.5, 20, 0.5)
    this._mesh.material.color = new PIXI3D.Color(0.1 * tone, 0.9 * tone, 0.3 * tone)
    this._mesh.position.set(0, - this._mesh.scale.y - 0.5, 0)
  }
}