import { Assets, TilingSprite } from "pixi.js";
import { GameObject } from "../gameobject";
import { GameScene } from "../scene";

export class Background extends GameObject {
  constructor(scene: GameScene) {
    super({ x: -10000, y: -10000 }, 0, scene);
    Assets.load("./img/test-image.jpg").then(asset => {
      this.pixiContainer.addChild(new TilingSprite({texture: asset, width: 20000, height: 20000}))
      this.pixiContainer.zIndex = -9999
    })
  }
}
