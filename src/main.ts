import { Application, Graphics, TextureStyle } from "pixi.js";
import { $ } from "./dom.js";
import { GameScene } from "./scene.js";
import { Player } from "./objects/player.js";
import { TestObject } from "./objects/testobject.js";
import { createVector } from "./vector.js";
import { CursorTest } from "./objects/cursortest.js";
import { Weapons } from "./definitions/weapons.js";
import { sound } from "@pixi/sound";
import { Background } from "./objects/background.js";
import { Enemy } from "./objects/enemy.js";

(async () => {
  TextureStyle.defaultOptions.scaleMode = "nearest";

  const app = new Application();

  await app.init({
    resizeTo: $("#main-frame"),
    background: 0x000000,
  });

  for (const [_, weapon] of Object.entries(Weapons)) {
    if (!weapon.useSound) return;
    sound.add(weapon.useSound, `./sfx/${weapon.useSound}`);
  }
  console.info("Sounds are loaded!");

  $("#main-frame").appendChild(app.canvas);

  const game = new GameScene(app);

  game.addObject(new Player(game));

  // game.addObject(new CursorTest(game));

  game.addObject(new Background(game))

  game.addObject(new Enemy({x: 0, y: 0}, game))

  let fps = "";

  app.ticker.add((ticker) => {
    fps = ticker.FPS.toFixed(0);
  });

  const TPS = 120;
  setInterval(() => {
    game.act(1 / TPS);
  }, 1000 / TPS);

  setInterval(() => {
    $("#fps-counter").innerText =
      `${fps} FPS | ${TPS} TPS | ${game._objects.length} Objects`;
  }, 1000);
})();
