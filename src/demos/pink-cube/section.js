import { Animations } from "./animations"

export class Section {
  constructor(map, sectionData) {
    this._map = map
    this._floor = sectionData.floor.map(p => ({ ...p }))
    this._buttons = sectionData.buttons.map(p => ({ ...p }))
    this._gates = sectionData.gates.map(p => ({ ...p }))
    this._blocks = sectionData.blocks.map(p => ({ ...p }))
    this._goals = sectionData.goals.map(p => ({ ...p }))
    this._scenes = sectionData.scenes.map(p => ({ ...p }))
    this._starts = sectionData.starts.map(p => ({ ...p }))
    this._player = this._starts[0]
  }

  get player() {
    return { x: this._player.x, y: this._player.y, z: this._player.z }
  }

  get floor() {
    return this._floor.map(p => ({ x: p.x, y: p.y, z: p.z }))
  }

  get buttons() {
    return this._buttons.map(p => ({ x: p.x, y: p.y, z: p.z }))
  }

  get gates() {
    return this._gates.map(p => ({ x: p.x, y: p.y, z: p.z, angle: p.angle }))
  }

  get blocks() {
    return this._blocks.map(p => ({ x: p.x, y: p.y, z: p.z }))
  }

  get goals() {
    return this._goals.map(p => ({ x: p.x, y: p.y, z: p.z }))
  }

  movePlayer(dir) {
    const animations = [
      ...this._moveBlock(this._player.x + dir.x, this._player.y, this._player.z + dir.z, dir)
    ]
    let height = this._getHeight(this._player.x + dir.x, this._player.z + dir.z)
    if (height === this._player.y) {
      this._player.x += dir.x
      this._player.z += dir.z
      animations.push({
        animation: Animations.PLAYER_MOVE, direction: dir
      })
      animations.push(
        ...this._releaseButton(this._player.x - dir.x, this._player.z - dir.z)
      )
      animations.push(
        ...this._pressButton(this._player.x, this._player.z)
      )
    }
    if (height === this._player.y + 1) {
      this._player.x += dir.x
      this._player.y = height
      this._player.z += dir.z
      animations.push({
        animation: Animations.PLAYER_MOVE_JUMP, direction: dir, y: height
      })
      animations.push(...this._scene(this._player.x, this._player.z))
    }
    if (height < this._player.y) {
      this._player.x += dir.x
      this._player.y = height
      this._player.z += dir.z
      if (this._goals.some(b => b.x === this._player.x && b.z === this._player.z)) {
        animations.push({
          animation: Animations.PLAYER_GOAL, direction: dir, y: height
        })
      }
      animations.push({
        animation: Animations.PLAYER_MOVE_FALL, direction: dir, y: height
      })
    }
    if (height > this._player.y + 1 || height === undefined) {
      animations.push({
        animation: Animations.PLAYER_MOVE_BLOCKED, direction: dir
      })
    }
    return animations
  }

  _moveBlock(x, y, z, dir) {
    const block = this._blocks.find(b => b.x === x && (y === undefined || b.y === y) && b.z === z)
    if (!block) {
      return []
    }
    const animations = []
    let height = this._getHeight(block.x + dir.x, block.z + dir.z)
    if (height === block.y) {
      block.x += dir.x
      block.z += dir.z
      animations.push({
        animation: Animations.BLOCK_MOVE,
        position: { x, z },
        direction: { x: dir.x, z: dir.z }
      })
    }
    if (height < y) {
      block.x += dir.x
      block.y = height
      block.z += dir.z
      animations.push({
        animation: Animations.BLOCK_MOVE_FALL,
        position: { x, z },
        y: height,
        direction: { x: dir.x, z: dir.z }
      })
    }
    animations.push(...this._pressButton(block.x, block.z))
    animations.push(...this._releaseButton(block.x - dir.x, block.z - dir.z))
    return animations
  }

  _openGate(x, z) {
    const animations = []
    let gate = this._gates.find(g => g.x === x && g.z === z)
    if (!gate) {
      console.error("No gate at " + x + "," + z)
    }
    if (!gate.open) {
      gate.open = true
      animations.push({
        animation: Animations.GATE_OPEN, position: { x, z }
      })
    }
    return animations
  }

  _closeGate(x, z) {
    const animations = []
    let gate = this._gates.find(g => g.x === x && g.z === z)
    if (!gate) {
      console.error("No gate at " + x + "," + z)
    }
    if (gate.open) {
      gate.open = false
      animations.push({
        animation: Animations.GATE_CLOSE, position: { x, z }
      })
    }
    return animations
  }

  _pressButton(x, z) {
    let animations = []
    for (let button of this._buttons.filter(b => b.x === x && b.z === z)) {
      if (!button.pressed) {
        button.pressed = true
        animations.push({ animation: Animations.BUTTON_PRESS, position: { x, z } })
        if (button.link) {
          this._gates.filter(g => g.link === button.link).forEach(gate => {
            animations.push(...this._openGate(gate.x, gate.z))
          })
        }
      }
    }
    return animations
  }

  _releaseButton(x, z) {
    let animations = []
    for (let button of this._buttons.filter(b => b.x === x && b.z === z)) {
      if (button.pressed) {
        button.pressed = false
        animations.push({ animation: Animations.BUTTON_RELEASE, position: { x, z } })
        if (button.link) {
          this._gates.filter(g => g.link === button.link && g.auto).forEach(gate => {
            animations.push(...this._closeGate(gate.x, gate.z))
          })
        }
      }
    }
    return animations
  }

  _scene(x, z) {
    return this._scenes.filter(b => b.x === x && b.z === z).map(s => {
      return {
        animation: Animations.SCENE_CRASH,
        scene: s.scene
      }
    })
  }

  _getHeight(x, z) {
    x = Math.ceil(x)
    z = Math.ceil(z)
    for (let gate of this._gates) {
      if (gate.x === x && gate.z === z) {
        if (!gate.open) {
          return 100
        }
        return gate.y
      }
    }
    for (let goal of this._goals) {
      if (goal.x === x && goal.z === z) {
        return -1
      }
    }
    const block = this._blocks.find(b => b.x === x && b.z === z)
    if (block) {
      return block.y + 1
    }
    return this._map.getHeight(x, z)
  }
}