import { Scene } from 'phaser';

export class MainScene extends Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // Загрузка ассетов
    // this.load.image('player', '/assets/player.png');
    // this.load.image('arrow', '/assets/arrow.png');
    // this.load.audio('music', '/assets/music/game.mp3');
  }

  create() {
    // Создаем игрока
    const player = this.add.sprite(200, 600, 'player');
    player.setScale(0.5);

    // Текст с именем игрока
    this.add.text(20, 20, 'SHUFFLE BATTLE', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
    });

    // Временный текст (замените на вашу игровую логику)
    this.add
      .text(100, 300, 'ИГРОВАЯ СЦЕНА', {
        fontSize: '32px',
        color: '#FFEB3B',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    this.add
      .text(100, 350, `Игрок: ${this.getPlayerName()}`, {
        fontSize: '20px',
        color: '#4CAF50',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);
  }

  update() {
    // Игровая логика
  }

  private getPlayerName(): string {
    // Получаем имя из URL (упрощенный вариант)
    const urlParams = new URLSearchParams(window.location.search);

    return urlParams.get('player') || 'Игрок';
  }
}
