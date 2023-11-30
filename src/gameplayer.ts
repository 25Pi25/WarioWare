import { Scene } from 'phaser';
import main from './minigames/Flip The Chimp/main';
import TimeBomb from './template/timebomb';
import { CENTER } from './main';
import { delay, delayF } from './util';

export default class extends Scene {
  create() {
    const text = this.createText();
    this.animateText(text)
    const bombscene = this.scene.add("Bomb", TimeBomb, true)
    const mainscene = this.scene.add("main", main, true)
    setTimeout(() => {
      bombscene!.scene.resume()
      mainscene!.scene.resume()
    }, 2000);
  }

  createText(): Phaser.GameObjects.Text {
    const text = this.add.text(...CENTER(), "KYS!", {
      fontFamily: "WarioWare Original",
      fontSize: 100,
    }).setOrigin(0.5).setAlpha(0);
    const gradient = text.context.createLinearGradient(0, 0, 0, text.height);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.6, '#ffffff');
    gradient.addColorStop(1, '#111111');
    text.setFill(gradient);
    return text;
  }

  async animateText(text: Phaser.GameObjects.Text) {
    await delay(1000);
    text.setAlpha(1);
    for (let delta = 0; delta < 0.2; delta += this.game.loop.delta / 1000) {
      // 25(x-0.2)^2+1
      text.setScale(25 * (delta - 0.2) ** 2 + 1);
      await delayF();
    }
    text.setScale(1);
    await delay(1000);
    for (let delta = 0; delta < 0.2; delta += this.game.loop.delta / 1000) {
      text.setAlpha(1 - delta / 0.2);
      await delayF();
    }
    text.setAlpha(0);
  }
}