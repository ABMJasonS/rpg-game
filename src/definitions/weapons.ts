import { ProjectileProperties } from "../objects/projectile";
import { Seconds } from "../units";
import { Radians } from "../vector";

export type WeaponSchema = {
  spriteFile: string;
  name: string;
  animation: "swing" | "fire" | "use" | "none";
  useTime: Seconds;
  animationTime: Seconds;
  useSound?: string;
  swingAngle?: Radians;
  projectile?: ProjectileProperties;
};

export const Weapons: Record<string, WeaponSchema> = {
  butterknife: {
    spriteFile: "butterknife.png",
    name: "Butter Knife",
    useTime: 0.5,
    animationTime: 0.3,
    useSound: "whoosh.mp3",
    animation: "swing",
  },
};
