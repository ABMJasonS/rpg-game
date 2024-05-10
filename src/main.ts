import { sound } from "@pixi/sound";
import { Application, Assets, Graphics, TextureStyle } from "pixi.js";
import { GameAssets } from "./definitions/assets.js";
import { PlayerClasses } from "./definitions/classes.js";
import { Levels } from "./definitions/levels.js";
import { $, html } from "./dom.js";
import { GameScene } from "./scene.js";

(async () => {
  TextureStyle.defaultOptions.scaleMode = "nearest";

  const app = new Application();

  await app.init({
    resizeTo: $("#main-frame"),
    background: 0x000000,
    hello: true,
  });

  const game = new GameScene(app, Levels[0], 0);

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

  let fps = "";

  app.ticker
    .add((ticker) => {
      fps = ticker.FPS.toFixed(0);
      game.act(1 / ticker.FPS);
    })
    .stop();

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
  $("body").classList.remove("loading");
  $("#loading").style.display = "none";
  $("#game").style.visibility = "visible";

  /*let playerName = "";
  const playerNameField = $<HTMLInputElement>("#player-name")
  playerNameField.addEventListener("click", () => {
    playerName = playerNameField.value
  })*/

  /*
  const playButton = $("#play-button")
  playButton.innerText = "Play Kitchen Nightmare"
  playButton.addEventListener("click", () => {
    $("#menu").style.display = "none"
    $("#classes-container").style.display = ""
  })
  */

  const selectedClass = 0;

  /*
  $("#classes").innerHTML = PlayerClasses.map((playerClass, i) => html`
    <input ${i === 0 ? "checked" : ""} name="class" id="class-${i}" type="radio" value="${i}" />
    <label for="class=${i}">${playerClass.name}</label>`
  ).join("")
  $("#open-world").addEventListener("click", () => {
    $("#classes-container").style.display = "none";
    $("#levels-container").style.display = "";
  })
  */

  const selectedLevel = 0;

  /*
  $("#levels").innerHTML = Levels.map((level, i) => html`
    <input ${i === 0 ? "checked": ""} name="level" type="radio" id="level-${i}" value="${i}"/>
    <label for="level-${i}">${level.name}</label>`
  ).join("")
  $("#levels").addEventListener("change", (e) => {
    selectedLevel = Number.parseInt((e.target as HTMLInputElement).value) ?? 0;
  })
  */

  /*
  $("#open-level").addEventListener("click", () => {
    $("#levels-container").style.display = "none"
    */
  $("#game").style.display = "";
  game.level = Levels[selectedLevel];
  game.start();
  game.resize();
  app.ticker.start();
  app.resize();
  /*
  })
  */

  // @ts-expect-error esbuild define
  if (window.DEV) {
    // @ts-expect-error for devving
    window.GAME = game;
    // @ts-expect-error for pixi dev tools
    window.__PIXI_APP__ = app;
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
