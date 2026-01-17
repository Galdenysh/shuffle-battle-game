import { Scene } from 'phaser';
import {
  CharacterFactory,
  CollisionManager,
  ComboManager,
  ComboSystem,
  ComboScorePayload,
  ControlScheme,
  DanceFloor,
  GameManager,
  InputManager,
  MusicManager,
  HostAIManager,
  Player,
  PlayerController,
  TriggerZone,
} from '../entities';
import { AssetLoader, EventBus } from '../core';
import { EmitEvents } from '@/types/events';
import type { LevelCompleteActionEvent } from '@/types/events';
import { combos } from '../config';
import { Direction, GameCommand, GameState } from '@/types';
import { ASSET_KEYS } from '../constants';
import { DEFAULT_VALUES, STORAGE_KEYS } from '@/lib/constants';

export class MainScene extends Scene {
  private background: DanceFloor | null = null;
  private player: Player | null = null;
  private host: Player | null = null;
  private inputManager: InputManager | null = null;
  private comboManager: ComboManager | null = null;
  private gameManager: GameManager | null = null;
  private collisionManager: CollisionManager | null = null;
  private musicManager: MusicManager | null = null;
  private hostAIManager: HostAIManager | null = null;
  private playerController: PlayerController | null = null;
  private isRestartPending: boolean = false;

  private playerData: { playerName: string } = {
    playerName: DEFAULT_VALUES.PLAYER_NAME,
  };

  constructor() {
    super('MainScene');
  }

  init() {
    this.playerData.playerName = this.registry.get(STORAGE_KEYS.PLAYER_NAME);
    this.inputManager = new InputManager(this, ControlScheme.ALL);
    this.comboManager = new ComboManager(new ComboSystem(combos));
    this.gameManager = new GameManager(
      this,
      30,
      this.handleGameStateChange.bind(this)
    );
    this.musicManager = new MusicManager(this);
  }

  preload() {
    this.setupLoading();

    AssetLoader.preload(this, {
      environmentName: 'dance_floor',
      charactersNameList: ['shuffler_man', 'mc_man'],
    });
  }

  create() {
    EventBus.off(
      EmitEvents.LEVEL_COMPLETED_ACTION,
      this.handleLevelAction,
      this
    );

    EventBus.on(
      EmitEvents.LEVEL_COMPLETED_ACTION,
      this.handleLevelAction,
      this
    );

    if (
      !this.inputManager ||
      !this.comboManager ||
      !this.gameManager ||
      !this.musicManager
    ) {
      return;
    }

    this.background = new DanceFloor(this, 0, 0);
    this.player = CharacterFactory.create('shuffler_man', this, 360, 530);
    this.host = CharacterFactory.create('mc_man', this, 100, 530, {
      defaultDirection: Direction.SOUTH_EAST,
    });

    this.hostAIManager = new HostAIManager(this, this.host);

    this.musicManager.setupReverb(ASSET_KEYS.SFX_HALL_IMPULSE);
    this.musicManager.playBackgroundMusic(ASSET_KEYS.SOUND_BACKGROUND, 0.2);

    const wallsLayer = this.background.getWallsLayer();

    this.collisionManager = new CollisionManager(this);
    this.collisionManager.setup([this.player, this.host], wallsLayer);

    this.playerController = new PlayerController(
      this.player,
      this.inputManager,
      this.comboManager
    );

    this.comboManager.addComboListener(this.handleComboMatch, this);

    new TriggerZone(this, this.player, 360, 820, 50, 50, () => {
      this.gameManager?.start();
      this.musicManager?.playBattleMusic(ASSET_KEYS.SOUND_BATTLE, 0.15);
    });

    this.gameManager?.restart();
    this.cameras.main.fadeIn(200, 0, 0, 0);

    EventBus.emit(EmitEvents.CURRENT_SCENE_READY, { scene: this });

    this.cameras.main.once('camerafadeincomplete', () => {
      EventBus.emit(EmitEvents.SCENE_VISIBLE, { isVisible: true });
    });

    this.events.once('shutdown', this.cleanup, this);
    this.events.once('destroy', this.cleanup, this);
  }

  update() {
    if (this.isRestartPending) {
      this.isRestartPending = false;
      this.scene.restart();

      return;
    }

    if (this.gameManager?.isActive || this.gameManager?.isReady) {
      this.playerController?.update();
    } else {
      this.player?.stopMovement();
    }

    this.player?.updateDepth();
  }

  private setupLoading() {
    this.load.on('progress', (value: number) => {
      console.log(`${Math.round(value * 100)}%`);
    });

    this.load.on('complete', () => {
      console.log('✅ Все ассеты загружены!');
    });
  }

  private handleComboMatch({
    combo,
    points,
    comboChain,
  }: ComboScorePayload): void {
    if (!this.gameManager || !this.playerController) return;

    const { isActive } = this.gameManager;

    this.gameManager?.addScore(points, comboChain);
    this.playerController?.onComboAchieved(combo, isActive ? points : null);
  }

  private handleLevelAction({ action }: LevelCompleteActionEvent['payload']) {
    if (action === GameCommand.RESTART) {
      this.cameras.main.fadeOut(200, 0, 0, 0);

      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.isRestartPending = true;
      });
    }
  }

  private handleGameStateChange(state: GameState) {
    this.hostAIManager?.onGameStateChange(
      state,
      this.playerData.playerName,
      this.gameManager?.totalScore
    );
  }

  private cleanup() {
    this.inputManager?.destroy();
    this.comboManager?.destroy(); // ComboManager сам очистит обработчики
    this.gameManager?.destroy();
    this.collisionManager?.destroy();
    this.musicManager?.destroy();
    this.playerController?.destroy();
    this.hostAIManager?.destroy();

    this.background = null;
    this.player = null;
    this.inputManager = null;
    this.comboManager = null;
    this.gameManager = null;
    this.collisionManager = null;
    this.musicManager = null;
    this.playerController = null;
    this.hostAIManager = null;

    EventBus.off(
      EmitEvents.LEVEL_COMPLETED_ACTION,
      this.handleLevelAction,
      this
    );

    this.events.off('shutdown', this.cleanup, this);
    this.events.off('destroy', this.cleanup, this);
  }
}
