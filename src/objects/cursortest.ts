import { Graphics } from "pixi.js";
import { GameObject } from "../gameobject";
import type { GameScene } from "../scene";
import { createVector } from "../vector";

export class CursorTest extends GameObject {
  constructor(scene: GameScene) {
    super(createVector(0, 0), 0, scene)
    this.pixiContainer.addChild(new Graphics().circle(0, 0, 10).fill({color: 0x00ff00}))
  }

  override act(delta: number): void {
    this.position = this.scene.mouseInfo.position
  }
}