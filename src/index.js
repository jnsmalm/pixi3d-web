const { DancingStormtrooper } = require("./demos/dancing-stormtrooper")
const { Overlay } = require("./overlay")
const { DemoThumb } = require("./demo-thumb")

PIXI.settings.GC_MODE = PIXI.GC_MODES.MANUAL

let app = new PIXI.Application({
  backgroundColor: 0xff0000, antialias: true, view: document.getElementById("demo-canvas"), resizeTo: window
})

let canvas = new Overlay("demo-overlay")
let loader = new Overlay("load-overlay")

let thumbSelected = (demo) => {
  document.onkeypress = (evt) => {
    if (evt.key === "Escape") {
      canvas.hide(() => {
        demo.hide()
      })
    }
  }
  document.getElementById("demo-close").onclick = () => {
    canvas.hide(() => {
      demo.hide()
    })
  }
  loader.show(() => {
    demo.load(() => {
      canvas.show(() => {
        loader.hide()
      })
    })
  })
}

let dancingStormtrooper = new DemoThumb("dancing-stormtrooper",
  new DancingStormtrooper(app), "License: <a href='https://creativecommons.org/licenses/by/4.0/'>CC Attribution</a>. <a href='https://sketchfab.com/3d-models/dancing-stormtrooper-12bd08d66fe04a84be446e583d6663ac'>Model created by StrykerDoesAnimation.</a>", thumbSelected)
