import { Assets, Graphics, Sprite } from "pixi.js";
import { GameObject } from "../gameobject";
import { GameScene } from "../scene";
import { $ } from "../dom";
import {
  Vector,
  addVectors,
  createVector,
  scale,
  setLength,
  subVectors,
  vectorAngle,
} from "../vector";
import { Projectile } from "./projectile";
import { Derived, Signal } from "../signals";
import { sound, filters } from "@pixi/sound";
import { Weapon } from "./weapon";
import { Weapons } from "../definitions/weapons";

export class Player extends GameObject {
  speed = 1000;
  health = new Signal(100);
  fireCount = 0;
  velocity: Vector = createVector(0, 0);
  friction = 5;
  constructor(scene: GameScene) {
    super({ x: 0, y: 0 }, 0, scene);
    Assets.load("./img/bread.png").then((asset) => {
      const sprite = Sprite.from(asset);
      sprite.anchor.set(0.5);
      sprite.scale.set(8);
      this.pixiContainer.addChild(sprite);
    });
    sound.add("fire", "./sfx/metal_pipe.wav");
    new Derived(
      () => {
        $<HTMLProgressElement>("#hp").value = this.health.get();
      },
      undefined,
      [this.health],
    );
  }

  override act(delta: number): void {
    let movement = createVector(0, 0);
    if (this.scene.isKeyDown("a") || this.scene.isKeyDown("ArrowLeft"))
      movement.x -= 1;
    if (this.scene.isKeyDown("d") || this.scene.isKeyDown("ArrowRight"))
      movement.x += 1;
    if (this.scene.isKeyDown("w") || this.scene.isKeyDown("ArrowUp"))
      movement.y -= 1;
    if (this.scene.isKeyDown("s") || this.scene.isKeyDown("ArrowDown"))
      movement.y += 1;
    movement = setLength(movement, 1);

    if (movement.x < 0) this.pixiContainer.scale.x = 1;
    if (movement.x > 0) this.pixiContainer.scale.x = -1;

    this.position = addVectors(this.position, scale(movement, delta * 1000));

    this.scene.camera.position = this.position;

    if (this.scene.isKeyDown("+")) this.scene.camera.zoom += delta;
    if (this.scene.isKeyDown("-")) this.scene.camera.zoom -= delta;

    if (this.scene.isKeyDown("q")) this.health.change((hp) => hp - delta);

    if (
      (this.scene.isKeyDown(" ") || this.scene.mouseInfo.buttons.left) &&
      this.fireCount > 1
    ) {
      this.fireCount = 0;
      sound.play("fire", {
        filters: [new filters.ReverbFilter(1)],
      });
      this.scene.addObject(
        new Weapon(
          this.position,
          vectorAngle(subVectors(this.scene.mouseInfo.position, this.position)),
          this.scene,
          Weapons.butter_knife,
        ),
      );
    }

    this.fireCount += delta;
  }
}
