import { Game } from 'phaser';
import Gameplayer from './gameplayer.ts'
import './index.css'

export const WIDTH = 1920, HEIGHT = 1080, CENTER = Object.assign(
  (xFactor = 1, yFactor = 1): [number, number] => [CENTER.x * xFactor, CENTER.y * yFactor],
  { x: WIDTH / 2, y: HEIGHT / 2 }
)

export const game = new Game({
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  scale: { zoom: 0.6 },
  parent: document.getElementById("game")!,
  fps: { panicMax: 0 },
  scene: Gameplayer
})