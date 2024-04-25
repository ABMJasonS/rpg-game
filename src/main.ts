import { Application, Graphics, TextureStyle } from "pixi.js";
import { $ } from "./dom.js";
import { GameScene } from "./scene.js";
import { Player } from "./objects/player.js";
import { TestObject } from "./objects/testobject.js";
import { createVector } from "./vector.js";
import { CursorTest } from "./objects/cursortest.js";
import { Weapons } from "./definitions/weapons.js";
import { sound } from "@pixi/sound";

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

  for (let i = 0; i < 10; i++) {
    game.addObject(
      new TestObject(
        game,
        createVector(Math.random() * 1000 - 500, Math.random() * 1000 - 500),
      ),
    );
  }

  // game.addObject(new CursorTest(game));

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
