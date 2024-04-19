import { Assets, Graphics, Sprite } from "pixi.js";
import { GameObject } from "../gameobject";
import { GameScene } from "../scene";
import { createVector } from "../vector";

export class TestObject extends GameObject {
  constructor(scene: GameScene) {
    super(createVector(0, 0), 0, scene);
    Assets.load("./img/test-image.jpg").then(image => {
      this.pixiContainer.addChild(Sprite.from(image))
      this.pixiContainer.zIndex = -999
    })
  }
}