export class Shark extends PIXI3D.Container3D {
  constructor(gltf, distanceFromCenter, startRotation, speed, scale = 1) {
    super()

    this.speed = speed

    this.rotation = startRotation

    this.ticker = new PIXI.Ticker()
    this.ticker.add(() => {
      this.rotationQuaternion.setEulerAngles(0, this.rotation -= this.speed, 0)
    })
    this.ticker.start()

    let model = this.addChild(PIXI3D.Model.from(gltf))
    model.z = distanceFromCenter
    model.y = -0.7
    model.scale.set(scale)

    model.meshes.forEach(mesh => {
      mesh.material = new SwimMatrial()
      mesh.enableRenderPass("color")
    })
  }

  destroy(options) {
    super.destroy(options)
    this.ticker.stop()
  }
}

export class SwimMatrial extends PIXI3D.Material {
  constructor(size = 0.2, strength = 1.3, speed = 2.5) {
    super()

    this._time = Math.random() * 100
    PIXI.Ticker.shared.add(() => {
      this._time += PIXI.Ticker.shared.elapsedMS / 1000
    })
    this.size = size
    this.strength = strength
    this.speed = speed
    this.color = new PIXI3D.Color()
  }

  updateUniforms(mesh, shader) {
    shader.uniforms.u_ViewProjection = PIXI3D.Camera.main.viewProjection
    shader.uniforms.u_Model = mesh.worldTransform.array
    shader.uniforms.u_Speed = this.speed
    shader.uniforms.u_Size = this.size
    shader.uniforms.u_Strength = this.strength
    shader.uniforms.u_Time = this._time
    shader.uniforms.u_Color = this.color.rgb
  }

  createShader() {
    return new PIXI3D.MeshShader(PIXI.Program.from(vert, frag))
  }
}

const vert = `
attribute vec3 a_Position;

varying vec3 v_Position;

uniform mat4 u_ViewProjection;
uniform mat4 u_Model;
uniform float u_Time;
uniform float u_Speed;
uniform float u_Strength;
uniform float u_Size;

void main() {
  float offset = sin(a_Position.x * u_Size + u_Time * u_Speed);
  vec3 position = a_Position + vec3(0, 0, offset * u_Strength);
  gl_Position = u_ViewProjection * u_Model * vec4(position, 1.0);
  v_Position = a_Position.xyz;
}
`

const frag = `
varying vec3 v_Position;

uniform vec3 u_Color;

void main() {
  gl_FragColor = vec4(u_Color, 1.0);
}
`