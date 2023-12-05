import { Scene } from 'phaser';
import { MicrogameLength, WinState } from '../types';

export default class Microgame extends Scene {
  constructor(
    public speed: number,
    public level: 1 | 2 | 3,
    public name: string,
    public instruction: string,
    public length: MicrogameLength = "short",
    public startWinState: WinState | null = null
  ) {
    super(`Microgame:"${name}"`);
    // TODO: change timeScale physics
  }
  create() { }
  update(_: number, __: number) { }
  play() { }

  // Time-scaled delays
  delay = async (ms: number) => new Promise(callback => {
    this.time.addEvent({
      delay: ms,
      timeScale: this.speed,
      callback,
      callbackScope: this,
    });
  });

  delayF = async (frames = 1) => new Promise<void>(resolve => {
    function checkFrames() {
      if (!--frames) resolve();
      else requestAnimationFrame(checkFrames);
    }
    requestAnimationFrame(checkFrames);
  });
}

export function microgame<T extends { new(...args: any[]): Microgame }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
    }
    async create() {
      super.create();
      this.scene.pause();
      this.events.once("resume", () => this.play());
    }
    update(total: number, delta: number) {
      super.update(total * this.speed, delta * this.speed)
    }
  }
}

export function loadAndPause<T extends { new(...args: any[]): Scene & { create(): void } }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
    }
    async create() {
      super.create();
      this.scene.pause();
    }
  };
}