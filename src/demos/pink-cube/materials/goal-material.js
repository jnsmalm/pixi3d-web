export class GoalMaterial extends PIXI3D.Material {
  constructor() {
    super()

    this.renderSortType = "transparent"
    this.blendMode = PIXI.BLEND_MODES.ADD
    this.doubleSided = true
    this.state.depthMask = false
  }

  createShader() {
    return new PIXI3D.MeshShader(PIXI.Program.from(require("./shaders/goal.vert"), require("./shaders/goal.frag")))
  }

  updateUniforms(mesh, shader) {
    shader.uniforms.u_Model = mesh.worldTransform.array
    shader.uniforms.u_ViewProjection = PIXI3D.Camera.main.viewProjection
  }
}