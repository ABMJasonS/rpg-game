import { Hitbox, Rectangle } from "../collisions";
import type { Seconds } from "../units";
import { type Vector, createVector } from "../vector";

export type EnemySchema = {
	name: string;
	image: string;
	speed: number;
	damage: number;
	hitbox: Hitbox;
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
			enemyToSpawn: string;
	  }
);

export const Enemies: Record<string, EnemySchema> = {
	toast: {
    hitbox: Rectangle.create(createVector(200, 200)),
		name: "Toast",
		image: "toast.png",
		ai: "following",
		speed: 1000,
		damage: 10,
		health: 30,
		sfx: {
			hit: "metal_pipe.wav",
			death: "ondeath.wav"
		}
	},
	toaster: {
    hitbox: Rectangle.create(createVector(320, 200)),
		name: "Toaster",
		image: "toaster.png",
		ai: "moveAndSpawn",
		speed: 500,
		moveTime: 2,
		spawnAmount: 2,
		spawnTime: 2,
		enemyToSpawn: "toast",
		damage: 20,
		health: 100,
		sfx: {
			hit: "toasterhit.mp3",
			death: "ondeath.wav"
		}
	},
};
