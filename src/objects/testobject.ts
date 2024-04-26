import { Assets, Graphics, Sprite } from "pixi.js";
import { GameObject } from "../gameobject";
import type { GameScene } from "../scene";
import { type Vector, createVector } from "../vector";

export class TestObject extends GameObject {
  sprite: Sprite
  constructor(scene: GameScene, position: Vector) {
    super(position, 0, scene);
    Assets.load("./img/test-image.jpg").then(image => {
      this.sprite = Sprite.from(image)
      this.sprite.anchor.set(0.5)
      this.sprite.width *= 1.5
      this.pixiContainer.addChild(this.sprite)
      this.pixiContainer.zIndex = -999
    })
  }

  override act(delta: number): void {
    this.rotation += delta * 0.2
    if (this.scene.mouseInfo.buttons.left) this.rotation += delta
  }
}