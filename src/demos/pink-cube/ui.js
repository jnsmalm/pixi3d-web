export class UI {
  constructor() {
    this._ui = document.createElement("div")
    this._ui.className = "ui"
    document.body.appendChild(this._ui)

    let up = document.createElement("div")
    up.onclick = () => {
      this.onUp()
    }
    up.className = "button"
    this._ui.appendChild(up)

    let hr = document.createElement("hr")
    this._ui.appendChild(hr)

    let left = document.createElement("div")
    left.onclick = () => {
      this.onLeft()
    }
    left.className = "button"
    this._ui.appendChild(left)

    let down = document.createElement("div")
    down.onclick = () => {
      this.onDown()
    }
    down.className = "button"
    this._ui.appendChild(down)

    let right = document.createElement("div")
    right.onclick = () => {
      this.onRight()
    }
    right.className = "button"
    this._ui.appendChild(right)

    this._reset = document.createElement("div")
    this._reset.onclick = () => {
      this.onReset()
    }
    this._reset.className = "reload"
    document.body.appendChild(this._reset)
  }

  remove() {
    document.body.removeChild(this._ui)
    document.body.removeChild(this._reset)
  }

  hide() {
    this._ui.className = "ui"
    this._reset.className = "reload"
  }

  show() {
    this._ui.className = "ui show-ui"
    this._reset.className = "reload show"
  }
}