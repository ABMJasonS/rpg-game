import { ProjectileProperties } from "../objects/projectile";
import { Seconds } from "../units";

export type WeaponSchema = {
  spriteFile: string;
  name: string;
  animation: "swing" | "fire" | "use" | "none";
  useTime: Seconds;
  animationTime: Seconds;
  projectile?: ProjectileProperties;
};

export const Weapons: Record<string, WeaponSchema> = {
  butter_knife: {
    spriteFile: "butter_knife",
    name: "Butter Knife",
    useTime: 0.5,
    animationTime: 0.3,
    animation: "swing",
  },
};
