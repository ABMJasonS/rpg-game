import { Assets, Container, Sprite } from "pixi.js";
import type { Hitbox } from "../collisions";
import { GameObject } from "../gameobject";
import type { GameScene } from "../scene";
import { type Radians, type Vector, addVectors, createPolar } from "../vector";
import { Enemy } from "./enemy";

export type ProjectileProperties = {
  velocity: number;
  texture: string;
  hitbox: Hitbox;
  life?: number;
  special?: (projectile: Projectile) => void;
  collisions?: {
		type: unknown;
    pierce: number;
    onHit: (projectile: Projectile, object: GameObject) => boolean;
  }[];
};

export class Projectile extends GameObject {
  health: number;
  properties: ProjectileProperties;
  sprite: Sprite = Sprite.from(this.scene._null_asset);
  pierces = 0;
  constructor(scene: GameScene, position: Vector, rotation: Radians, properties: ProjectileProperties) {
    super(position, rotation, scene);
    this.properties = properties;
		this.sprite = Sprite.from(this.scene.getImageAsset(`weapons/${properties.texture}`))
    this.pixiContainer.addChild(this.sprite);
    this.pixiContainer.scale.set(8);
    this.health = properties.life ?? 50;
    this.hitbox = properties.hitbox;
    this.updateHitbox();
  }

  override act(delta: number): void {
    this.position = addVectors(this.position, createPolar(this.properties.velocity * delta, this.rotation));
    this.health -= delta;
    if (this.properties.special) this.properties.special(this);
    if (this.health <= 0) {
      this.scene.removeObject(this);
    }
    this.checkCollisions(this.properties.collisions);
  }

  checkCollisions(collisions: typeof this.properties.collisions) {
    if (!collisions) return;
    for (const collision of collisions) {
      const hits = this.scene.findObjects<GameObject>(GameObject).filter((obj) => obj.collider && this.collider?.collide(obj.collider));
      for (const hit of hits) {
				if (collision.onHit(this, hit)) this.pierces++
        if (this.pierces >= collision.pierce) {
          this.scene.removeObject(this);
          return;
        }
      }
    }
  }
}
