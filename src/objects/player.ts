import { Graphics } from "pixi.js";
import { GameObject } from "../gameobject";
import { GameScene } from "../scene";

export class Player extends GameObject {
  speed = 1000
  constructor(scene: GameScene) {
    super({x: 0, y: 0}, 0, scene)
    const graphics = new Graphics()
    graphics
      .rect(-100, -100, 200, 200)
      .fill(0xFF0000)
    this.pixiContainer.addChild(graphics)
  }

  override act(delta: number): void {
    if (this.scene.isKeyDown("a")) this.position.x -= delta * this.speed;
    if (this.scene.isKeyDown("d")) this.position.x += delta * this.speed;
    if (this.scene.isKeyDown("w")) this.position.y -= delta * this.speed;
    if (this.scene.isKeyDown("s")) this.position.y += delta * this.speed;
    this.pixiContainer.x = this.position.x;
    this.pixiContainer.y = this.position.y;

    this.scene.camera.position = this.position
  }
}