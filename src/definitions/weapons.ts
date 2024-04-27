import { Graphics } from "pixi.js";
import { Rectangle } from "../collisions";
import type { ProjectileProperties } from "../objects/projectile";
import type { Seconds } from "../units";
import type { Radians } from "../vector";
import { Enemy } from "../objects/enemy";

export type WeaponSchema = {
  spriteFile: string;
  name: string;
  animation: "swing" | "fire" | "poke" | "use" | "none";
  useTime: Seconds;
  animationTime: Seconds;
  useSound?: string;
  swingAngle?: Radians;
  melee?: {
    range: number
    damage: number
    pierce: number
    knockback: number
  }
  projectile?: ProjectileProperties;
};

export const Weapons: Record<string, WeaponSchema> = {
  butterknife: {
    spriteFile: "butterknife.png",
    name: "Butter Knife",
    useTime: 0.2,
    animationTime: 0.2,
    swingAngle: 14,
    useSound: "whoosh.mp3",
    animation: "swing",
    melee: {
      range: 240,
      damage: 10,
      pierce: 1,
      knockback: 50
    }
  },
  test_gun: {
    spriteFile: "m1_garand.png",
    name: "Test Gun",
    useTime: 0.1,
    animationTime: 0.1,
    animation: "fire",
    useSound: "cameraclick1.wav",
    projectile: {
      hitbox: Rectangle.create({x: 10, y: 10}),
      velocity: 2000,
      life: 2,
      texture: (projectile) => projectile.scene.generateTexture(new Graphics().rect(0, 0, 100, 10).fill({color: 0xff0000})),
      collisions: [{
        type: Enemy,
        pierce: 1,
        onHit(projectile, object) {
          if (!(object instanceof Enemy)) return;
          object.hit(100, {x: 0, y: 0})
        },
      }]
    }
  }
};
