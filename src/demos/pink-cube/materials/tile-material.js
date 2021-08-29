export class TileMaterial extends PIXI3D.Material {
  constructor() {
    super()

    this.color = new PIXI3D.Color()
    this.color2 = new PIXI3D.Color(1, 176 / 255, 254 / 255)
    this.alpha = 1
  }

  createShader() {
    return new PIXI3D.MeshShader(PIXI.Program.from(
      require("./shaders/tile.vert"),
      require("./shaders/tile.frag")))
  }

  updateUniforms(mesh, shader) {
    shader.uniforms.u_Model = mesh.worldTransform.array
    shader.uniforms.u_ViewProjection = PIXI3D.Camera.main.viewProjection
    shader.uniforms.u_Color = this.color.rgba
    shader.uniforms.u_Color2 = this.color2.rgba
    shader.uniforms.u_Alpha = this.alpha
  }
}