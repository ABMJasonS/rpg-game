import { Container } from "pixi.js";
import { Radians, Vector } from "./vector";
import { GameScene } from "./scene";

export class GameObject {
  pixiContainer: Container;
  position: Vector;
  rotation: Radians;
  constructor(position: Vector, rotation: Radians, scene: GameScene) {
    this.pixiContainer = new Container();
    this.position = position;
    this.rotation = rotation;
  }
  /**
   * The physics process of the game object
   * @param delta The delta time (time between last frame and second-last frame in seconds)
   */
  act(delta: number) {}
}