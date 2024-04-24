import { ProjectileProperties } from "../objects/projectile";

export type WeaponSchema = {
  name: string;
  animation: "swing" | "fire" | "use" | "none";
  projectile?: ProjectileProperties;
};

export const Weapons: Record<string, WeaponSchema> = {
  butter_knife: {
    name: "Butter Knife",
    animation: "swing",
  },
};
