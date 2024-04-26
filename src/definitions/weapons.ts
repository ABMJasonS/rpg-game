import type { ProjectileProperties } from "../objects/projectile";
import type { Seconds } from "../units";
import type { Radians } from "../vector";

export type WeaponSchema = {
  spriteFile: string;
  name: string;
  animation: "swing" | "fire" | "use" | "none";
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
};
