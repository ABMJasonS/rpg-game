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
} from "../vector";
import { Player } from "./player";
import type { EnemySchema } from "../definitions/enemies";
import { Rectangle } from "../collisions";
import { sound } from "@pixi/sound";

export class Enemy extends GameObject {
	definition: EnemySchema;
	collider: Rectangle;
	health: number
	immunity: number = 0;
	constructor(position: Vector, scene: GameScene, definition: EnemySchema) {
		super(position, 0, scene);
		this.definition = definition;
		this.collider = new Rectangle(createVector(0, 0), createVector(0, 0))
		this.health = this.definition.health
		Assets.load("./img/toaster.png").then((asset) => {
			const sprite = new Sprite(asset);
			sprite.anchor.set(0.5);
			sprite.scale.set(1.2);
			this.pixiContainer.addChild(sprite);
		});
	}

	override act(delta: number): void {
		if (this.immunity > 0) {
			this.immunity -= delta * 2
		} else {
			this.immunity = 0
			this.collider.min = subVectors(this.position, this.definition.hitbox)
			this.collider.max = addVectors(this.position, this.definition.hitbox)

			const player = this.scene.findObjects<Player>(Player)[0];

			if (this.collider.collide(player.collider)) console.log("hit!")

			const direction = vectorAngle(subVectors(player.position, this.position));

			this.move(createPolar(delta * this.definition.speed, direction))

			/*
			this.position = addVectors(
				this.position,
				createPolar(delta * 500, direction),
			);
			*/
		}

		// this.pixiContainer.alpha = 1 - this.immunity
		this.pixiContainer.tint = new Color({r: 255, g: (1 - this.immunity) * 255, b: (1 - this.immunity) * 255})

		if (this.health <= 0) {
			sound.play(this.definition.sfx.death)
			this.scene.removeObject(this)
		}
	}

	hit(damage: number, knockback: Vector) {
		if (this.immunity === 0) {
			sound.play(this.definition.sfx.hit, {
				speed: Math.random() * 0.4 + 0.8
			})
			this.health -= damage;
			this.immunity = 1;
			this.position = addVectors(this.position, knockback)
		}
	}

	move(movement: Vector) {
		const xDirection = movement.x < 0 ? -1 : 1
		const others = this.scene.findObjects<Enemy>(Enemy).filter(obj => obj !== this)
		for (let x = 0; x < movement.x * xDirection; x++) {
			this.position.x += xDirection
			this.collider.min.x += xDirection
			this.collider.max.x += xDirection
			let isCollidingX = false
			for (const other of others) {
				if (this.collider.collide(other.collider)) isCollidingX = true
			}
			if (isCollidingX) {
				this.position.x -= xDirection
				this.collider.min.x -= xDirection
				this.collider.max.x -= xDirection
			}
		}
		const yDirection = movement.y < 0 ? -1 : 1
		for (let y = 0; y < movement.y * yDirection; y++) {
			this.position.y += yDirection
			this.collider.min.y += yDirection
			this.collider.max.y += yDirection
			let isCollidingY = false
			for (const other of others) {
				if (this.collider.collide(other.collider)) isCollidingY = true
			}
			if (isCollidingY) {
				this.position.y -= yDirection
				this.collider.min.y -= yDirection
				this.collider.max.y -= yDirection
			}
		}
	}
}
