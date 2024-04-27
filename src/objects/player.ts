import { Assets, Color, Graphics, Sprite } from "pixi.js";
import { GameObject } from "../gameobject";
import type { GameScene } from "../scene";
import { $, html } from "../dom";
import {
	type Vector,
	addVectors,
	createVector,
	scale,
	setLength,
	subVectors,
	vectorAngle,
} from "../vector";
import { Derived, Signal } from "../signals";
import { Weapon } from "./weapon";
import { type WeaponSchema, Weapons } from "../definitions/weapons";
import { Rectangle } from "../collisions";
import { Enemy } from "./enemy";
import { Enemies } from "../definitions/enemies";

export class Player extends GameObject {
	speed = 1000;
	health = new Signal(100);
	fireCount = 0;
	velocity: Vector = createVector(0, 0);
	friction = 5;
	currentWeapon: Signal<WeaponSchema> = new Signal(Weapons.butterknife);
	override hitbox: Rectangle = new Rectangle(createVector(-100, -100), createVector(100, 100));
  immunity = 0;

	constructor(scene: GameScene) {
		super({ x: 0, y: 0 }, 0, scene);
		Assets.load("./img/bread.png").then((asset) => {
			const sprite = Sprite.from(asset);
			sprite.anchor.set(0.5);
			sprite.scale.set(10);
			this.pixiContainer.addChild(sprite);
		});
		new Derived(
			() => {
				$("#hp-bar-inner").style.width = `${this.health.get()}%`;
        $("#hp-value").innerText = this.health.get().toFixed(0)
			},
			undefined,
			[this.health],
		);
		new Derived(
			() => {
				$("#box").innerHTML = `
          <img src="./img/${this.currentWeapon.get().spriteFile}"  />
        `;
			},
			undefined,
			[this.currentWeapon],
		);
	}

	override act(delta: number): void {
    if (this.immunity < 0) {
      this.immunity = 0
    } else {
      this.immunity -= delta
      this.pixiContainer.tint = new Color({r: 255, g: (1 - this.immunity) * 255, b: (1 - this.immunity) * 255})
    }

		this.movement(delta)

		this.scene.camera.position = this.position;

		if (this.scene.isKeyDown("+")) this.scene.camera.zoom += delta * 0.001;
		if (this.scene.isKeyDown("-")) this.scene.camera.zoom -= delta * 0.001;

		if (this.scene.isKeyDown("q")) this.health.change((hp) => hp - delta);
		if (this.scene.isKeyDown("e")) this.scene.addObject(new Enemy(addVectors(this.position, createVector(300, 0)), this.scene, Enemies.toast));

		this.attack(delta)

		this.fireCount += delta;
	}

	movement(delta: number) {
		let movement = createVector(0, 0);
		if (this.scene.isKeyDown("a") || this.scene.isKeyDown("ArrowLeft"))
			movement.x -= 1;
		if (this.scene.isKeyDown("d") || this.scene.isKeyDown("ArrowRight"))
			movement.x += 1;
		if (this.scene.isKeyDown("w") || this.scene.isKeyDown("ArrowUp"))
			movement.y -= 1;
		if (this.scene.isKeyDown("s") || this.scene.isKeyDown("ArrowDown"))
			movement.y += 1;
		movement = setLength(movement, 1);

		this.pixiContainer.scale.x =
			this.scene.mouseInfo.position.x - this.position.x > 0 ? -1 : 1;

		this.position = addVectors(this.position, scale(movement, delta * 1000));
	}

	attack(delta: number) {
		if (
			(this.scene.isKeyDown(" ") || this.scene.mouseInfo.buttons.left) &&
			this.fireCount > this.currentWeapon.get().useTime
		) {
			this.fireCount = 0;
			this.scene.addObject(
				new Weapon(
					this.position,
					vectorAngle(subVectors(this.scene.mouseInfo.position, this.position)),
					this.scene,
					this,
					this.currentWeapon.get(),
				),
			);
		}
	}

  hit(damage: number) {
    if (this.immunity > 0) return;
    this.health.change(old => old - damage)
    this.immunity = 1
  }
}
