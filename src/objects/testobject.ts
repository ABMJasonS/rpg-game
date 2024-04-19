import { Assets, Graphics, Sprite } from "pixi.js";
import { GameObject } from "../gameobject";
import { GameScene } from "../scene";
import { Vector, createVector } from "../vector";

export class TestObject extends GameObject {
  constructor(scene: GameScene, position: Vector) {
    super(position, 0, scene);
    Assets.load("./img/test-image.jpg").then(image => {
      const sprite = Sprite.from(image)
      sprite.anchor.set(0.5)
      sprite.width *= 1.5
      this.pixiContainer.addChild(sprite)
      this.pixiContainer.zIndex = -999
    })
  }

  override act(delta: number): void {
    this.rotation += delta * 0.2
  }
}