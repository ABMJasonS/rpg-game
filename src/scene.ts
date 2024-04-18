import { Application } from "pixi.js";
import { GameObject } from "./gameobject";

export class GameScene {
  application: Application;
  objects: GameObject[] = [];

  constructor(application: Application) {
    this.application = application
  }

  addObject(object: GameObject) {
    this.objects.push(object)
    this.application.stage.addChild(object.pixiContainer)
  }

  removeObject(object: GameObject) {
    this.objects.filter(obj => obj != object)
    this.application.stage.removeChild(object.pixiContainer)
  }

  act(delta: number) {
    for (const object of this.objects) {
      object.act(delta)
    }
  }
}