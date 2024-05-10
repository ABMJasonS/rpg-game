import { Assets, Color, Graphics, Sprite } from "pixi.js";
import { Rectangle } from "../collisions";
import { Enemies } from "../definitions/enemies";
import { type WeaponSchema, Weapons } from "../definitions/weapons";
import { $, html } from "../dom";
import { GameObject } from "../gameobject";
import type { GameScene } from "../scene";
import { Derived, Signal } from "../signals";
import { type Vector, addVectors, createPolar, createVector, scale, setLength, subVectors, vectorAngle } from "../vector";
import { Enemy } from "./enemy";
import { Particle } from "./particle";
import { Weapon } from "./weapon";

export class Player extends GameObject {
  speed = 1000;
  health = new Signal(1);
  fireCount = 0;
  velocity: Vector = createVector(0, 0);
  weapons: Signal<string[]> = new Signal(["butterknife", "jam_gun"]);
  currentWeapon: Signal<number> = new Signal(0);
  override hitbox: Rectangle = new Rectangle(createVector(-100, -100), createVector(100, 100));
  immunity = 0;
  dead = false;
  dying = false;

  constructor(scene: GameScene) {
    super({ x: 0, y: 0 }, 0, scene);

    const sprite = Sprite.from(this.scene.getImageAsset("misc/bread").texture);
    sprite.anchor.set(0.5);
    sprite.scale.set(10);
    this.pixiContainer = sprite;

    new Derived(
      () => {
        $("#hp-bar-inner").style.width = `${this.health.get()}%`;
        $("#hp-value").innerText = (this.health.get() > 0 ? this.health.get() : 0).toFixed(0);
      },
      undefined,
      [this.health],
    );
    /*
    new Derived(
      () => {
        $("#inventory").innerHTML = this.weapons.get().map((weaponID, i) => {
          const weapon = Weapons[weaponID];
          const asset = this.scene.getImageAsset(`weapons/${weapon.spriteFile}`)
          return `<img id="weapon-${i}" src="./img/${asset.path}.${asset.extension}" />`
        }).join("")
        for (const key of [0, 1, 2, 3, 4, 5, 6, 7]) {
          try {
            $(`#weapon-${key}`).addEventListener("click", () => {
              this.currentWeapon.set(key)
            })
          } catch { }
        }
      },
      undefined,
      [this.currentWeapon, this.weapons]
    )
    */
  }

  override act(delta: number): void {
    if (this.dead) return;
    if (this.immunity < 0) {
      this.immunity = 0;
    } else {
      this.immunity -= delta;
      this.pixiContainer.tint = new Color({
        r: 255,
        g: (1 - this.immunity) * 255,
        b: (1 - this.immunity) * 255,
      });
    }

    if (this.health.get() <= 0 && !this.dead) {
      this.death();
    }

    this.movement(delta);

    this.scene.camera.position = this.position;

    if (this.scene.isKeyDown("+")) this.scene.camera.zoom += delta * 0.001;
    if (this.scene.isKeyDown("-")) this.scene.camera.zoom -= delta * 0.001;

    if (this.scene.isKeyDown("q")) this.health.change((hp) => hp - delta);
    if (this.scene.isKeyDown("e")) this.scene.addObject(new Enemy(addVectors(this.position, createVector(300, 0)), this.scene, Enemies.toast));

    this.weaponSwitching();

    this.attack(delta);

    this.fireCount += delta;
  }

  movement(delta: number) {
    let movement = createVector(0, 0);
    if (this.scene.isKeyDown("a") || this.scene.isKeyDown("ArrowLeft")) movement.x -= 1;
    if (this.scene.isKeyDown("d") || this.scene.isKeyDown("ArrowRight")) movement.x += 1;
    if (this.scene.isKeyDown("w") || this.scene.isKeyDown("ArrowUp")) movement.y -= 1;
    if (this.scene.isKeyDown("s") || this.scene.isKeyDown("ArrowDown")) movement.y += 1;
    movement = setLength(movement, 1);

    this.pixiContainer.scale.x = this.scene.mouseInfo.position.x - this.position.x > 0 ? -10 : 10;

    this.position = addVectors(this.position, scale(movement, delta * 1000));
  }

  attack(delta: number) {
    const usingWeapon = Weapons[this.weapons.get()[this.currentWeapon.get()]];
    if (this.fireCount < usingWeapon.useTime) return;
    if (this.scene.isKeyDown(" ") || this.scene.mouseInfo.buttons.left) {
      this.fireCount = 0;
      this.scene.addObject(new Weapon(this.position, vectorAngle(subVectors(this.scene.mouseInfo.position, this.position)), this.scene, this, usingWeapon));
    }
  }

  hit(damage: number) {
    if (this.immunity > 0) return;
    this.health.change((old) => old - damage);
    this.immunity = 1;
  }

  weaponSwitching() {
    for (const key of [1, 2, 3, 4, 5, 6, 7, 8]) {
      if (this.scene.isKeyDown(key.toString()) && key <= this.weapons.get().length) this.currentWeapon.set(key - 1);
    }
  }

  death() {
    this.pixiContainer.visible = false;
    for (let i = 0; i < 10; i++) {
      this.scene.addObject(
        new Particle(
          {
            position: this.position,
            rotation: Math.random() * Math.PI * 2,
            texture: this.scene.getImageAsset("").texture,
            period: Math.random() + 0.5,
            act(particle, progress, delta, sprite, seed) {
              sprite.anchor.set(0.5);
              sprite.scale.set(32 * (1 - progress) * seed);
              sprite.rotation += (seed - 0.5) * 5 * delta;
              particle.position = addVectors(particle.position, createPolar(delta * 1000 * seed, particle.rotation));
              sprite.alpha = 1 - progress;
            },
          },
          this.scene,
        ),
      );
    }
    this.dead = true;

    this.scene.removeObject(this);
  }
}
