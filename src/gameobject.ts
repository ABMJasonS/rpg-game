import { Container } from "pixi.js";

export class GameObject {
  pixiContainer: Container;
  constructor() {
    this.pixiContainer = new Container();
  }
}