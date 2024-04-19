import { Graphics } from "pixi.js";
import { GameObject } from "../gameobject";
import { GameScene } from "../scene";
import { createVector } from "../vector";

export class TestObject extends GameObject {
  constructor(scene: GameScene) {
    super(createVector(0, 0), 0, scene);
    this.pixiContainer.addChild(
      new Graphics({ pivot: { x: 0.5, y: 0.5 } })
        .rect(0, 0, 20, 20)
        .fill(0xff00ff),
    );
  }
}
