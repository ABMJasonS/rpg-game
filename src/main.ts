import { Application } from "pixi.js";
import { $ } from "./dom.js";
import { GameScene } from "./scene.js";
import { GameObject } from "./gameobject.js";

(async () => {
  const app = new Application();
  
  await app.init({
    resizeTo: $("#main-frame"),
    background: 0xffffff
  })

  $("#main-frame").appendChild(app.canvas)

  const game = new GameScene(app)

  game.addObject(new GameObject({x: 0, y: 0}, 0, game))
  
  app.ticker.add((ticker) => {
    $("#fps-counter").innerHTML = ticker.FPS.toFixed(0);
  });

  setInterval(() => {
    game.act(1 / 240)
  }, 1000 / 240)
})()