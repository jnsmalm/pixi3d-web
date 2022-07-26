export class Sky extends PIXI3D.Container3D {
  constructor(gltf) {
    super()

    this.model = this.addChild(PIXI3D.Model.from(gltf))
    this.model.y = 1.6
    this.model.scale.set(0.03)

    this.ticker = new PIXI.Ticker()
    this.ticker.start()

    let rotation = 0
    this.ticker.add(() => {
      this.model.rotationQuaternion.setEulerAngles(0, rotation += 0.01, 0);
    })

    this.model.meshes.forEach(mesh => {
      mesh.material = new SkyMaterial()
    })
  }

  destroy(options) {
    super.destroy(options)
    this.ticker.stop()
  }
}

class SkyMaterial extends PIXI3D.Material {
  constructor() {
    super()
    this._texture = PIXI.Texture.from("assets/walrus-cave/sky.jpg")
    this.horizonSize = 50.0
    this.horizonColor = PIXI3D.Color.fromBytes(255, 255, 255)
    this.state.culling = true
    this.state.clockwiseFrontFace = false
  }

  updateUniforms(mesh, shader) {
    shader.uniforms.u_ViewProjection = PIXI3D.Camera.main.viewProjection
    shader.uniforms.u_Model = mesh.worldTransform.array
    shader.uniforms.u_Texture = this._texture
    shader.uniforms.u_HorizonColor = this.horizonColor.rgb
    shader.uniforms.u_HorizonSize = this.horizonSize
  }

  createShader() {
    return new PIXI3D.MeshShader(PIXI.Program.from(vert, frag))
  }
}

const vert = `
attribute vec3 a_Position;
attribute vec2 a_UV1;

varying vec3 v_Position;
varying vec2 v_UV1;

uniform mat4 u_ViewProjection;
uniform mat4 u_Model;

void main() {
  gl_Position = u_ViewProjection * u_Model * vec4(a_Position, 1.0);
  v_UV1 = a_UV1;
}
`

const frag = `
varying vec2 v_UV1;

uniform sampler2D u_Texture;
uniform vec3 u_HorizonColor;
uniform float u_HorizonSize;

void main() {
  vec3 sampledColor = texture2D(u_Texture, v_UV1).rgb;
  float horizonMask = smoothstep(0.2, 0.5, 1.0 - v_UV1.y * u_HorizonSize);
  vec3 finalColor = mix(sampledColor * 1.6, u_HorizonColor, horizonMask);
  gl_FragColor = vec4(finalColor, 1.0);
}
`