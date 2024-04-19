import { Application, Graphics } from "pixi.js";
import { $ } from "./dom.js";
import { GameScene } from "./scene.js";
import { Player } from "./objects/player.js";
import { TestObject } from "./objects/testobject.js";
import { createVector } from "./vector.js";

(async () => {
  const app = new Application();

  await app.init({
    resizeTo: $("#main-frame"),
    background: 0x000000,
  });

  $("#main-frame").appendChild(app.canvas);

  const game = new GameScene(app);

  game.addObject(new Player(game));

  for (let i = 0; i < 10; i++) {
    game.addObject(new TestObject(game, createVector(Math.random() * 1000 - 500, Math.random() * 1000 - 500)));
  }

  let fps = "";

  app.ticker.add((ticker) => {
    fps = ticker.FPS.toFixed(0);
  });

  const TPS = 240;
  setInterval(() => {
    game.act(1 / TPS);
  }, 1000 / TPS);

  setInterval(() => {
    $("#fps-counter").innerText = `${fps} FPS`;
  }, 1000);
})();
