import { Application, Graphics } from "pixi.js";
import { $ } from "./dom.js";
import { GameScene } from "./scene.js";
import { GameObject } from "./gameobject.js";

(async () => {
  const app = new Application();
  
  await app.init({
    resizeTo: $("#main-frame"),
    background: 0x000000
  })

  $("#main-frame").appendChild(app.canvas)

  const game = new GameScene(app)

  const object = new GameObject({x: 0, y: 0}, 0, game)

  object.pixiContainer.addChild(new Graphics().circle(0, 0, 100).fill())

  object.act = (delta) => {
    object.position.x += delta * 10;
    object.pixiContainer.x = object.position.x;
  }

  game.addObject(object)
  
  app.ticker.add((ticker) => {
    $("#fps-counter").innerHTML = ticker.FPS.toFixed(0);
  });

  setInterval(() => {
    game.act(1 / 240)
  }, 1000 / 240)
})()