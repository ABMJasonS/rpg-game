import { Background } from "../objects/background";
import { Enemy } from "../objects/enemy";
import { Player } from "../objects/player";
import type { GameScene } from "../scene";
import { Enemies } from "./enemies";

export type LevelSchema = {
  name: string;
  stages: StageSchema[];
  restartCondition: (scene: GameScene) => boolean;
  onRestart: (scene: GameScene) => void;
};

export type StageSchema = {
  finishCondition: (scene: GameScene) => boolean;
  onStart: (scene: GameScene) => void;
  onFinish: (scene: GameScene) => void;
};

export const Levels: LevelSchema[] = [
  {
    name: "The Kitchen",
    restartCondition(scene) {
      const player = scene.findObjects<Player>(Player)[0];
      if (!player) return false;
      return player.dead;
    },
    onRestart(scene) {
      scene.removeAllObjects();
    },
    stages: [
      {
        finishCondition(scene) {
          return scene._objects.filter((obj) => obj instanceof Enemy).length === 0;
        },
        onStart(scene) {
          scene.addObject(new Background(scene));
          scene.addObject(new Player(scene));
          scene.addObject(new Enemy({ x: -1500, y: -1500 }, scene, Enemies.toast));
          scene.addObject(new Enemy({ x: 1500, y: -1500 }, scene, Enemies.toast));
          scene.addObject(new Enemy({ x: 1500, y: 1500 }, scene, Enemies.toast));
          scene.addObject(new Enemy({ x: -1500, y: 1500 }, scene, Enemies.toast));
        },
        onFinish(scene) {
          console.log("aaaa");
        },
      },
    ],
  },
  {
    name: "The Kitchen",
    restartCondition(scene) {
      const player = scene.findObjects<Player>(Player)[0];
      if (!player) return false;
      return player.dead;
    },
    onRestart(scene) {
      scene.removeAllObjects();
    },
    stages: [
      {
        finishCondition(scene) {
          return scene._objects.filter((obj) => obj instanceof Enemy).length === 0;
        },
        onStart(scene) {
          scene.addObject(new Enemy({ x: -1500, y: -1500 }, scene, Enemies.toast));
          scene.addObject(new Enemy({ x: 1500, y: -1500 }, scene, Enemies.toast));
          scene.addObject(new Enemy({ x: 1500, y: 1500 }, scene, Enemies.toast));
          scene.addObject(new Enemy({ x: -1500, y: 1500 }, scene, Enemies.toast));
          scene.addObject(new Enemy({ x: -1500, y: -1500 }, scene, Enemies.toast));
          scene.addObject(new Enemy({ x: 1500, y: -1500 }, scene, Enemies.toast));
          scene.addObject(new Enemy({ x: 1500, y: 1500 }, scene, Enemies.toast));
          scene.addObject(new Enemy({ x: -1500, y: 1500 }, scene, Enemies.toast));
          scene.addObject(new Enemy({ x: 3000, y: 0 }, scene, Enemies.toaster));
          scene.addObject(new Enemy({ x: -3000, y: 0 }, scene, Enemies.toaster));
          scene.addObject(new Enemy({ x: 0, y: 3000 }, scene, Enemies.toaster));
          scene.addObject(new Enemy({ x: 0, y: -3000 }, scene, Enemies.toaster));
        },
        onFinish(scene) {
          console.log("aaaa");
        },
      },
    ],
  },
];
