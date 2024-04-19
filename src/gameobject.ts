import { Container } from "pixi.js";
import { Radians, Vector } from "./vector";
import { GameScene } from "./scene";

export class GameObject {
  pixiContainer: Container;
  position: Vector;
  rotation: Radians;
  scene: GameScene;
  constructor(position: Vector, rotation: Radians, scene: GameScene) {
    this.pixiContainer = new Container();
    this.position = position;
    this.rotation = rotation;
    this.scene = scene;
  }
  /**
   * The physics process of the game object
   * @param delta The delta time (time between last frame and second-last frame in seconds)
   */
  act(delta: number) {
    console.log(`This method should be overwritten! Delta time is ${delta}`);
  }

  updateGraphics() {
    this.pixiContainer.x = this.position.x;
    this.pixiContainer.y = this.position.y;
    this.pixiContainer.rotation = this.rotation;
  }
}
