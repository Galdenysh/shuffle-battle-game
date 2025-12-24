import { Scene } from 'phaser';
import { CharacterFactory, Player } from '../entities';

interface IWASDKeys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
}

export class MainScene extends Scene {
  private background: Phaser.GameObjects.Sprite;
  private player: Player;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null;
  private keys: IWASDKeys | null;
  private playArea: { x: number; y: number; width: number; height: number };

  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.spritesheet(
      'background_anim',
      'assets/dance_floor_spritesheet_720x1280px_49f.png',
      { frameWidth: 720, frameHeight: 1280 }
    );

    this.load.atlas(
      'character_netrunner_woman',
      'assets/characters/netrunner_woman/texture.png',
      'assets/characters/netrunner_woman/texture.json'
    );
  }

  create() {
    this.anims.create({
      key: 'dance_floor_anim',
      frames: this.anims.generateFrameNumbers('background_anim', {
        start: 0,
        end: 48,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.background = this.add.sprite(0, 0, 'background_anim');

    const scaleX = this.cameras.main.width / this.background.width;
    const scaleY = this.cameras.main.height / this.background.height;
    const scale = Math.max(scaleX, scaleY);

    this.background.setScale(scale);

    this.background.setPosition(
      this.cameras.main.centerX,
      this.cameras.main.centerY
    );

    this.background.play('dance_floor_anim');

    // this.playArea = {
    //   x: 360,
    //   y: 830,
    //   width: 850,
    //   height: 850,
    // };

    // const graphics = this.add.graphics();

    // graphics.lineStyle(2, 0x00ff00, 0.5);

    // graphics.strokePoints([
    //   { x: this.playArea.x, y: this.playArea.y - this.playArea.height / 2 },
    //   { x: this.playArea.x + this.playArea.width / 2, y: this.playArea.y },
    //   { x: this.playArea.x, y: this.playArea.y + this.playArea.height / 2 },
    //   { x: this.playArea.x - this.playArea.width / 2, y: this.playArea.y },
    //   { x: this.playArea.x, y: this.playArea.y - this.playArea.height / 2 },
    // ]);

    this.player = CharacterFactory.create('netrunner', this, 400, 800);

    this.cursors = this.input.keyboard?.createCursorKeys() ?? null;

    this.keys =
      (this.input.keyboard?.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
      }) as IWASDKeys) ?? null;
  }

  update() {
    const player = this.player;
    const area = this.playArea;
    const cursors = this.cursors;
    const keys = this.keys;
    const speed = 200;

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;

    playerBody.setVelocity(0);

    let isMoving = false;

    // const dx = Math.abs(player.x - area.x) / (area.width / 2);
    // const dy = Math.abs(player.y - area.y) / (area.height / 2);

    // if (dx + dy > 1) {
    //   const angle = Math.atan2(player.y - area.y, player.x - area.x);
    //   const rx = (area.width / 2) * Math.cos(angle);
    //   const ry = (area.height / 2) * Math.sin(angle);

    //   player.x = area.x + rx * 0.95;
    //   player.y = area.y + ry * 0.95;

    //   playerBody.setVelocity(0);
    // }

    if (!cursors || !keys) return;

    // Диагональ: ВВЕРХ-ВПРАВО (СЕВЕРО-ВОСТОК)
    if (
      (cursors.up.isDown || keys.up.isDown) &&
      (cursors.right.isDown || keys.right.isDown)
    ) {
      playerBody.setVelocity(speed * 0.7, -speed * 0.7);
      player.play('walk_north_east', true);
      isMoving = true;
    }
    // Диагональ: ВВЕРХ-ВЛЕВО (СЕВЕРО-ЗАПАД)
    else if (
      (cursors.up.isDown || keys.up.isDown) &&
      (cursors.left.isDown || keys.left.isDown)
    ) {
      playerBody.setVelocity(-speed * 0.7, -speed * 0.7);
      player.play('walk_north_west', true);
      isMoving = true;
    }
    // Диагональ: ВНИЗ-ВПРАВО (ЮГО-ВОСТОК)
    else if (
      (cursors.down.isDown || keys.down.isDown) &&
      (cursors.right.isDown || keys.right.isDown)
    ) {
      playerBody.setVelocity(speed * 0.7, speed * 0.7);
      player.play('walk_south_east', true);
      isMoving = true;
    }
    // Диагональ: ВНИЗ-ВЛЕВО (ЮГО-ЗАПАД)
    else if (
      (cursors.down.isDown || keys.down.isDown) &&
      (cursors.left.isDown || keys.left.isDown)
    ) {
      playerBody.setVelocity(-speed * 0.7, speed * 0.7);
      player.play('walk_south_west', true);
      isMoving = true;
    }
    // ВЛЕВО (ЗАПАД)
    else if (cursors.left.isDown || keys.left.isDown) {
      playerBody.setVelocityX(-speed);
      player.play('walk_west', true);
      isMoving = true;
    }
    // ВПРАВО (ВОСТОК)
    else if (cursors.right.isDown || keys.right.isDown) {
      playerBody.setVelocityX(speed);
      player.play('walk_east', true);
      isMoving = true;
    }
    // ВВЕРХ (СЕВЕР)
    else if (cursors.up.isDown || keys.up.isDown) {
      playerBody.setVelocityY(-speed);
      player.play('walk_north', true);
      isMoving = true;
    }
    // ВНИЗ (ЮГ)
    else if (cursors.down.isDown || keys.down.isDown) {
      playerBody.setVelocityY(speed);
      player.play('walk_south', true);
      isMoving = true;
    }

    // Если игрок не двигается, останавливаем анимацию
    if (!isMoving) {
      player.anims.stop();
    }
  }

  private getPlayerName(): string {
    // Получаем имя из URL (упрощенный вариант)
    const urlParams = new URLSearchParams(window.location.search);

    return urlParams.get('player') || 'Игрок';
  }
}
