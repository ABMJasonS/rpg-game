import { Application } from "pixi.js";
import { GameObject } from "./gameobject";
import { Radians, Vector } from "./vector";
import { $ } from "./dom";

export class GameScene {
  application: Application;
  objects: GameObject[] = [];
  camera: {
    position: Vector;
    offset: Vector;
    rotation: Radians;
    zoom: number;
    scale: number;
  } = {
    position: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    rotation: 0,
    zoom: 1,
    scale: 0,
  };

  constructor(application: Application) {
    this.application = application;
    const rescale = () => {
      const dimensions = $("#main-frame").getBoundingClientRect();
      this.camera.scale =
        (dimensions.width * dimensions.height) / (1000 * 1000);
      this.camera.offset.x = dimensions.width / 2;
      this.camera.offset.y = dimensions.height / 2;
    };
    rescale();
    window.addEventListener("resize", rescale);
  }

  addObject(object: GameObject) {
    this.objects.push(object);
    this.application.stage.addChild(object.pixiContainer);
  }

  removeObject(object: GameObject) {
    this.objects.filter((obj) => obj != object);
    this.application.stage.removeChild(object.pixiContainer);
  }

  act(delta: number) {
    this.application.stage.x = this.camera.position.x + this.camera.offset.x;
    this.application.stage.y = this.camera.position.y + this.camera.offset.y;
    this.application.stage.scale = this.camera.zoom * this.camera.scale;

    for (const object of this.objects) {
      object.act(delta);
    }
  }
}
