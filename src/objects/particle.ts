import { Container, Sprite, Texture } from "pixi.js";
import { GameObject } from "../gameobject";
import { GameScene } from "../scene";
import { Vector } from "../vector";
import { Seconds } from "../units";

export type ParticleSchema = {
  position: Vector,
  rotation: number,
  texture: Texture,
  period: Seconds,
  act: (particle: Particle, progress: number, sprite: Sprite) => void
}

export class Particle extends GameObject {
  schema: ParticleSchema
  life = 0;
  sprite: Sprite
  constructor(schema: ParticleSchema, scene: GameScene) {
    super(schema.position, schema.rotation, scene)
    this.schema = schema
    this.sprite = Sprite.from(schema.texture)
    this.pixiContainer.addChild(this.sprite)
  }
  
  override act(delta: number): void {
    this.schema.act(this, this.life / this.schema.period, this.sprite)

    if (this.life > this.schema.period) this.scene.removeObject(this)

    this.life += delta;
  }
}