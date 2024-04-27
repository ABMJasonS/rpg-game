import { filters, sound } from "@pixi/sound";
import { Assets, Sprite } from "pixi.js";
import { Rectangle } from "../collisions";
import type { WeaponSchema } from "../definitions/weapons";
import { GameObject } from "../gameobject";
import type { GameScene } from "../scene";
import type { Seconds } from "../units";
import { type Radians, type Vector, addVectors, createPolar, createVector, setLength, subVectors } from "../vector";
import { Enemy } from "./enemy";
import type { Player } from "./player";
import { Projectile } from "./projectile";

export class Weapon extends GameObject {
  animationProgress: Seconds = 0;
  initialRotation: Radians;
  definition: WeaponSchema;
  player: Player;
  constructor(position: Vector, rotation: Radians, scene: GameScene, player: Player, definition: WeaponSchema) {
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
      sound.play(this.definition.useSound, {
        speed: Math.random() * 0.6 + 0.7,
      });
    }

    const enemies = this.scene.findObjects<Enemy>(Enemy);

    if (this.definition.melee) {
      const a = createVector(this.definition.melee.range, this.definition.melee.range);
      const hitbox = new Rectangle(subVectors(this.position, a), addVectors(this.position, a));

      let piercing = 0;
      for (const enemy of enemies) {
        if (piercing >= this.definition.melee.pierce) break;
        if (enemy.collider?.collide(hitbox) && enemy.immunity === 0) {
          enemy.hit(this.definition.melee.damage, setLength(subVectors(enemy.position, this.position), this.definition.melee.knockback));
          piercing++;
        }
      }
    }
    if (this.definition.projectile) {
      this.scene.addObject(new Projectile(this.scene, addVectors(this.position, createPolar(this.definition.length ?? 0, this.rotation)), this.rotation, this.definition.projectile));
    }
  }
  override act(delta: number): void {
    this.animationProgress += delta;
    this.position = this.player.position;
    switch (this.definition.animation) {
      case "swing":
        this.rotation = this.animationProgress * (Math.abs(this.initialRotation) > Math.PI / 2 ? -1 : 1) * (this.definition.swingAngle ?? 10) + this.initialRotation;
    }

    if (this.animationProgress > this.definition.animationTime) this.scene.removeObject(this);
  }
}
