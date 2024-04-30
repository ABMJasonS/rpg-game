import { Background } from "../objects/background";
import { Enemy } from "../objects/enemy";
import { Player } from "../objects/player";
import { GameScene } from "../scene";
import { Enemies } from "./enemies";

export type LevelSchema = {
  name: string;
  stages: StageSchema[];
  // TODO: implement obstacles
  obstacles: [];
};

export type StageSchema = {
  finishCondition: (scene: GameScene) => boolean;
  onStart: (scene: GameScene) => void;
  onFinish: (scene: GameScene) => void;
};

export const Levels: LevelSchema[] = [
  {
    name: "The Kitchen",
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
          console.log("aaaa")
        },
      },
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
          console.log("aaaa")
        },
      },
    ],
    obstacles: [],
  },
];
