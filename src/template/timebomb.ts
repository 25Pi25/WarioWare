import { Scene } from 'phaser';
import { HEIGHT } from '../main';
import { delayF } from '../util';
import { MicrogameLength, WinState } from '../types';
import { loadAndPause } from './microgame';

@loadAndPause
export default class TimeBomb extends Scene {
  // If winState is not null, end the microgame early with the condition given
  private _winState: WinState | null = null;
  get winState() { return !this._winState || this.startWinState; }
  set winState(winning: boolean) { this._winState = winning ? "win" : "lose"; }
  skipGame = () => this.eject(false);
  beatsLeft: number;
  constructor(
    private speed: number,
    private length: MicrogameLength = "short",
    private startWinState = false
  ) {
    super({ key: "Microgame", active: true });
    this.beatsLeft = ({
      short: 8,
      medium: 12,
      long: 16,
      infinity: Infinity
    })[length];
  }

  preload() {
    this.load.setPath("src/template/assets")
    this.load.spritesheet("bomb", "bomb.png", { frameWidth: 615, frameHeight: 105 });
    this.load.image("explosion", "explosion.png");
    this.load.spritesheet("fuse", "fuse.png", { frameWidth: 50 });
    this.load.spritesheet("countdown", "countdown.png", { frameWidth: 64 });
    this.load.audio("3", "3.mp3");
    this.load.audio("2", "2.mp3");
    this.load.audio("1", "1.mp3");
    this.load.audio("explode", "explode.mp3");
  }

  private bomb!: Phaser.GameObjects.Sprite;
  private fuse!: Phaser.GameObjects.Sprite;
  private countdown!: Phaser.GameObjects.Sprite;
  private countSounds!: Phaser.Sound.BaseSound[];
  create() {
    const startShowing = this.length == 'short' ? 1 : 0;
    this.add.group().setDepth(Infinity)
      .add(this.bomb = this.add.sprite(0, HEIGHT, 'bomb').setScale(2).setOrigin(0, 1).setAlpha(startShowing))
      .add(this.fuse = this.add.sprite(1158, HEIGHT - 27, 'fuse').setScale(2).setOrigin(0, 1).setAlpha(startShowing))
      .add(this.countdown = this.add.sprite(75, HEIGHT - 220, 'countdown').setOrigin(0.5, 0.5).setAlpha(0));
    this.countSounds = ["3", "2", "1", "explode"].map(num => this.sound.add(num));
    this.anims.create({
      key: 'light',
      frames: this.anims.generateFrameNumbers('fuse', { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1
    })
    this.fuse.play('light');
  }

  update(_: number, delta: number) {
    this.beatsLeft -= 120 * delta * this.speed / 60_000;
    this.setBombFrame(Math.floor(9 - this.beatsLeft));
    if (this.beatsLeft <= 0.5) this.eject(true);
  }

  private bombFrame = -Infinity;
  private setBombFrame(frame: number) {
    // frame is the current count of the bomb
    // 0 is the start of the fuse, and 8 is the explosion
    if (this.bombFrame == 8 || frame == this.bombFrame || frame < 0 || frame > 8) return;
    this.bombFrame = frame;

    if (frame == 0) {
      this.bomb.setAlpha(1);
      this.fuse.setAlpha(1);
    }
    if (frame != 8) this.bomb.setFrame(frame);
    if (frame >= 5 && frame <= 7) this.setCountdown(8 - frame);
    switch (frame) {
      case 8:
        this.countSounds[3]!.play()
        this.fuse.destroy();
        this.countdown.destroy();
        this.bomb.setTexture("explosion").setOrigin(0.5, 0.5).setPosition(80, HEIGHT - 100).setScale(2);
        break;
      case 7:
        this.fuse.setPosition(122, HEIGHT - 140);
        break;
      default:
        this.fuse.setX(1158 - frame * 159.5);
    }
  }

  private async setCountdown(num: number) {
    if (num < 1 || num > 3) return;
    this.countdown.setScale(0).setFrame(3 - num).setAlpha(1);
    this.countSounds[num - 1]!.play();
    for (let i = 0; i <= 0.15; i += this.game.loop.delta / 1000) {
      this.countdown.setScale(i * 40 / 3);
      await delayF();
    }
  }

  private async eject(immediate: boolean) {
    // Immediate is to launch the bomb early if the microgame was finished before 8 beats
    if (!immediate && this.length != "infinity") {
      for (let i = Math.round(this.beatsLeft * 2) / 2; i > 0; i -= 0.5) {
        if (i % 4 != 0.5) continue;
        while (this.beatsLeft > i) await delayF();
        break;
      }
    }
    this.setBombFrame(8);
    this.events.emit("finishMicrogame", this.winState);
    this.scene.pause();
  }
}