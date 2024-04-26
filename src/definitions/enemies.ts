import type { Seconds } from "../units";

export type EnemySchema = {
  name: string;
  image: string,
  speed: number
} & ({
  ai: "following";
} | {
  ai: "moveAndShoot";
  moveTime: Seconds
} | {
  ai: "moveAndSpawn",
  moveTime: Seconds,
  spawnTime: Seconds,
  spawnAmount: number,
  spawnStagger: Seconds
  enemyToSpawn: string
})

export const Enemies: Record<string, EnemySchema> = {
  toast: {
    name: "Toast",
    image: "toast.png",
    ai: "following",
    speed: 3
  },
  toaster: {
    name: "Toaster",
    image: "toaster.png",
    ai: "moveAndSpawn",
    speed: 3,
    moveTime: 2,
    spawnAmount: 2,
    spawnStagger: 0.2,
    spawnTime: 2,
    enemyToSpawn: "toast"
  }
}