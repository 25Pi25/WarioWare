import Microgame, { microgame } from '../../template/microgame';


@microgame
export default class extends Microgame {
  constructor() {
    super("Flip the Chimp", "Flip it!");
  }
  create() {
    this.add.rectangle(400, 500, 100, 100, 0x00FF00)
  }

  play() {
    console.log("playing now!")
  }
}