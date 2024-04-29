import { Enemy } from "../objects/enemy"
import { GameScene } from "../scene"

export type LevelSchema = {
  name: string,
  stages: StageSchema[]
  // TODO: implement obstacles
  obstacles: {}
}

export type StageSchema = {
  finishCondition: (scene: GameScene) => boolean
  onStart: (scene: GameScene) => void
  onFinish: (scene: GameScene) => void
}

export const Levels: LevelSchema[] = [
  {
    name: "The Kitchen",
    stages: [
      {
        finishCondition(scene) {
          return scene._objects.filter(obj => obj instanceof Enemy).length === 0
        },
        onStart(scene) {
          
        },
        onFinish(scene) {}
      }
    ],
    obstacles: {}
  }
]