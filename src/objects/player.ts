import { Graphics } from "pixi.js";
import { GameObject } from "../gameobject";
import { GameScene } from "../scene";
import { Vector, addVectors, createVector } from "../vector";

export class Player extends GameObject {
  speed = 1000
  velocity: Vector = createVector(0, 0)
  constructor(scene: GameScene) {
    super({x: 0, y: 0}, 0, scene)
    const graphics = new Graphics()
    graphics
      .rect(-100, -100, 200, 200)
      .fill(0xFF0000)
    this.pixiContainer.addChild(graphics)
  }

  override act(delta: number): void {
    if (this.scene.isKeyDown("a")) this.velocity.x = delta * -this.speed;
    if (this.scene.isKeyDown("d")) this.velocity.x = delta * this.speed;
    if (this.scene.isKeyDown("w")) this.velocity.y = delta * -this.speed;
    if (this.scene.isKeyDown("s")) this.velocity.y = delta * this.speed;
    this.velocity.x *= 0.9
    this.velocity.y *= 0.9
    this.position = addVectors(this.position, this.velocity)
    this.pixiContainer.x = this.position.x;
    this.pixiContainer.y = this.position.y;

    this.scene.camera.position = this.position
  }
}