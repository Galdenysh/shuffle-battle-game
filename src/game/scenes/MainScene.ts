import { Scene } from 'phaser';
import {
  CharacterFactory,
  ComboManager,
  ComboSystem,
  ControlScheme,
  DanceFloor,
  GameManager,
  InputManager,
  Player,
  PlayerController,
} from '../entities';
import type { ComboScorePayload } from '../entities';
import { AssetLoader, EventBus } from '../core';
import { EmitEvents } from '@/types/events';
import { combos } from '../config';

export class MainScene extends Scene {
  private background: DanceFloor;
  private player: Player;
  private inputManager: InputManager;
  private comboManager: ComboManager;
  private gameManager: GameManager;
  private playerController: PlayerController;

  private scoreListener: (payload: ComboScorePayload) => void;

  constructor() {
    super('MainScene');

    this.scoreListener = this.onComboAchieved.bind(this);
  }

  init() {
    const comboSystem = new ComboSystem(combos);

    this.inputManager = new InputManager(this, ControlScheme.ALL);
    this.comboManager = new ComboManager(comboSystem);
    this.gameManager = new GameManager(this, 40);
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

    this.comboManager.addComboListener(this.scoreListener);

    this.gameManager.start();

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

    this.comboManager.removeComboListener(this.scoreListener);

    // TODO: Сделать отписку this.events.once('shutdown', this.shutdown, this);
  }

  private setupLoading() {
    this.load.on('progress', (value: number) => {
      console.log(`${Math.round(value * 100)}%`);
    });

    this.load.on('complete', () => {
      console.log('✅ Все ассеты загружены!');

      EventBus.emit(EmitEvents.SCENE_VISIBLE, { isVisible: true });
    });
  }

  private onComboAchieved({ points, comboChain }: ComboScorePayload): void {
    this.gameManager.addScore(points, comboChain);

    // TODO: Перенести анимацию из PlayerController
  }
}
