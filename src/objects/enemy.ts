import { Assets, Sprite } from "pixi.js";
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
			this.immunity -= delta
		} else {
			this.immunity = 0
			this.collider.min = subVectors(this.position, this.definition.hitbox)
			this.collider.max = addVectors(this.position, this.definition.hitbox)

			const player = this.scene.findObjects<Player>(Player)[0];

			if (this.collider.collide(player.collider)) console.log("hit!")

			const direction = vectorAngle(subVectors(player.position, this.position));

			this.position = addVectors(
				this.position,
				createPolar(delta * 500, direction),
			);
		}

		this.pixiContainer.alpha = 1 - this.immunity

		if (this.health <= 0) {
			this.scene.removeObject(this)
		}
	}

	hit(damage: number) {
		if (this.immunity === 0) {
			sound.play(this.definition.sfx.hit, {
				speed: Math.random() * 0.4 + 0.8
			})
			this.health -= damage;
			this.immunity = 0.5;
		}
	}
}
