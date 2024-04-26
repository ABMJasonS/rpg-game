import type { Container } from "pixi.js"
import {GameObject} from "../gameobject"
import type { GameScene } from "../scene"
import { type Radians, type Vector, addVectors, createPolar } from "../vector"

export type ProjectileProperties = {
  velocity: number
  image: Container
  life?: number
  // TODO: work on collision detection
  collisions?: {
    object: GameObject
    onHit: (object: GameObject) => void
  }[]
}

export class Projectile extends GameObject {
  health: number;
  properties: ProjectileProperties
  constructor(scene: GameScene, position: Vector, rotation: Radians, properties: ProjectileProperties) {
    super(position, rotation, scene)
    this.properties = properties
    this.pixiContainer = properties.image
    this.health = properties.life ?? 50
  }

  override act(delta: number): void {
    this.position = addVectors(this.position, createPolar(this.properties.velocity * delta, this.rotation))
    this.health -= delta
    this.special(delta)
    // TODO: Fix lag???
    if (this.health <= 0) {
      this.scene.removeObject(this)
    }
  }

  special(delta: number): void {
    // Can be overwritten
  }
}
