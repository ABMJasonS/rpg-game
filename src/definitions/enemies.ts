import type { Seconds } from "../units";
import { type Vector, createVector } from "../vector";

export type EnemySchema = {
	name: string;
	image: string;
	speed: number;
	damage: number;
	hitbox: Vector;
	health: number;
	sfx: {
		hit: string
		death: string
	}
} & (
	| {
			ai: "following";
	  }
	| {
			ai: "moveAndShoot";
			moveTime: Seconds;
	  }
	| {
			ai: "moveAndSpawn";
			moveTime: Seconds;
			spawnTime: Seconds;
			spawnAmount: number;
			spawnStagger: Seconds;
			enemyToSpawn: string;
	  }
);

export const Enemies: Record<string, EnemySchema> = {
	toast: {
		hitbox: createVector(10, 10),
		name: "Toast",
		image: "toast.png",
		ai: "following",
		speed: 3,
		damage: 1,
		health: 1,
		sfx: {
			hit: "metal_pipe.wav",
			death: "ondeath.wav"
		}
	},
	toaster: {
		hitbox: createVector(80, 80),
		name: "Toaster",
		image: "toaster.png",
		ai: "moveAndSpawn",
		speed: 1000,
		moveTime: 2,
		spawnAmount: 2,
		spawnStagger: 0.2,
		spawnTime: 2,
		enemyToSpawn: "toast",
		damage: 1,
		health: 10,
		sfx: {
			hit: "toasterhit.mp3",
			death: "ondeath.wav"
		}
	},
};
