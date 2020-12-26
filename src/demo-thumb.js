export class DemoThumb {
  constructor(id, demo, license, selected) {
    this.demo = demo
    this.element = document.getElementById(id)
    this.element.addEventListener("click", () => {
      selected(demo)
      document.getElementById("ui-license").innerHTML = license
    })
  }

  select() {
    this.element.click()
  }
}