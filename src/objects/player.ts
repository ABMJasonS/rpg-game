import { Graphics } from "pixi.js";
import { GameObject } from "../gameobject";
import { GameScene } from "../scene";
import { Vector, addVectors, createVector } from "../vector";

export class Player extends GameObject {
  speed = 1000;
  velocity: Vector = createVector(0, 0);
  constructor(scene: GameScene) {
    super({ x: 0, y: 0 }, 0, scene);
    const graphics = new Graphics();
    graphics.rect(-100, -100, 200, 200).fill(0xff0000);
    this.pixiContainer.addChild(graphics);
  }

  override act(delta: number): void {
    if (this.scene.isKeyDown("a") || this.scene.isKeyDown("ArrowLeft")) this.velocity.x = -this.speed;
    if (this.scene.isKeyDown("d") || this.scene.isKeyDown("ArrowRight")) this.velocity.x = this.speed;
    if (this.scene.isKeyDown("w") || this.scene.isKeyDown("ArrowUp")) this.velocity.y = -this.speed;
    if (this.scene.isKeyDown("s") || this.scene.isKeyDown("ArrowDown")) this.velocity.y = this.speed;
    this.velocity.x *= 0.9;
    this.velocity.y *= 0.9;
    this.position = addVectors(this.position, {x: this.velocity.x * delta, y: this.velocity.y * delta});

    this.scene.camera.position = this.position;
  }
}
