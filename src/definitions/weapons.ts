import { Assets, Graphics } from "pixi.js";
import { Rectangle } from "../collisions";
import { Enemy } from "../objects/enemy";
import { Projectile, type ProjectileProperties } from "../objects/projectile";
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
  spread?: Radians;
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
  jam_gun: {
    spriteFile: "jam_gun",
    name: "Jam Gun",
    useTime: 0.01,
    animationTime: 0.02,
    animation: "fire",
    useSound: "machine_gun",
    length: 320,
    spread: 0.3,
    projectile: {
      hitbox: Rectangle.create({ x: 80, y: 80 }),
      velocity: 2000,
      life: 2,
      texture: "jam_projectile",
      collisions: [
        {
          type: Enemy,
          pierce: 1,
          onHit(projectile, object) {
            if (!(object instanceof Enemy)) return false;
            if (object.immunity > 0) return false;
            object.hit(1, { x: 0, y: 0 });
            for (let index = 0; index < 10; index++) {
              projectile.scene.addObject(
                new Projectile(projectile.scene, projectile.position, Math.random() * Math.PI * 2, {
                  hitbox: Rectangle.create({ x: 80, y: 80 }),
                  velocity: 1000,
                  life: 0.5,
                  texture: "jam_projectile",
                  collisions: [
                    {
                      type: Enemy,
                      pierce: 1,
                      onHit(projectile, object) {
                        if (!(object instanceof Enemy)) return false;
                        if (object.immunity > 0) return false;
                        object.hit(1, { x: 0, y: 0 });
                        object.definition = structuredClone(object.definition);
                        object.definition.speed *= 0.9;
                        return true;
                      },
                    },
                  ],
                }),
              );
            }
            object.definition = structuredClone(object.definition);
            object.definition.speed *= 0.9;
            return true;
          },
        },
      ],
    },
  },
};
