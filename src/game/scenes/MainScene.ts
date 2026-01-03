import { Scene } from 'phaser';
import {
  CharacterFactory,
  ControlScheme,
  DanceFloor,
  InputManager,
  Player,
  PlayerController,
} from '../entities';
import { AssetLoader, EventBus } from '../core';
import { EMIT_EVENT } from '../constants';

export class MainScene extends Scene {
  private background: DanceFloor;
  private player: Player;
  private inputManager: InputManager;
  private playerController: PlayerController;

  constructor() {
    super('MainScene');
  }

  preload() {
    this.setupLoading();

    AssetLoader.preload(this, {
      environmentName: 'dance_floor',
      charactersNameList: ['nomadmechanic_man'],
    });
  }

  create() {
    this.background = new DanceFloor(this, 0, 0);

    this.player = CharacterFactory.create('nomadmechanic_man', this, 400, 800);

    const wallsLayer = this.background.getWallsLayer();

    if (wallsLayer) {
      this.physics.add.collider(this.player, wallsLayer);
    }

    this.inputManager = new InputManager(this, ControlScheme.ALL);

    this.playerController = new PlayerController(
      this.player,
      this.inputManager
    );

    EventBus.emit(EMIT_EVENT.CURRENT_SCENE_READY, this);
  }

  update() {
    this.playerController.update();
    this.player.updateDepth();
  }

  setupLoading() {
    this.load.on('progress', (value: number) => {
      console.log(`${Math.round(value * 100)}%`);
    });

    this.load.on('complete', () => {
      console.log('✅ Все ассеты загружены!');

      EventBus.emit(EMIT_EVENT.SCENE_VISIBLE);
    });
  }
}
