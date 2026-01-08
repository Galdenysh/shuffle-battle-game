import { Scene, GameObjects, Math as PhaserMath } from 'phaser';
import { Player } from '../abstract';

export class TriggerZone extends GameObjects.Zone {
  private player: Player;
  private onEnter: () => void;
  private visualEffect: GameObjects.Graphics;

  constructor(
    scene: Scene,
    player: Player,
    x: number,
    y: number,
    width: number,
    height: number,
    onEnter: () => void
  ) {
    super(scene, x, y, width, height);

    this.player = player;
    this.onEnter = onEnter;

    this.visualEffect = scene.add.graphics();
    this.createVisuals(x, y, width / 2);

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setupOverlap();
  }

  private createVisuals(x: number, y: number, radius: number) {
    const color = 0x53eafd;

    this.visualEffect.fillStyle(color, 0.4);
    this.visualEffect.fillCircle(0, 0, radius * 4);

    this.visualEffect.lineStyle(4, color, 1);
    this.visualEffect.strokeCircle(0, 0, radius * 4);

    this.visualEffect.setPosition(x, y);

    this.scene.tweens.add({
      targets: this.visualEffect,
      alpha: { from: 0.3, to: 0.8 },
      scale: { from: 0.9, to: 1.1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private setupOverlap() {
    const overlap = this.scene.physics.add.overlap(this.player, this, () => {
      this.onEnter();

      this.scene.physics.world.removeCollider(overlap);
      this.visualEffect.destroy(); // Убираем визуализацию
      this.destroy();
    });
  }

  destroy(fromScene?: boolean) {
    this.visualEffect?.destroy();
    super.destroy(fromScene);
  }
}
