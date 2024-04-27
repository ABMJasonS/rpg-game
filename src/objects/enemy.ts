import { Assets, Color, Sprite } from "pixi.js";
import { GameObject } from "../gameobject";
import type { GameScene } from "../scene";
import {
	type Vector,
	addVectors,
	createPolar,
	subVectors,
	vectorAngle,
	createVector,
	scale,
	type Radians,
	cloneVector,
} from "../vector";
import { Player } from "./player";
import { Enemies, type EnemySchema } from "../definitions/enemies";
import { Rectangle } from "../collisions";
import { sound } from "@pixi/sound";

export class Enemy extends GameObject {
	definition: EnemySchema;
	health: number;
	immunity = 0;

	fireDelayCount = 0;
	moveTimeCount = 0;
	fireTimeCount = 0;
	spawnDelayCount = 0;

	state: "moving" | "firing" = "moving";

	sprites: {
		normal: Sprite | undefined;
		damaged: Sprite | undefined;
	} = {
		normal: Sprite.from(""),
		damaged: Sprite.from(""),
	};

	constructor(position: Vector, scene: GameScene, definition: EnemySchema) {
		super(position, 0, scene);
		this.definition = definition;
		this.health = this.definition.health;
		this.hitbox = this.definition.hitbox.clone();
		this.fireDelayCount = Number.POSITIVE_INFINITY;
		Assets.load(`./img/${definition.images.normal}`).then((asset) => {
			this.sprites.normal = new Sprite(asset);
			this.sprites.normal.anchor.set(0.5);
			this.sprites.normal.scale.set(8);
			this.sprites.normal.visible = true;
			this.pixiContainer.addChild(this.sprites.normal);
		});
		if (definition.images.damaged) {
			Assets.load(`./img/${definition.images.damaged}`).then((asset) => {
				this.sprites.damaged = new Sprite(asset);
				this.sprites.damaged.anchor.set(0.5);
				this.sprites.damaged.scale.set(8);
				this.sprites.damaged.visible = false;
				this.pixiContainer.addChild(this.sprites.damaged);
			});
		}
		this.updateHitbox();
		this.resolveSpawnLocation(10000, 100, 120);
	}

	override act(delta: number): void {
		if (this.health <= 0) {
			sound.play(this.definition.sfx.death);
			this.scene.removeObject(this);
		}
		if (this.spawnDelayCount < 1) {
			this.pixiContainer.alpha = this.spawnDelayCount;
			this.spawnDelayCount += delta;
			return;
		}
		if (
			this.definition.images.damaged &&
			this.health / this.definition.health <= 0.5
		) {
			this.sprites.normal.visible = false;
			this.sprites.damaged.visible = true;
		}
		if (this.immunity > 0) {
			this.immunity -= delta * this.definition.immunityMultipler;
			this.pixiContainer.tint = new Color({
				r: 255,
				g: (1 - this.immunity) * 255,
				b: (1 - this.immunity) * 255,
			});
			return;
		}
		this.immunity = 0;

		switch (this.definition.ai) {
			case "following":
				this.followPlayer(delta);
				break;
			case "moveAndSpawn":
				this.moveAndSpawn(delta);
				break;
		}
	}

	followPlayer(delta: number) {
		const player: Player = this.scene.findObjects<Player>(Player)[0];

		// @ts-expect-error It should not be undefined
		if (this.collider?.collide(player.collider))
			player.hit(this.definition.damage);

		const direction = vectorAngle(subVectors(player.position, this.position));

		this.move(createPolar(delta * this.definition.speed, direction));

		switch (this.definition.images.rotationMode) {
			case "flip":
				this.pixiContainer.scale.x = Math.abs(direction) > Math.PI / 2 ? -1 : 1;
				break;
			case "rotate":
				this.rotation = direction;
				break;
		}
	}

	hit(damage: number, knockback: Vector) {
		if (this.immunity === 0) {
			sound.play(this.definition.sfx.hit, {
				speed: Math.random() * 0.4 + 0.8,
			});
			this.health -= damage;
			this.immunity = 1;
			this.move(knockback);
		}
	}

	move(movement: Vector) {
		const xDirection = movement.x < 0 ? -1 : 1;
		const others = this.scene
			.findObjects<Enemy>(Enemy)
			.filter((obj) => obj !== this);
		for (let x = 0; x < movement.x * xDirection; x++) {
			this.position.x += xDirection;
			this.updateHitbox();
			let isCollidingX = false;
			for (const other of others) {
				if (!other.collider) continue;
				if (this.collider?.collide(other.collider)) isCollidingX = true;
			}
			if (isCollidingX) {
				this.position.x -= xDirection;
				this.updateHitbox();
			}
		}
		const yDirection = movement.y < 0 ? -1 : 1;
		for (let y = 0; y < movement.y * yDirection; y++) {
			this.position.y += yDirection;
			this.updateHitbox();
			let isCollidingY = false;
			for (const other of others) {
				if (!other.collider) continue;
				if (this.collider?.collide(other.collider)) isCollidingY = true;
			}
			if (isCollidingY) {
				this.position.y -= yDirection;
				this.updateHitbox();
			}
		}
	}

	moveAndSpawn(delta: number) {
		if (this.definition.ai !== "moveAndSpawn") return;
		if (this.state === "moving") {
			if (this.moveTimeCount >= this.definition.moveTime) {
				this.moveTimeCount = 0;
				this.state = "firing";
				return;
			}
			this.followPlayer(delta);
			this.moveTimeCount += delta;
		}
		if (this.state === "firing") {
			if (this.fireTimeCount >= this.definition.spawnTime) {
				this.fireTimeCount = 0;
				this.state = "moving";
				return;
			}
			if (
				this.fireDelayCount >=
				this.definition.spawnTime / this.definition.spawnAmount
			) {
				this.fireDelayCount = 0;
				this.scene.addObject(
					new Enemy(
						this.position,
						this.scene,
						Enemies[this.definition.enemyToSpawn],
					),
				);
			}
			this.fireDelayCount += delta;
			this.fireTimeCount += delta;
		}
	}

	resolveSpawnLocation(
		maxDistance: number,
		distanceIncrements: number,
		angleTries: Radians,
	) {
		if (!this.collider) return;

		const initialPosition = cloneVector(this.position);

		const others = this.scene
			.findObjects<Enemy>(Enemy)
			.filter((obj) => obj !== this);

		for (
			let distance = 0;
			distance < maxDistance;
			distance += maxDistance / distanceIncrements
		) {
			for (let tryNumber = 0; tryNumber < angleTries; tryNumber++) {
				this.position = addVectors(
					initialPosition,
					createPolar(distance, Math.random() * Math.PI * 2),
				);
				this.updateHitbox();
				let colliding = false;
				for (const other of others) {
					if (!other.collider) continue;
					if (this.collider.collide(other.collider)) {
						colliding = true;
					}
				}
				if (!colliding) return;
			}
		}
		console.warn("Position not found!");
		this.position = initialPosition;
	}
}
