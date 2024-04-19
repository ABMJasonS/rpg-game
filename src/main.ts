import { Application, Graphics } from "pixi.js";
import { $ } from "./dom.js";
import { GameScene } from "./scene.js";
import { Player } from "./objects/player.js";
import { TestObject } from "./objects/testobject.js";

(async () => {
  const app = new Application();

  await app.init({
    resizeTo: $("#main-frame"),
    background: 0x000000,
  });

  $("#main-frame").appendChild(app.canvas);

  const game = new GameScene(app);

  game.addObject(new Player(game));

  game.addObject(new TestObject(game));

  let fps = "";

  app.ticker.add((ticker) => {
    fps = ticker.FPS.toFixed(0);
  });

  setInterval(() => {
    game.act(1 / 240);
  }, 1000 / 240);

  setInterval(() => {
    $("#fps-counter").innerText = fps;
  }, 1000);
})();
