import { Scene } from 'phaser';
import {
  CharacterFactory,
  ControlScheme,
  DanceFloor,
  InputManager,
  Player,
  PlayerController,
} from '../entities';

export class MainScene extends Scene {
  private player: Player;
  private inputManager: InputManager;
  private playerController: PlayerController;

  constructor() {
    super({ key: 'MainScene', visible: false });
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
    new DanceFloor(this, 0, 0);

    this.player = CharacterFactory.create('netrunner', this, 400, 800);

    this.inputManager = new InputManager(this, ControlScheme.BOTH);

    this.playerController = new PlayerController(
      this.player,
      this.inputManager
    );

    this.game.events.emit('scene-visible');
  }

  update() {
    this.playerController.update();
  }
}
