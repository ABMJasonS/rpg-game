import { Seconds } from "../units";

export type EnemySchema = {
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
})

export const Enemies: Record<string, EnemySchema> = {
  toast: {
    image: "toast.png",
    ai: "following",
    speed: 3
  },
  toaster: {
    image: "toaster.png",
    ai: "moveAndSpawn",
    speed: 3,
    moveTime: 2,
    spawnAmount: 2,
    spawnStagger: 0.2,
    spawnTime: 2
  }
}