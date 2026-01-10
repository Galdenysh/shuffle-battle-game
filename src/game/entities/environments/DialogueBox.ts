import { GameObjects } from 'phaser';
import type { Scene, Time, Tweens } from 'phaser';
import { Player } from '../abstract';

interface DialogConfig {
  delayShow: number;
  delayHide: number;
  dialogDepth: number;
  dialogOffsetX: number;
  dialogOffsetY: number;
}

export class DialogueBox extends GameObjects.Container {
  private character: Player;
  private message: string;
  private characterName: string;
  private dialog: GameObjects.Container | null = null;

  private delayShow: number;
  private delayHide: number;
  private dialogDepth: number;
  private dialogOffsetX: number;
  private dialogOffsetY: number;

  private hideTimer?: Time.TimerEvent | null = null;
  private showTimer?: Time.TimerEvent | null = null;
  private activeTween?: Tweens.Tween | null = null;

  private static readonly DEFAULT_CONFIG: DialogConfig = {
    delayShow: 1000,
    delayHide: 10000,
    dialogDepth: 1000,
    dialogOffsetX: -50,
    dialogOffsetY: -200,
  };

  constructor(
    scene: Scene,
    character: Player,
    message: string,
    characterName: string,
    config?: Partial<DialogConfig>
  ) {
    super(scene);

    this.character = character;
    this.message = message;
    this.characterName = characterName;

    const finalConfig: DialogConfig = {
      ...DialogueBox.DEFAULT_CONFIG,
      ...config,
    };

    this.delayShow = finalConfig.delayShow;
    this.delayHide = finalConfig.delayHide;
    this.dialogDepth = finalConfig.dialogDepth;
    this.dialogOffsetX = finalConfig.dialogOffsetX;
    this.dialogOffsetY = finalConfig.dialogOffsetY;

    this.createDialog();
  }

  public destroyDialog() {
    this.showTimer?.remove();
    this.hideTimer?.remove();
    this.showTimer = null;
    this.hideTimer = null;

    if (this.activeTween) {
      this.activeTween.stop();
      this.activeTween = null;
    }

    if (this.dialog) {
      this.dialog.destroy();
      this.dialog = null;
    }

    this.destroy();
  }

  public closeDialog() {
    if (!this.dialog || !this.dialog.visible) {
      this.destroyDialog();

      return;
    }

    this.hideTimer?.remove();
    this.hideDialog();
  }

  private createDialog() {
    const characterX = this.character.x;
    const characterY = this.character.y;
    const padding = 20;

    const messageTextConfig = {
      fontFamily: 'JetBrains Mono',
      fontSize: '28px',
      letterSpacing: 2,
      color: '#FFFFFF',
      align: 'left',
      wordWrap: { width: 380 },
    };

    const nameTextConfig = {
      fontFamily: 'JetBrains Mono',
      fontSize: '28px',
      fontStyle: 'bold',
      letterSpacing: 2,
      color: '#00f3ff',
    };

    const tempMessageText = this.scene.add.text(
      0,
      0,
      this.message,
      messageTextConfig
    );

    const tempNameText = this.scene.add.text(
      0,
      0,
      this.characterName,
      nameTextConfig
    );

    const messageWidth = tempMessageText.width;
    const messageHeight = tempMessageText.height;
    const nameWidth = tempNameText.width;
    const nameHeight = tempNameText.height;

    tempMessageText.destroy();
    tempNameText.destroy();

    const dialogBg = this.scene.add.rectangle(
      characterX + this.dialogOffsetX,
      characterY + this.dialogOffsetY - messageHeight,
      messageWidth + padding * 2,
      messageHeight + nameHeight + padding,
      0x000000,
      0.8
    );

    dialogBg.setOrigin(0, 0);
    dialogBg.setStrokeStyle(2, 0xffffff);

    const bubbleWidth = nameWidth + 10;
    const bubbleHeight = nameHeight + 5;
    const bubbleOffset = 10;

    const nameBubble = this.scene.add.rectangle(
      dialogBg.x - bubbleOffset,
      dialogBg.y - bubbleOffset,
      bubbleWidth,
      bubbleHeight,
      0xc27aff
    );

    nameBubble.setOrigin(0, 0);
    nameBubble.setStrokeStyle(1, 0xffffff);

    const nameText = this.scene.add.text(
      nameBubble.x + 5,
      nameBubble.y + 2,
      this.characterName,
      nameTextConfig
    );

    nameText.setOrigin(0, 0);

    const dialogText = this.scene.add.text(
      dialogBg.x + padding,
      dialogBg.y + nameHeight + 5,
      this.message,
      messageTextConfig
    );

    dialogText.setOrigin(0, 0);

    this.dialog = this.scene.add.container(0, 0, [
      dialogBg,
      dialogText,
      nameBubble,
      nameText,
    ]);

    this.dialog.setDepth(this.dialogDepth);
    this.dialog.setVisible(false);

    this.showTimer = this.scene.time.delayedCall(this.delayShow, () => {
      this.showDialog();

      this.hideTimer = this.scene.time.delayedCall(this.delayHide, () => {
        this.hideDialog();
      });
    });
  }

  private showDialog() {
    if (!this.dialog) return;

    this.dialog.setVisible(true);
    this.dialog.setAlpha(0);

    this.activeTween = this.scene.tweens.add({
      targets: this.dialog,
      alpha: 1,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        this.activeTween = undefined;
      },
    });
  }

  private hideDialog() {
    if (!this.dialog) return;

    this.activeTween?.stop();

    this.activeTween = this.scene.tweens.add({
      targets: this.dialog,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        this.activeTween = undefined;
        this.destroyDialog();
      },
    });
  }
}
