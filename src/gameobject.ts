import { Container } from "pixi.js";
import type { Hitbox } from "./collisions";
import type { GameScene } from "./scene";
import type { Radians, Vector } from "./vector";

export class GameObject {
  pixiContainer: Container;
  position: Vector;
  rotation: Radians;
  scene: GameScene;
  collider: Hitbox | undefined = undefined;
  hitbox: Hitbox | undefined = undefined;
  _destroyed = false;
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

  updateHitbox() {
    if (this._destroyed) return;
    if (!this.hitbox) return;
    this.collider = this.hitbox.clone();
    this.collider.translate(this.position);
  }

  updateGraphics() {
    if (this._destroyed) return;
    this.pixiContainer.x = this.position.x;
    this.pixiContainer.y = this.position.y;
    this.pixiContainer.rotation = this.rotation;
  }
}
