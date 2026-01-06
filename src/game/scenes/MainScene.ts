import { Scene } from 'phaser';
import {
  CharacterFactory,
  ComboManager,
  ComboSystem,
  ControlScheme,
  DanceFloor,
  InputManager,
  Player,
  PlayerController,
} from '../entities';
import { AssetLoader, EventBus } from '../core';
import { EmitEvents } from '@/types/events';
import { combos } from '../config';

export class MainScene extends Scene {
  private background: DanceFloor;
  private player: Player;
  private inputManager: InputManager;
  private comboManager: ComboManager;
  private playerController: PlayerController;

  constructor() {
    super('MainScene');
  }

  init() {
    const comboSystem = new ComboSystem(combos);

    this.inputManager = new InputManager(this, ControlScheme.ALL);
    this.comboManager = new ComboManager(comboSystem);
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

    this.playerController = new PlayerController(
      this.player,
      this.inputManager,
      this.comboManager
    );

    EventBus.emit(EmitEvents.CURRENT_SCENE_READY, { scene: this });
  }

  update() {
    this.playerController.update();
    this.player.updateDepth();
  }

  shutdown() {
    if (this.inputManager) {
      this.inputManager.destroy();
    }
  }

  setupLoading() {
    this.load.on('progress', (value: number) => {
      console.log(`${Math.round(value * 100)}%`);
    });

    this.load.on('complete', () => {
      console.log('✅ Все ассеты загружены!');

      EventBus.emit(EmitEvents.SCENE_VISIBLE, { isVisible: true });
    });
  }
}
