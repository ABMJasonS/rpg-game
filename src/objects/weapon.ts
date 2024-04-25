import { Assets, Sprite } from "pixi.js";
import { WeaponSchema } from "../definitions/weapons";
import { GameObject } from "../gameobject";
import { GameScene } from "../scene";
import { Seconds } from "../units";
import { Radians, Vector } from "../vector";

export class Weapon extends GameObject {
  animationProgress: Seconds = 0;
  initialRotation: Radians;
  constructor(
    position: Vector,
    rotation: Radians,
    scene: GameScene,
    definition: WeaponSchema,
  ) {
    super(position, rotation, scene);
    this.initialRotation = rotation;
    Assets.load(`./img/${definition.spriteFile}`).then((asset) => {
      const sprite = new Sprite(asset);
      sprite.anchor.set(0, 1);
      sprite.scale.set(8);
      this.pixiContainer.addChild(sprite);
    });
  }
  override act(delta: number): void {
    this.animationProgress += delta;
    this.rotation = this.animationProgress * 10 + this.initialRotation;
  }
}
