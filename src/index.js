const { DancingStormtrooper } = require("./demos/dancing-stormtrooper")
const { ShatteringEngel } = require("./demos/shattering-engel")
const { Overlay } = require("./overlay")
const { DemoThumb } = require("./demo-thumb")
const { PinkCube } = require("./demos/pink-cube")
const { WalrusCave } = require("./demos/walrus-cave")

PIXI.settings.GC_MODE = PIXI.GC_MODES.MANUAL
// PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL2

let app = new PIXI.Application({
  backgroundColor: 0xff0000, antialias: true, view: document.getElementById("demo-canvas"), resizeTo: window, resolution: Math.min(2, window.devicePixelRatio), autoDensity: true
})

let ui = new Overlay("ui-overlay")
let loader = new Overlay("load-overlay")

let demoHide = (demo) => {
  document.body.classList.remove("disable-scrolling")
  ui.hide(() => {
    document.getElementById("demo-canvas").classList.remove("show")
    demo.hide()
  })
}

let demoShow = (demo) => {
  document.body.classList.add("disable-scrolling")
  document.onkeypress = (evt) => {
    if (evt.key === "Escape") {
      demoHide(demo)
    }
  }
  document.getElementById("ui-close").onclick = () => {
    demoHide(demo)
  }
  loader.show(() => {
    demo.load(() => {
      document.getElementById("demo-canvas").classList.add("show")
      ui.show(() => {
        loader.hide()
      })
    })
  })
}

let dancingStormtrooper = new DemoThumb("dancing-stormtrooper",
  new DancingStormtrooper(app), "<a href='https://sketchfab.com/3d-models/dancing-stormtrooper-12bd08d66fe04a84be446e583d6663ac'>Model created by StrykerDoesAnimation.</a> License: <a href='https://creativecommons.org/licenses/by/4.0/'>CC Attribution</a>.", demoShow)

let pinkCube = new DemoThumb("pink-cube",
  new PinkCube(app), "", demoShow)

let walrusCave = new DemoThumb("walrus-cave",
  new WalrusCave(app), "Art from <a href='https://sketchfab.com/3d-models/walrus-cave-691f94c653b242f1a172ba018b4e6318'>rosiejarvis</a>,  <a href='https://sketchfab.com/3d-models/l-p-shark-cage-diving-scene-5bf4fcbbc6ea40b69c734f54180fa38c'>EdwinRC</a>, <a href='https://sketchfab.com/3d-models/sea-keep-lonely-watcher-09a15a0c14cb4accaf060a92bc70413d'>Artjoms Horosilovs</a> and <a href='https://sketchfab.com/3d-models/stylized-crate-537ae14262ad4327b2f9405d27a37b3b'>Berty56</a>. License: <a href='https://creativecommons.org/licenses/by/4.0/'>CC Attribution</a>.", demoShow)

let shatteringEngel = new DemoThumb("shattering-engel",
  new ShatteringEngel(app), "<a href='https://sketchfab.com/3d-models/engel-c958d74ae18c4734b37dbc3ff0841f8a'>Model created by noe-3d.at.</a> License: <a href='https://creativecommons.org/licenses/by/4.0/'>CC Attribution</a>.", demoShow)
