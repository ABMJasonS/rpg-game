import { Assets, Graphics } from "pixi.js";
import { Rectangle } from "../collisions";
import { Enemy } from "../objects/enemy";
import type { ProjectileProperties } from "../objects/projectile";
import type { Seconds } from "../units";
import type { Radians } from "../vector";

export type WeaponSchema = {
  spriteFile: string;
  name: string;
  animation: "swing" | "fire" | "poke" | "use" | "none";
  useTime: Seconds;
  animationTime: Seconds;
  useSound?: string;
  swingAngle?: Radians;
  length?: number;
  melee?: {
    range: number;
    damage: number;
    pierce: number;
    knockback: number;
  };
  projectile?: ProjectileProperties;
};

export const Weapons: Record<string, WeaponSchema> = {
  butterknife: {
    spriteFile: "butterknife",
    name: "Butter Knife",
    useTime: 0.2,
    animationTime: 0.2,
    swingAngle: 14,
    useSound: "whoosh",
    animation: "swing",
    melee: {
      range: 240,
      damage: 10,
      pierce: 1,
      knockback: 50,
    },
  },
  sausage_gun: {
    spriteFile: "sausage_gun",
    name: "Sausage Gun",
    useTime: 0.25,
    animationTime: 0.25,
    animation: "fire",
    useSound: "cameraclick2",
    length: 0,
    projectile: {
      hitbox: Rectangle.create({ x: 10, y: 10 }),
      velocity: 2000,
      life: 2,
      texture: "sausage",
      collisions: [
        {
          type: Enemy,
          pierce: 1,
          onHit(projectile, object) {
            if (!(object instanceof Enemy)) return;
            object.hit(10, { x: 0, y: 0 });
          },
        },
      ],
    },
  },
  test_gun: {
    spriteFile: "m1_garand",
    name: "Test Gun",
    useTime: 0.01,
    animationTime: 0.02,
    animation: "fire",
    useSound: "cameraclick1",
    length: 320,
    projectile: {
      hitbox: Rectangle.create({ x: 10, y: 10 }),
      velocity: 2000,
      life: 2,
      texture: (projectile) => projectile.scene.generateTexture(new Graphics().rect(0, 0, 10, 1).fill({ color: 0xff0000 })),
      collisions: [
        {
          type: Enemy,
          pierce: 1,
          onHit(projectile, object) {
            if (!(object instanceof Enemy)) return;
            object.hit(100, { x: 0, y: 0 });
          },
        },
      ],
    },
  },
};
