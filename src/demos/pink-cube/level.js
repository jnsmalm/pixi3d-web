import { Animations } from "./animations"
import { Block } from "./block"
import { Button } from "./button"
import { Camera } from "./camera"
import { Floor } from "./floor"
import { Gate } from "./gate"
import { Goal } from "./goal"
import { Player } from "./player"

export class Level extends PIXI3D.Container3D {
  constructor(resources, view, sounds, lightingEnvironment) {
    super()

    this._resources = resources
    this._sounds = sounds
    this._lightingEnvironment = lightingEnvironment
    this._camera = new Camera(view)
    this._stage = this.addChild(new PIXI3D.Container3D())
    this._player = this.addChild(
      new Player(this._camera, this._resources, this._lightingEnvironment))
    this._allowControl = true
  }

  loadSection(map, index) {
    this._section = map.createSection(index)

    this._player.position.set(this._section.player.x, this._section.player.y, this._section.player.z)
    this._player.reset()
    this._player.start()

    this._camera.lookAt({
      x: this._section.player.x, y: 0, z: this._section.player.z
    })
    this._camera.reset()

    this._allowControl = true
    this._stage.removeChildren()

    this._buttons = []
    this._gates = []
    this._blocks = []
    this._goals = []

    this._section.buttons.forEach(p => {
      this._buttons.push(this._stage.addChild(new Button(p.x, p.y, p.z)))
    })
    this._section.gates.forEach(p => {
      this._gates.push(this._stage.addChild(new Gate(p.x, p.y, p.z, p.angle)))
    })
    this._section.floor.forEach(p => {
      this._stage.addChild(new Floor(p.x, p.y, p.z))
    })
    this._section.goals.forEach(p => {
      this._goals.push(this._stage.addChild(
        new Goal(p.x, p.y, p.z, this._resources, this._lightingEnvironment)))
    })
    this._section.blocks.forEach(p => {
      this._blocks.push(this._stage.addChild(
        new Block(p.x, p.y, p.z, this._lightingEnvironment)))
    })
  }

  _pressButton(x, z) {
    let button = this._buttons.find(b => b.x === x && b.z === z)
    if (!button) {
      console.error("No button at " + x + "," + z)
    }
    button.press()
  }

  _releaseButton(x, z) {
    let button = this._buttons.find(b => b.x === x && b.z === z)
    if (!button) {
      console.error("No button at " + x + "," + z)
    }
    button.release()
  }

  _openGate(x, z) {
    let gate = this._gates.find(b => b.x === x && b.z === z)
    if (!gate) {
      console.error("No gate at " + x + "," + z)
    }
    gate.open()
  }

  _closeGate(x, z) {
    let gate = this._gates.find(b => b.x === x && b.z === z)
    if (!gate) {
      console.error("No gate at " + x + "," + z)
    }
    gate.close()
  }

  _moveBlock(x, z, dir) {
    let block = this._blocks.find(b => b.x === x && b.z === z)
    if (!block) {
      console.error("No block at " + x + "," + z)
    }
    block.move(dir)
  }

  _moveFallBlock(x, z, dir, y) {
    let block = this._blocks.find(b => b.x === x && b.z === z)
    if (!block) {
      console.error("No block at " + x + "," + z)
    }
    block.moveFall(dir, y)
  }

  _movePlayer(vector) {
    if (this._player.isMoving || !this._allowControl) {
      return
    }
    this._sounds.volume(0.3, this._sounds.play("tap"))
    let dir = { x: 0, z: 0 }
    if (Math.abs(vector[0]) >= Math.abs(vector[2])) {
      dir.x = vector[0] > 0 ? 1 : -1
    } else {
      dir.z = vector[2] > 0 ? 1 : -1
    }
    let animations = this._section.movePlayer(dir)
    this._playAnimations(animations)
  }

  _crash() {
    this._allowControl = false

    this.onScene()

    const trackPlayer = () => {
      this._camera.track(this._player.worldPosition)
    }
    PIXI.Ticker.shared.add(trackPlayer)

    setTimeout(() => {
      gsap.to(this._camera, {
        duration: 7.5, zoom: 4, ease: "power1.inOut"
      })
    }, 0)

    setTimeout(() => {
      this._player.moveJump({ x: 1, z: 0 }, this._player.y + 1, 0.7)
    }, 600)

    setTimeout(() => {
      gsap.to(this._camera.angles, {
        duration: 5.5, y: 45, ease: "power1.inOut"
      })
    }, 1600)

    setTimeout(() => {
      this._player.moveJump({ x: 1, z: 0 }, this._player.y + 1, 1.1)
    }, 2500)

    setTimeout(() => {
      gsap.to(this._camera.drag, { duration: 1, y: 0.2 })
      this._player.crash()
    }, 5500)

    setTimeout(() => {
      gsap.to(this._camera.drag, { duration: 1, y: 0.2 })
      this._player.crash()
    }, 5500)

    setTimeout(() => {
      this._sounds.play("sad")
    }, 6900)

    setTimeout(() => {
      PIXI.Ticker.shared.remove(trackPlayer); this.onReset()
    }, 15000)
  }

  _playAnimations(animations) {
    for (let anim of animations) {
      switch (anim.animation) {
        case Animations.PLAYER_MOVE: {
          this._player.move({ x: -anim.direction.x, z: anim.direction.z })
          break
        }
        case Animations.PLAYER_MOVE_BLOCKED: {
          this._player.moveBlocked({ x: -anim.direction.x, z: anim.direction.z })
          break
        }
        case Animations.PLAYER_MOVE_JUMP: {
          this._player.moveJump({ x: -anim.direction.x, z: anim.direction.z }, anim.y)
          break
        }
        case Animations.PLAYER_MOVE_FALL: {
          this._player.moveFall({ x: -anim.direction.x, z: anim.direction.z }, anim.y)
          break
        }
        case Animations.PLAYER_GOAL: {
          this._player.goal({
            x: -anim.direction.x, z: anim.direction.z
          }, anim.y, () => {
            if (this.onGoal) {
              this.onGoal()
              this._sounds.volume(0.3, this._sounds.play("win"))
            }
          })
          break
        }
        case Animations.BUTTON_PRESS: {
          this._pressButton(anim.position.x, anim.position.z)
          break
        }
        case Animations.BUTTON_RELEASE: {
          this._releaseButton(anim.position.x, anim.position.z)
          break
        }
        case Animations.GATE_OPEN: {
          this._openGate(anim.position.x, anim.position.z)
          break
        }
        case Animations.GATE_CLOSE: {
          this._closeGate(anim.position.x, anim.position.z)
          break
        }
        case Animations.BLOCK_MOVE: {
          this._moveBlock(anim.position.x, anim.position.z, anim.direction)
          break
        }
        case Animations.BLOCK_MOVE_FALL: {
          this._moveFallBlock(anim.position.x, anim.position.z, anim.direction, anim.y)
          break
        }
        case Animations.SCENE_CRASH: {
          this._crash()
          break
        }
      }
    }
  }

  movePlayerLeft() {
    this._movePlayer(PIXI3D.Camera.main.worldTransform.left)
  }

  movePlayerFoward() {
    this._movePlayer(PIXI3D.Camera.main.worldTransform.forward)
  }

  movePlayerBackward() {
    this._movePlayer(PIXI3D.Camera.main.worldTransform.backward)
  }

  movePlayerRight() {
    this._movePlayer(PIXI3D.Camera.main.worldTransform.right)
  }
}