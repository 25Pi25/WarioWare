import { Scene } from 'phaser';
import { MicrogameLength, WinState } from '../types';
import { delayF } from '../util';

export default class Microgame extends Scene {
  constructor(
    public name: string,
    public instruction: string,
    public length: MicrogameLength = "short",
    public startWinState: WinState | null = null
  ) {
    super(`Microgame:"${name}"`);
  }
  create() { }
  play() { }
}

export function microgame<T extends { new(...args: any[]): Microgame }>(constructor: T) {
  class NewMicrogame extends constructor {
    constructor(...args: any[]) {
      super(...args);
    }
    async create() {
      super.create();
      this.scene.pause();
      while (!this.scene.isPaused()) await delayF();
      while (this.scene.isPaused()) await delayF();
      super.play();
    }
  }
  return NewMicrogame;
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