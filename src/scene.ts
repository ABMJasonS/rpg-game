import { BulgePinchFilter, CRTFilter } from "pixi-filters";
import { type Application, Assets, type Container, type GenerateTextureOptions, NoiseFilter, type Texture } from "pixi.js";
import { type LevelSchema, Levels } from "./definitions/levels";
import { $, html } from "./dom";
import type { GameObject } from "./gameobject";
import { type Radians, type Vector, createVector } from "./vector";

export class GameScene {
  application: Application;

  // @ts-expect-error No it fucking doesn't
  _image_assets: [{ path: string; extension: string; texture: Texture }] = [];

  // @ts-expect-error it does exist
  _null_asset: Texture;

  _objects: GameObject[] = [];
  /**
   * The current camera state of the scene
   */
  camera: {
    position: Vector;
    offset: Vector;
    rotation: Radians;
    zoom: number;
    _scale: number;
  } = {
    position: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    rotation: 0,
    zoom: 1,
    _scale: 0,
  };
  private _keysDown: string[] = [];
  /**
   * The current position and buttons pressed on the user's mouse
   */
  mouseInfo: {
    position: Vector;
    _offset: Vector;
    buttons: {
      left: boolean;
    };
  } = {
    position: { x: 0, y: 0 },
    _offset: { x: 0, y: 0 },
    buttons: {
      left: false,
    },
  };
  _noisefilter: NoiseFilter;

  gameSpeed = 1;

  level: LevelSchema;
  levelStage: number;

  paused = false;

  /**
   * Creates a scene
   * @param application The Pixi.js Application class to use
   */
  constructor(application: Application, level: LevelSchema, levelStage: number) {
    this.application = application;

    const mainFrame = $("#main-frame");

    window.addEventListener("resize", this.resize);

    window.addEventListener("keydown", (e) => {
      if (!this._keysDown.find((k) => k === e.key)) {
        this._keysDown.push(e.key);
      }
    });
    window.addEventListener("keyup", (e) => {
      const index = this._keysDown.findIndex((k) => k === e.key);
      if (index !== -1) {
        this._keysDown.splice(index, 1);
      }
    });

    mainFrame.addEventListener("pointerdown", (e) => {
      if (e.button === 0) this.mouseInfo.buttons.left = true;
    });
    this;
    mainFrame.addEventListener("pointerup", (e) => {
      if (e.button === 0) this.mouseInfo.buttons.left = false;
    });

    mainFrame.addEventListener("pointermove", (e) => {
      this.mouseInfo._offset = {
        x: e.offsetX,
        y: e.offsetY,
      };
    });

    this._noisefilter = new NoiseFilter({ noise: 0.5 });
    this.application.stage.filters = [
      this._noisefilter,
      new CRTFilter({
        vignetting: 0.6,
        vignettingBlur: 0.5,
      }),
    ];

    Assets.load("./img/nullptr.png").then((asset) => {
      this._null_asset = asset;
    });

    this.level = level;
    this.levelStage = 0;

    $("#location").innerText = level.name;
  }

  resize() {
    const dimensions = $("#main-frame").getBoundingClientRect();
    this.camera._scale = (dimensions.width * dimensions.height) / (1200 * 1200);
    this.camera.offset.x = dimensions.width / 2;
    this.camera.offset.y = dimensions.height / 2;
  }

  /**
   * Adds a game object to the scene
   * @param object The game object to add
   */
  addObject(object: GameObject) {
    object.updateGraphics();
    object.updateHitbox();
    this._objects.push(object);
    this.application.stage.addChild(object.pixiContainer);
  }

  /**
   * Removes a game object from the scene
   * @param object The game object to remove
   */
  removeObject(object: GameObject) {
    object._destroyed = true;
    object.pixiContainer.visible = false;
  }

  removeAllObjects() {
    for (const object of this._objects) {
      this.removeObject(object);
    }
  }

