import { Assets, Sprite } from "pixi.js";
import { WeaponSchema } from "../definitions/weapons";
import { GameObject } from "../gameobject";
import { GameScene } from "../scene";
import { Seconds } from "../units";
import { Radians, Vector } from "../vector";
import { Player } from "./player";
import { filters, sound } from "@pixi/sound";

export class Weapon extends GameObject {
  animationProgress: Seconds = 0;
  initialRotation: Radians;
  definition: WeaponSchema;
  player: Player;
  constructor(
    position: Vector,
    rotation: Radians,
    scene: GameScene,
    player: Player,
    definition: WeaponSchema,
  ) {
    super(position, rotation, scene);
    this.definition = definition;
    this.player = player;
    this.initialRotation = rotation;
    Assets.load(`./img/${definition.spriteFile}`).then((asset) => {
      const sprite = new Sprite(asset);
      sprite.anchor.set(0, 1);
      sprite.scale.set(8);
      sprite.scale.y *= Math.abs(this.initialRotation) > Math.PI / 2 ? -1 : 1;
      this.pixiContainer.addChild(sprite);
    });
    if (this.definition.useSound) {
      sound.play(this.definition.useSound, {});
    }
  }
  override act(delta: number): void {
    this.animationProgress += delta;
    this.position = this.player.position;
    switch (this.definition.animation) {
      case "swing":
        this.rotation =
          this.animationProgress *
            (Math.abs(this.initialRotation) > Math.PI / 2 ? -1 : 1) *
            (this.definition.swingAngle ?? 10) +
          this.initialRotation;
    }
    if (this.animationProgress > this.definition.animationTime)
      this.scene.removeObject(this);
  }
}
