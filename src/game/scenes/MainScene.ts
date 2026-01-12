import { Scene } from 'phaser';
import {
  CharacterFactory,
  CollisionManager,
  ComboManager,
  ComboSystem,
  ControlScheme,
  DanceFloor,
  DialogueBox,
  GameManager,
  InputManager,
  Player,
  PlayerController,
  TriggerZone,
} from '../entities';
import type { ComboScorePayload } from '../entities';
import { AssetLoader, EventBus } from '../core';
import { EmitEvents } from '@/types/events';
import type {
  LevelCompleteActionEvent,
  PlayerDataInitEvent,
} from '@/types/events';
import { combos } from '../config';
import { Direction, GameCommand } from '@/types';

export class MainScene extends Scene {
  private background: DanceFloor | null = null;
  private player: Player | null = null;
  private host: Player | null = null;
  private inputManager: InputManager | null = null;
  private comboManager: ComboManager | null = null;
  private gameManager: GameManager | null = null;
  private collisionManager: CollisionManager | null = null;
  private playerController: PlayerController | null = null;
  private dialogueBox: DialogueBox | null = null;
  private isRestartPending: boolean = false;

  private comboScoreListener: (payload: ComboScorePayload) => void;

  private playerDataListener: ({
    playerName,
  }: PlayerDataInitEvent['payload']) => void;

  private playerDataResolve: (value: string) => void;
  private playerDataPromise: Promise<string>;

  private levelActionListener: (
    payload: LevelCompleteActionEvent['payload']
  ) => void;

  constructor() {
    super('MainScene');

    this.playerDataPromise = new Promise((resolve) => {
      this.playerDataResolve = resolve;
    });

    this.comboScoreListener = this.handleComboMatch.bind(this);
    this.playerDataListener = this.handleSetPlayerData.bind(this);
    this.levelActionListener = this.handleLevelAction.bind(this);
  }

  init() {
    this.inputManager = new InputManager(this, ControlScheme.ALL);
    this.comboManager = new ComboManager(new ComboSystem(combos));
    this.gameManager = new GameManager(this, 40);

    EventBus.on(EmitEvents.PLAYER_DATA_INIT, this.playerDataListener);
    EventBus.on(EmitEvents.LEVEL_COMPLETED_ACTION, this.levelActionListener);
  }

  preload() {
    this.setupLoading();

    AssetLoader.preload(this, {
      environmentName: 'dance_floor',
      charactersNameList: ['shuffler_man', 'mc_man'],
    });
  }

  create() {
    if (!this.inputManager || !this.comboManager || !this.gameManager) {
      return;
    }

    this.background = new DanceFloor(this, 0, 0);
    this.player = CharacterFactory.create('shuffler_man', this, 360, 530);
    this.host = CharacterFactory.create('mc_man', this, 100, 530, {
      defaultDirection: Direction.SOUTH_EAST,
    });

    const wallsLayer = this.background.getWallsLayer();

    this.collisionManager = new CollisionManager(this);
    this.collisionManager.setup([this.player, this.host], wallsLayer);

    this.playerController = new PlayerController(
      this.player,
      this.inputManager,
      this.comboManager
    );

    this.comboManager.addComboListener(this.comboScoreListener);

    this.createHostDialog();

    new TriggerZone(this, this.player, 360, 820, 50, 50, () => {
      this.gameManager?.start();
      this.dialogueBox?.closeDialog();
    });

    EventBus.emit(EmitEvents.CURRENT_SCENE_READY, { scene: this });

    this.events.once('shutdown', this.cleanup, this);
    this.events.once('destroy', this.cleanup, this);
  }

  update() {
    if (this.isRestartPending) {
      this.isRestartPending = false;
      this.scene.restart();

      return;
    }

    this.playerController?.update();
    this.player?.updateDepth();
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

  private handleSetPlayerData({ playerName }: PlayerDataInitEvent['payload']) {
    if (this.playerDataResolve) {
      this.playerDataResolve(playerName);
    }
  }

  private handleLevelAction({ action }: LevelCompleteActionEvent['payload']) {
    if (action === GameCommand.RESTART) {
      if (action === GameCommand.RESTART) {
        this.isRestartPending = true;
      }
    }
  }

  private async createHostDialog() {
    if (!this.host) return;

    const playerName = await this.playerDataPromise;

    const message = `Эй, ${
      playerName ?? 'танцор'
    }! Жду в центре танцпола для старта! Или пока разминайся здесь.`;

    this.dialogueBox = new DialogueBox(this, this.host, message, 'MC');
  }

  private cleanup() {
    this.inputManager?.destroy();
    this.comboManager?.destroy(); // ComboManager сам очистит обработчики
    this.gameManager?.destroy();
    this.collisionManager?.destroy();
    this.playerController?.destroy();
    this.dialogueBox?.destroyDialog();

    this.background = null;
    this.player = null;
    this.inputManager = null;
    this.comboManager = null;
    this.gameManager = null;
    this.collisionManager = null;
    this.playerController = null;
    this.dialogueBox = null;

    EventBus.off(EmitEvents.PLAYER_DATA_INIT, this.playerDataListener);
    EventBus.off(EmitEvents.LEVEL_COMPLETED_ACTION, this.levelActionListener);

    this.events.off('shutdown', this.cleanup, this);
    this.events.off('destroy', this.cleanup, this);
  }
}
