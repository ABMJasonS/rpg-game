import { Application } from "pixi.js";
import { $ } from "./dom.js";

const app = new Application();

$("#main-frame").appendChild(app.canvas);

app.ticker.add((ticker) => {
  $("#player-stats").innerHTML = ticker.FPS.toString();
});
