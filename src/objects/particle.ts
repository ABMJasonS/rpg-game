import { Container, Sprite, type Texture } from "pixi.js";
import { GameObject } from "../gameobject";
import type { GameScene } from "../scene";
import type { Seconds } from "../units";
import type { Vector } from "../vector";

export type ParticleSchema = {
  position: Vector;
  rotation: number;
  texture: Texture;
  period: Seconds;
  act: (particle: Particle, progress: number, delta: number, sprite: Sprite, seed: number) => void;
};

export class Particle extends GameObject {
  schema: ParticleSchema;
  life = 0;
  sprite: Sprite;
  seed: number;
  constructor(schema: ParticleSchema, scene: GameScene) {
    super(schema.position, schema.rotation, scene);
    this.schema = schema;
    this.sprite = Sprite.from(schema.texture);
    this.pixiContainer.addChild(this.sprite);
    this.seed = Math.random()
  }

  override act(delta: number): void {
    this.schema.act(this, this.life / this.schema.period, delta, this.sprite, this.seed);

    if (this.life > this.schema.period) this.scene.removeObject(this);

    this.life += delta;
  }
}
