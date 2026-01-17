import type { Scene } from 'phaser';
import { Player } from '../abstract';
import { DialogueBox } from '../environments';
import { GameState } from '@/types';
import {
  END_GAME_MESSAGES,
  READY_GAME_MESSAGES,
  START_GAME_MESSAGES,
} from '@/game/dialogues';

export class HostAIManager {
  private currentDialog: DialogueBox | null = null;
  private scene: Scene | null = null;
  private host: Player | null = null;

  constructor(scene: Scene, host: Player) {
    this.scene = scene;
    this.host = host;
  }

  public onGameStateChange(
    state: GameState,
    playerName: string,
    score?: number
  ) {
    if (!this.scene || !this.host) return;

    this.forceDestroy();

    const message = this.getMessage(state, playerName, score);

    if (message) {
      this.currentDialog = new DialogueBox(
        this.scene,
        this.host,
        message,
        'MC',
        {
          delayShow: state === GameState.READY ? 1000 : 100,
          delayHide: state === GameState.ACTIVE ? 5000 : 10000,
        }
      );
    }
  }

  public cleanup() {
    this.currentDialog?.closeDialog();

    this.currentDialog = null;
  }

  public destroy() {
    this.forceDestroy();

    this.scene = null;
    this.host = null;
  }

  private getMessage(
    state: GameState,
    playerName: string,
    score?: number
  ): string | null {
    switch (state) {
      case GameState.READY:
        return this.getReadyMessage(playerName);
      case GameState.ACTIVE:
        return this.getStartMessage();
      case GameState.FINISHED:
        return this.getEndMessage(score);
      default:
        return null;
    }
  }

  private getReadyMessage(playerName: string): string {
    const randomGreetingFn = this.pick(READY_GAME_MESSAGES);

    const message = randomGreetingFn(playerName);

    return message;
  }

  private getStartMessage(): string {
    return this.pick(START_GAME_MESSAGES);
  }

  private getEndMessage(score?: number): string {
    const messages = END_GAME_MESSAGES;

    if (score === undefined) return this.pick(messages.timeout);
    if (score >= 3000) return this.pick(messages.god);
    if (score >= 2000) return this.pick(messages.power);
    if (score >= 1000) return this.pick(messages.good);

    return this.pick(messages.tryAgain);
  }

  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private forceDestroy() {
    this.currentDialog?.destroyDialog();

    this.currentDialog = null;
  }
}
