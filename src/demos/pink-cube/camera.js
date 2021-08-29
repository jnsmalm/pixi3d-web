export class Camera {
  constructor(view) {
    PIXI3D.Camera.main.orthographic = true
    PIXI3D.Camera.main.orthographicSize = 7

    this.drag = { x: 0.5, y: 0.01, z: 0.5 }

    this._control = new PIXI3D.CameraOrbitControl(view)
    this._control.allowControl = false
    this._control.angles.set(25, -20)
    this._control.distance = 100

    this._track = { x: 0, y: 0, z: 0 }

    const lerp = (a, b, t) => {
      return a + (b - a) * t
    }

    PIXI.Ticker.shared.add(() => {
      this._control.target = {
        x: lerp(this._control.target.x, this._track.x, this.drag.x),
        y: lerp(this._control.target.y, this._track.y, this.drag.y),
        z: lerp(this._control.target.z, this._track.z, this.drag.z),
      }
    })
  }

  get zoom() {
    return PIXI3D.Camera.main.orthographicSize
  }

  set zoom(value) {
    PIXI3D.Camera.main.orthographicSize = value
  }

  get angles() {
    return this._control.angles
  }

  reset() {
    PIXI3D.Camera.main.orthographicSize = 7
    this._control.angles.set(25, -20)
    this.drag = { x: 0.5, y: 0.01, z: 0.5 }
  }

  track(position) {
    this._track = position
  }

  lookAt(position) {
    this._track = position
    this._control.target = position
  }
}