import { Graphics } from "pixi.js";
import { GameObject } from "../gameobject";
import { GameScene } from "../scene";
import { Vector, addVectors, createVector, scale, setLength } from "../vector";

export class Player extends GameObject {
  speed = 1000;
  velocity: Vector = createVector(0, 0);
  friction = 5;
  constructor(scene: GameScene) {
    super({ x: 0, y: 0 }, 0, scene);
    const graphics = new Graphics();
    graphics.rect(-100, -100, 200, 200).fill(0xff0000);
    this.pixiContainer.addChild(graphics);
  }

  override act(delta: number): void {
    let movement = createVector(0, 0)
    if (this.scene.isKeyDown("a") || this.scene.isKeyDown("ArrowLeft")) movement.x -= 1;
    if (this.scene.isKeyDown("d") || this.scene.isKeyDown("ArrowRight")) movement.x += 1;
    if (this.scene.isKeyDown("w") || this.scene.isKeyDown("ArrowUp")) movement.y -= 1;
    if (this.scene.isKeyDown("s") || this.scene.isKeyDown("ArrowDown")) movement.y += 1;
    movement = setLength(movement, 1);

    this.position = addVectors(this.position, scale(movement, delta * 1000));

    this.scene.camera.position = this.position;

    if (this.scene.isKeyDown("+")) this.scene.camera.zoom += delta
    if (this.scene.isKeyDown("-")) this.scene.camera.zoom -= delta
  }
}
