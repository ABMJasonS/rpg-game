import { Assets, TilingSprite } from "pixi.js";
import { GameObject } from "../gameobject";
import type { GameScene } from "../scene";

export class Background extends GameObject {
  constructor(scene: GameScene) {
    super({ x: -50000, y: -50000 }, 0, scene);
    Assets.load("./img/tiles.png").then(asset => {
      this.pixiContainer.addChild(new TilingSprite({texture: asset, width: 100000, height: 100000, scale: 32}))
      this.pixiContainer.zIndex = -9999
    })
  }
  override act(delta: number): void {
    
  }
}
