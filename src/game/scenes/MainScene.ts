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
  private background: DanceFloor;
  private player: Player;
  private inputManager: InputManager;
  private playerController: PlayerController;

  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('background', 'assets/environment/background.png');
    this.load.image('foreground', 'assets/environment/foreground.png');

    this.load.spritesheet(
      'background_anim',
      'assets/environment/spritesheet_720x1280px_24f.png',
      { frameWidth: 720, frameHeight: 1280 }
    );

    this.load.image('collision_tiles', 'assets/environment/tileset.png');

    this.load.tilemapTiledJSON(
      'collision_map',
      'assets/environment/tilemap.json'
    );

    this.load.atlas(
      'character_netrunner_woman',
      'assets/characters/netrunner_woman/texture.png',
      'assets/characters/netrunner_woman/texture.json'
    );

    this.load.atlas(
      'character_nomadmechanic_man',
      'assets/characters/nomadmechanic_man/texture.png',
      'assets/characters/nomadmechanic_man/texture.json'
    );
  }

  create() {
    this.background = new DanceFloor(this, 0, 0);

    this.player = CharacterFactory.create('nomadmechanic_man', this, 400, 800);

    const wallsLayer = this.background.getWallsLayer();

    if (wallsLayer) {
      this.physics.add.collider(this.player, wallsLayer);
    }

    this.inputManager = new InputManager(this, ControlScheme.BOTH);

    this.playerController = new PlayerController(
      this.player,
      this.inputManager
    );

    this.game.events.emit('scene-visible');
  }

  update() {
    this.playerController.update();
    this.player.updateDepth();
  }
}
