import Microgame, { microgame } from '../../template/microgame';


@microgame
export default class extends Microgame {
  constructor(speed: number, level: 1 | 2 | 3) {
    super(speed, level, "Flip the Chimp", "Flip it!");
  }
  preload() {
    this.load.setBaseURL("src/minigames/Flip The Chimp");
    this.load.audio("challenge", "./challenge.mp3");
  }
  create() {
    this.add.rectangle(400, 500, 100, 100, 0x00FF00);
  }
  play() {
    this.sound.add("challenge").setRate(this.speed).play();
  }
}