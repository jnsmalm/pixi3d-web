export class Overlay {
  constructor(id) {
    this.element = document.getElementById(id)
    this.element.classList.add("overlay")
  }

  show(complete) {
    this.element.classList.add("overlay-show")
    if (complete) {
      setTimeout(() => {
        complete()
      }, 0.5)
    }
  }

  hide(complete) {
    this.element.classList.remove("overlay-show")
    if (complete) {
      setTimeout(() => {
        complete()
      }, 0.5)
    }
  }
}