export class Goal extends PIXI3D.Container3D {
  constructor(x = 0, y = 0, z = 0, resources, lightingEnvironment) {
    super()

    this.position.set(x, y, z)

    this._model = this.addChild(PIXI3D.Model.from(resources["assets/pink-cube/goal.gltf"].gltf))
    this._model.scale.set(0.63)
    this._model.position.set(0, -0.5, 0)
    
    this._model.meshes.forEach(mesh => {
      mesh.material.lightingEnvironment = lightingEnvironment
      mesh.material.baseColor = new PIXI3D.Color(0.0, 1.0, 0.0)
      mesh.material.metallic = 0
      mesh.material.roughness = 0.5
    })
  }
}