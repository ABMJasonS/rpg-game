import { Application } from "pixi.js";
import { $ } from "./dom.js";

(async () => {
  const app = new Application();
  
  await app.init({
    resizeTo: $("#main-frame"),
    background: 0xffffff
  })

  $("#main-frame").appendChild(app.canvas);
  
  app.ticker.add((ticker) => {
    $("#fps-counter").innerHTML = ticker.FPS.toString();
  });
})()