  /**
   * Finds game objects based on type
   * @param object Type of game object to find
   * @returns The game objects
   */
  findObjects<T extends GameObject>(object: unknown): T[] {
    // @ts-expect-error the most hacky typescript shit ever
    return this._objects.filter((obj) => obj instanceof object);
  }

  findCollidingObjects<T extends GameObject>(object: GameObject, type: unknown): T[] {
    if (!object.collider) return [];
    return this.findObjects<T>(type).filter((obj) => obj.collider && object.collider?.collide(obj.collider) && obj !== object);
  }

  /**
   * Checks if a key on the keyboard is down
   * @param key The key string to check for
   * @returns True if the key is down
   */
  isKeyDown(key: string) {
    return this._keysDown.find((k) => k === key) !== undefined;
  }

  /**
   * Generates a Pixi.js texture
   */
  generateTexture(thing: GenerateTextureOptions | Container): Texture {
    return this.application.renderer.textureGenerator.generateTexture(thing);
  }

  async addImageAsset(path: string, extension: string) {
    const texture = await Assets.load(`./img/${path}.${extension}`);
    this._image_assets.push({ path, extension, texture });
  }

  getImageAsset(path: string) {
    const foundAsset = this._image_assets.find((asset) => asset.path === path);
    if (foundAsset === undefined) {
      console.error(`Asset ${path} doesn't exist`);
      return {
        path: "nullptr",
        extension: "png",
        texture: this._null_asset,
      };
    }
    return foundAsset;
  }

  /*
  sendHintMessage(text: string) {
    const hintFrame = $("#hint-frame")
    hintFrame.style.opacity = "1"
    hintFrame.innerText = text;
    setTimeout(() => {
      hintFrame.style.opacity = "0"
    }, 10000)
  }
  */

  start() {
    this.level.stages[this.levelStage].onStart(this);
  }

  /**
   * The physics process of the scene
   * @param delta Delta time
   */
  act(delta: number) {
    const deathScreen = $("#overlay-screen");
    if (this.paused) {
      if (this.isKeyDown(" ")) {
        this.level.onRestart(this);
        this.levelStage = 0;
        this.start();
        deathScreen.style.opacity = "0";
        deathScreen.innerHTML = html`
          <h1>You Died.</h1>
          <p>Press SPACE to Restart.</p>
        `;
        this.paused = false;
        return;
      }
      return;
    }
    if (this.level.restartCondition(this)) {
      this.paused = true;
      deathScreen.style.opacity = "1";
      return;
    }

    if (this.level.stages[this.levelStage].finishCondition(this)) {
      this.level.stages[this.levelStage].onFinish(this);
      if (this.level.stages.length === this.levelStage) {
        return;
      }
      this.levelStage++;
      this.level.stages[this.levelStage].onStart(this);
      console.log("next stage!");
    }

    this._noisefilter.seed = Math.random();

    this.updateObjects(delta);

    this.updateCamera();
  }

  updateObjects(delta: number) {
    for (const object of this._objects) {
      if (object._destroyed) {
        this._objects.splice(
          this._objects.findIndex((obj) => obj === object),
          1,
        );
        object.pixiContainer.destroy();
        continue;
      }
      object.act(delta * this.gameSpeed);
      object.updateHitbox();
      object.updateGraphics();
    }
  }

  updateCamera() {
    this.application.stage.x = -(this.camera.position.x * this.camera.zoom * this.camera._scale) + this.camera.offset.x;
    this.application.stage.y = -(this.camera.position.y * this.camera.zoom * this.camera._scale) + this.camera.offset.y;
    this.application.stage.scale = this.camera.zoom * this.camera._scale;

    this.mouseInfo.position = {
      x: ((this.mouseInfo._offset.x - this.camera.offset.x) / this.camera._scale) * this.camera.zoom + this.camera.position.x,
      y: ((this.mouseInfo._offset.y - this.camera.offset.y) / this.camera._scale) * this.camera.zoom + this.camera.position.y,
    };
  }
}
