export class Demo {
  constructor(app) {
    this.loaded = false
    this.app = app
    this.resources = []
  }

  load(complete) {
    if (this.loaded) {
      this.show(this.app.loader.resources)
      if (complete) {
        complete()
      }
      return
    }
    this.app.loader.add(this.resources.filter((item) => {
      if (!this.app.loader.resources[item]) {
        return item
      }
    }))
    this.app.loader.load((loader) => {
      this.show(loader.resources)
      if (complete) {
        complete()
      }
    })
    this.loaded = true
  }

  show(resources) { }

  hide() { }
}