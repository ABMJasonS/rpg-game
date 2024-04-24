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
  keysDown: string[] = [];
  mouseInfo: {
    position: Vector;
    buttons: {
      left: boolean
    }
  } = {
    position: { x: 0, y: 0},
    buttons: {
      left: false
    }
  }

  constructor(application: Application) {
    this.application = application;
    const mainFrame = $("#main-frame")

    const rescale = () => {
      const dimensions = $("#main-frame").getBoundingClientRect();
      this.camera.scale =
        (dimensions.width * dimensions.height) / (1000 * 1000);
      this.camera.offset.x = dimensions.width / 2;
      this.camera.offset.y = dimensions.height / 2;
    };
    rescale();
    window.addEventListener("resize", rescale);

    window.addEventListener("keydown", (e) => {
      if (!this.keysDown.find((k) => k == e.key)) {
        this.keysDown.push(e.key);
      }
    });
    window.addEventListener("keyup", (e) => {
      const index = this.keysDown.findIndex((k) => k == e.key);
      if (index !== -1) {
        this.keysDown.splice(index, 1);
      }
    });

    mainFrame.addEventListener("mousedown", (e) => {
      if (e.button === 0) this.mouseInfo.buttons.left = true;
    })
    mainFrame.addEventListener("mouseup", (e) => {
      if (e.button === 0) this.mouseInfo.buttons.left = false;
    })

    mainFrame.addEventListener("mousemove", (e) => {
      this.mouseInfo.position = {
        x: (e.offsetX - this.camera.offset.x) / this.camera.scale * this.camera.zoom + this.camera.position.x,
        y: (e.offsetY - this.camera.offset.y) / this.camera.scale * this.camera.zoom + this.camera.position.y
      }
    })
  }

  addObject(object: GameObject) {
    this.objects.push(object);
    this.application.stage.addChild(object.pixiContainer);
  }

  removeObject(object: GameObject) {
    this.objects.splice(this.objects.findIndex(obj => obj === object), 1)
    this.application.stage.removeChild(object.pixiContainer);
    console.log(this.objects)
  }

  /**
   * Checks if a key on the keyboard is down
   * @param key The key string to check for
   * @returns True if the key is down
   */
  isKeyDown(key: string) {
    return this.keysDown.find((k) => k === key) !== undefined;
  }

  /**
   * The physics process of the scene
   * @param delta Delta time
   */
  act(delta: number) {
    for (const object of this.objects) {
      object.act(delta);
      object.updateGraphics();
    }

    this.application.stage.x =
      -(this.camera.position.x * this.camera.zoom * this.camera.scale) +
      this.camera.offset.x;
    this.application.stage.y =
      -(this.camera.position.y * this.camera.zoom * this.camera.scale) +
      this.camera.offset.y;
    this.application.stage.scale = this.camera.zoom * this.camera.scale;
  }
}
