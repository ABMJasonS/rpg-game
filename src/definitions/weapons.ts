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
  }
  projectile?: ProjectileProperties;
};

export const Weapons: Record<string, WeaponSchema> = {
  butterknife: {
    spriteFile: "butterknife.png",
    name: "Butter Knife",
    useTime: 0.15,
    animationTime: 0.15,
    swingAngle: 16,
    useSound: "whoosh.mp3",
    animation: "swing",
    melee: {
      range: 240,
      damage: 1,
      pierce: 1
    }
  },
};
