import { Demo } from "../demo"
import { Level } from "./pink-cube/level"
import { UI } from "./pink-cube/ui"
import { Map } from "./pink-cube/map"

export class PinkCube extends Demo {
  constructor(app) {
    super(app)
    this.resources = [
      "assets/pink-cube/crash.glb",
      "assets/pink-cube/map.png",
      "assets/pink-cube/goal.gltf",
    ]
    this.levelIndex = 0
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  show(resources) {
    this.app.renderer.backgroundColor = 0xFFB0FE

    this.lightingEnvironment =
      new PIXI3D.LightingEnvironment(this.app.renderer, new PIXI3D.ImageBasedLighting(PIXI3D.Cubemap.fromColors(
        PIXI3D.Color.fromBytes(140, 140, 140),
        PIXI3D.Color.fromBytes(140, 140, 140),
        PIXI3D.Color.fromBytes(230, 230, 230),
        PIXI3D.Color.fromBytes(120, 120, 120),
        PIXI3D.Color.fromBytes(160, 160, 160),
        PIXI3D.Color.fromBytes(160, 160, 160),
      ), PIXI3D.Cubemap.fromColors(
        PIXI3D.Color.fromBytes(255, 255, 255)
      )))

    this.sounds = new Howl({
      autoplay: false,
      src: [
        "assets/pink-cube/sounds.ogg",
        "assets/pink-cube/sounds.m4a",
        "assets/pink-cube/sounds.mp3",
        "assets/pink-cube/sounds.ac3"
      ],
      sprite: {
        "sad": [
          0,
          9366.666666666668
        ],
        "tap": [
          11000,
          291.65532879818556
        ],
        "win": [
          13000,
          1025.1700680272115
        ]
      }
    })

    const map = new Map(this.app.renderer, resources["assets/pink-cube/map.png"].texture)

    this.ui = new UI()

    this.ui.onUp = () => this.level.movePlayerFoward()
    this.ui.onDown = () => this.level.movePlayerBackward()
    this.ui.onRight = () => this.level.movePlayerRight()
    this.ui.onLeft = () => this.level.movePlayerLeft()
    this.ui.onReset = () => this.level.loadSection(map, this.levelIndex)

    this.ui.show()

    document.addEventListener("keydown", this.onKeyDown)

    this.level = this.app.stage.addChild(
      new Level(resources, this.app.view, this.sounds, this.lightingEnvironment))
    this.level.loadSection(map, this.levelIndex)
    this.level.onGoal = () => {
      gsap.to(this.flash, {
        duration: 0.3, alpha: 1, ease: "power3.out", onComplete: () => {
          this.levelIndex = (this.levelIndex + 1) % map.levels
          this.level.loadSection(map, this.levelIndex)
          gsap.to(this.flash, {
            duration: 0.3, alpha: 0, ease: "power3.out", delay: 0.05
          })
        }
      })
    }
    this.level.onReset = () => {
      this.ui.show()
      gsap.to(this.flash, {
        duration: 0.3, alpha: 1, ease: "power3.out", onComplete: () => {
          this.cinema.value = 0
          this.level.loadSection(map, this.levelIndex)
          gsap.to(this.flash, {
            duration: 0.3, alpha: 0, ease: "power3.out", delay: 0.05
          })
        }
      })
    }
    this.level.onScene = () => {
      setTimeout(() => {
        this.ui.hide()
      }, 1000)
      gsap.to(this.cinema, { duration: 2, value: 1, ease: "sine.inOut" })
    }

    this.cinema = { value: 0 }

    this.cinema1 = this.app.stage.addChild(new PIXI.Graphics())
    this.cinema1.beginFill(0)
    this.cinema1.drawRect(0, 0, 32, 32)
    this.cinema1.endFill()

    this.cinema2 = this.app.stage.addChild(new PIXI.Graphics())
    this.cinema2.beginFill(0)
    this.cinema2.drawRect(0, 0, 32, 32)
    this.cinema2.endFill()

    this.flash = this.app.stage.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
    this.flash.alpha = 0
    this.app.ticker.add(() => {
      this.flash.width = this.app.renderer.width
      this.flash.height = this.app.renderer.height
      this.cinema2.width = this.app.renderer.width
      this.cinema2.height = this.app.renderer.height * 0.15 * this.cinema.value
      this.cinema2.y = this.app.renderer.height - this.app.renderer.height * 0.15 * this.cinema.value
      this.cinema1.width = this.app.renderer.width
      this.cinema1.height = this.app.renderer.height * 0.15 * this.cinema.value
    })
  }

  onKeyDown(evt) {
    switch (evt.key) {
      case "a":
      case "ArrowLeft": {
        this.level.movePlayerLeft()
        break
      }
      case "w":
      case "ArrowUp": {
        this.level.movePlayerFoward()
        break
      }
      case "s":
      case "ArrowDown": {
        this.level.movePlayerBackward()
        break
      }
      case "d":
      case "ArrowRight": {
        this.level.movePlayerRight()
        break
      }
    }
  }

  hide() {
    document.removeEventListener("keydown", this.onKeyDown)
    this.ui.remove()
    this.app.stage.removeChildren()
  }
}