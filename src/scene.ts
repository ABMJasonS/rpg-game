import { type Application, NoiseFilter, GenerateTextureOptions, Container, Texture } from "pixi.js";
import type { GameObject } from "./gameobject";
import { type Radians, type Vector, createVector } from "./vector";
import { $ } from "./dom";
import { BulgePinchFilter, CRTFilter } from "pixi-filters";

export class GameScene {
	application: Application;
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

	/**
	 * Creates a scene
	 * @param application The Pixi.js Application class to use
	 */
	constructor(application: Application) {
		this.application = application;
		const mainFrame = $("#main-frame");

		const rescale = () => {
			const dimensions = $("#main-frame").getBoundingClientRect();
			this.camera._scale =
				(dimensions.width * dimensions.height) / (2000 * 2000);
			this.camera.offset.x = dimensions.width / 2;
			this.camera.offset.y = dimensions.height / 2;
		};
		rescale();
		window.addEventListener("resize", rescale);

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
		});this
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
			new BulgePinchFilter({
				center: createVector(0.5, 0.5),
				radius: this.application.canvas.width,
				strength: .8,
			}),
			this._noisefilter,
			new CRTFilter({
				vignetting: 0.6,
				vignettingBlur: 0.5
			}),
		];
	}

	/**
	 * Adds a game object to the scene
	 * @param object The game object to add
	 */
	addObject(object: GameObject) {
		object.updateGraphics()
		object.updateHitbox()
		this._objects.push(object);
		this.application.stage.addChild(object.pixiContainer);
	}

	/**
	 * Removes a game object from the scene
	 * @param object The game object to remove
	 */
	removeObject(object: GameObject) {
		this._objects.splice(
			this._objects.findIndex((obj) => obj === object),
			1,
		);
		this.application.stage.removeChild(object.pixiContainer);
	}

	 /**
		* Finds game objects based on type
		* @param object Type of game object to find
		* @returns The game objects
		*/
  findObjects<T extends GameObject>(object: unknown): T[] {
		// @ts-expect-error the most hacky typescript shit ever
    return this._objects.filter((obj) => obj instanceof object)
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
		return this.application.renderer.textureGenerator.generateTexture(thing)
	}

	/**
	 * The physics process of the scene
	 * @param delta Delta time
	 */
	act(delta: number) {
		this._noisefilter.seed = Math.random();
		for (const object of this._objects) {
			object.act(delta * this.gameSpeed);
			object.updateHitbox()
			object.updateGraphics();
		}

		this.application.stage.x =
			-(this.camera.position.x * this.camera.zoom * this.camera._scale) +
			this.camera.offset.x;
		this.application.stage.y =
			-(this.camera.position.y * this.camera.zoom * this.camera._scale) +
			this.camera.offset.y;
		this.application.stage.scale = this.camera.zoom * this.camera._scale;

		this.mouseInfo.position = {
			x:
				((this.mouseInfo._offset.x - this.camera.offset.x) /
					this.camera._scale) *
					this.camera.zoom +
				this.camera.position.x,
			y:
				((this.mouseInfo._offset.y - this.camera.offset.y) /
					this.camera._scale) *
					this.camera.zoom +
				this.camera.position.y,
		};
	}
}
