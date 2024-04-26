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

export class Enemy extends GameObject {
	definition: EnemySchema;
	collider: Rectangle;
	constructor(position: Vector, scene: GameScene, definition: EnemySchema) {
		super(position, 0, scene);
		this.definition = definition;
		this.collider = new Rectangle(createVector(0, 0), createVector(0, 0))
		Assets.load("./img/toaster.png").then((asset) => {
			const sprite = new Sprite(asset);
			sprite.anchor.set(0.5);
			sprite.scale.set(1);
			this.pixiContainer.addChild(sprite);
		});
	}
	override act(delta: number): void {
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
}
