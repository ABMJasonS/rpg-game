import { sound } from "@pixi/sound";
import { Application, Assets, Graphics, TextureStyle } from "pixi.js";
import { GameAssets } from "./definitions/assets.js";
import { Enemies } from "./definitions/enemies.js";
import { Weapons } from "./definitions/weapons.js";
import { $ } from "./dom.js";
import { Background } from "./objects/background.js";
import { CursorTest } from "./objects/cursortest.js";
import { Enemy } from "./objects/enemy.js";
import { Player } from "./objects/player.js";
import { TestObject } from "./objects/testobject.js";
import { GameScene } from "./scene.js";
import { createVector } from "./vector.js";

(async () => {
  TextureStyle.defaultOptions.scaleMode = "nearest";

  const app = new Application();

  await app.init({
    resizeTo: $("#main-frame"),
    background: 0x000000,
    preference: "webgpu",
    hello: true,
  });

  const game = new GameScene(app);

  for (const directory of ["enemies", "weapons", "misc"]) {
    // @ts-expect-error Typescript being shit again
    for (const [name, extension] of Object.entries(GameAssets.images[directory])) {
      // @ts-expect-error Typescript type inference is so good wow
      await game.addImageAsset(`${directory}/${name}`, extension);
    }
    // @ts-expect-error Typescript being shit again
    for (const [name, extension] of Object.entries(GameAssets.sounds[directory])) {
      sound.add(`${directory}/${name}`, `./sfx/${directory}/${name}.${extension}`);
    }
  }
  console.info("Assets are loaded!");
  console.log(game._image_assets);

  game.addObject(new Player(game));

  // game.addObject(new CursorTest(game));

  game.addObject(new Background(game));

  game.addObject(new Enemy({ x: -1500, y: -1500 }, game, Enemies.toast));
  game.addObject(new Enemy({ x: 1500, y: -1500 }, game, Enemies.toast));
  game.addObject(new Enemy({ x: 1500, y: 1500 }, game, Enemies.toast));
  game.addObject(new Enemy({ x: -1500, y: 1500 }, game, Enemies.toast));
  game.addObject(new Enemy({ x: -1500, y: -1500 }, game, Enemies.toast));
  game.addObject(new Enemy({ x: 1500, y: -1500 }, game, Enemies.toast));
  game.addObject(new Enemy({ x: 1500, y: 1500 }, game, Enemies.toast));
  game.addObject(new Enemy({ x: -1500, y: 1500 }, game, Enemies.toast));
  game.addObject(new Enemy({ x: 3000, y: 0 }, game, Enemies.toaster));
  game.addObject(new Enemy({ x: -3000, y: 0 }, game, Enemies.toaster));
  game.addObject(new Enemy({ x: 0, y: 3000 }, game, Enemies.toaster));
  game.addObject(new Enemy({ x: 0, y: -3000 }, game, Enemies.toaster));

  let fps = "";

  app.ticker.add((ticker) => {
    fps = ticker.FPS.toFixed(0);
    game.act(1 / ticker.FPS);
  });

  setInterval(() => {
    $("#fps-counter").innerText = `${fps} FPS | ${game._objects.length} Objects | ${app.stage.children.length} Pixi Children`;
  }, 1000);

  sound.play("misc/bgnoise", {
    loop: true,
  });

  setInterval(
    () => {
      sound.play(`misc/cameraclick${Math.round(Math.random() + 1)}`);
    },
    (Math.floor(Math.random() * (10 - 5 + 1)) + 10) * 1000,
  );

  $("#main-frame").appendChild(app.canvas);
  $("#loading").style.display = "none";
  $("#game").style.visibility = "";

  app.resize();

  // @ts-expect-error esbuild define
  if (window.DEV) {
    // @ts-expect-error for pixi dev tools
    window.__PIXI_APP__ = app
  }
})();

// @ts-expect-error esbuild define
if (!window.DEV) {
  window.addEventListener("beforeunload", (e) => {
    e.preventDefault();
  });
}

// @ts-expect-error esbuild define
if (window.DEV) {
  new EventSource("/esbuild").addEventListener("change", () => {
    window.location.reload();
  });
}
