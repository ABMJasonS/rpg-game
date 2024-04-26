import { Assets, Sprite } from "pixi.js";
import { GameObject } from "../gameobject";
import type { GameScene } from "../scene";
import {
	type Vector,
	addVectors,
	createPolar,
	subVectors,
	vectorAngle,
} from "../vector";
import { Player } from "./player";

export class Enemy extends GameObject {
	constructor(position: Vector, scene: GameScene) {
		super(position, 0, scene);
		Assets.load("./img/toaster.png").then((asset) => {
			const sprite = new Sprite(asset);
			sprite.anchor.set(0.5);
			sprite.scale.set(1);
			this.pixiContainer.addChild(sprite);
		});
	}
	override act(delta: number): void {
		const player = this.scene.findObjects<Player>(Player)[0];

		const direction = vectorAngle(subVectors(player.position, this.position));

		this.position = addVectors(
			this.position,
			createPolar(delta * 500, direction),
		);
	}
}
