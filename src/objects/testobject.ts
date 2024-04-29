import { Assets, Graphics, Sprite } from "pixi.js";
import { GameObject } from "../gameobject";
import type { GameScene } from "../scene";
import { type Vector, createVector } from "../vector";

export class TestObject extends GameObject {
  constructor(scene: GameScene, position: Vector) {
    super(position, 0, scene);
    const sprite = Sprite.from(this.scene.getImageAsset("misc/test-image").texture);
    sprite.anchor.set(0.5);
    sprite.width *= 1.5;
    this.pixiContainer.addChild(sprite);
    this.pixiContainer.zIndex = -999;
  }

  override act(delta: number): void {
    this.rotation += delta * 0.2;
    if (this.scene.mouseInfo.buttons.left) this.rotation += delta;
  }
}
