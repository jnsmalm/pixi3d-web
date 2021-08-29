export class Demo {
  constructor(app) {
    this.loaded = false
    this.app = app
    this.resources = []
  }

  load(complete) {
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
  }

  show(resources) {
  }

  hide() {
  }
}