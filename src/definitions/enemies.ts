import { Hitbox, Rectangle } from "../collisions";
import type { Seconds } from "../units";
import { type Vector, createVector } from "../vector";

export type EnemySchema = {
	name: string;
	speed: number;
	damage: number;
	hitbox: Hitbox;
	health: number;
  immunityMultipler: number;
	sfx: {
		hit: string;
		death: string;
	};
	images: {
    rotationMode: "flip" | "rotate" | "none"
		normal: string;
		damaged?: string;
	};
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
		images: { normal: "toast.png", rotationMode: "none" },
		ai: "following",
		speed: 1000,
		damage: 10,
		health: 10,
    immunityMultipler: 3,
		sfx: {
			hit: "toasthit.mp3",
			death: "ondeath.wav",
		},
	},
	toaster: {
		hitbox: Rectangle.create(createVector(320, 200)),
		name: "Toaster",
		images: { normal: "toaster.png", damaged: "toasterhit.png", rotationMode: "flip" },
		ai: "moveAndSpawn",
		speed: 500,
		moveTime: 10,
		spawnAmount: 2,
		spawnTime: 1,
		enemyToSpawn: "toast",
		damage: 20,
		health: 50,
    immunityMultipler: 10,
		sfx: {
			hit: "toasterhit.mp3",
			death: "ondeath.wav",
		},
	},
};
