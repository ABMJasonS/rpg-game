import { Assets, Graphics, Sprite } from "pixi.js";
import { GameObject } from "../gameobject";
import { GameScene } from "../scene";
import { Vector, addVectors, createVector, scale, setLength, subVectors, vectorAngle } from "../vector";
import { Projectile } from "./projectile";

export class Player extends GameObject {
  speed = 1000;
  velocity: Vector = createVector(0, 0);
  friction = 5;
  constructor(scene: GameScene) {
    super({ x: 0, y: 0 }, 0, scene);
    Assets.load("./img/bread.png").then(asset => {
      const sprite = Sprite.from(asset)
      sprite.anchor.set(0.5)
      sprite.scale.set(8)
      this.pixiContainer.addChild(sprite)
    })
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

    if (this.scene.isKeyDown(" ")) this.scene.addObject(new Projectile(this.scene, this.position, vectorAngle(subVectors(this.scene.mouseInfo.position, this.position)), {
      velocity: 200,
      life: 1,
      image: new Graphics().circle(0, 0, 10).fill({color: 0x0000ff})
    }))
  }
}
