import type { Scene, Time } from 'phaser';
import { EventBus } from '@/game/core';
import { GameState, EmitEvents } from '@/types';

export class GameManager {
  private scene: Scene | null = null;
  private currentState: GameState = GameState.INIT;
  private initialTime: number = 40;
  private timeLeft: number = 40;
  private gameTimer: Time.TimerEvent | null = null;
  private score: number = 0;

  private onGameStateChange?: (state: GameState) => void;
  private onTick?: (timeLeft: number) => void;

  constructor(
    scene: Scene,
    initialTime: number,
    onGameStateChange?: (state: GameState) => void,
    onTick?: (timeLeft: number) => void
  ) {
    this.scene = scene;
    this.initialTime = initialTime;
    this.timeLeft = initialTime;
    this.onGameStateChange = onGameStateChange;
    this.onTick = onTick;

    this.restart();
    this.bindSceneEvents();
  }

  public start(): void {
    if (!this.isReady) {
      console.warn(
        `⚠️ Игра не может быть начата из состояния: ${this.currentState}`
      );

      return;
    }

    this.setGameState(GameState.ACTIVE);
    this.startTimer();
  }

  public pause(): void {
    if (!this.isActive) return;

    this.setGameState(GameState.PAUSED);
    this.setPausedTimer(true);
  }

  public resume(): void {
    if (!this.isPaused) return;

    this.setGameState(GameState.ACTIVE);
    this.setPausedTimer(false);
  }

  public end(): void {
    this.setGameState(GameState.FINISHED);
    this.stopTimer();
  }

  public restart(): void {
    this.reset();
    this.setGameState(GameState.READY);
  }

  public addScore(points: number, comboChain: number): void {
    if (!this.isActive) return;

    this.score += points;

    EventBus.emit(EmitEvents.SCORE_CHANGED, {
      deltaScore: points,
      totalScore: this.score,
      comboChain,
    });
  }

  public destroy(): void {
    this.stopTimer();
    this.unbindSceneEvents();

    this.timeLeft = 0;
    this.scene = null;
  }

  public get isReady(): boolean {
    return this.currentState === GameState.READY;
  }

  public get isActive(): boolean {
    return this.currentState === GameState.ACTIVE;
  }

  public get isPaused(): boolean {
    return this.currentState === GameState.PAUSED;
  }

  public get isFinished(): boolean {
    return this.currentState === GameState.FINISHED;
  }

  private setGameState(state: GameState): void {
    const previousState = this.currentState;
    this.currentState = state;

    EventBus.emit(EmitEvents.GAME_STATE_CHANGED, {
      previous: previousState,
      current: state,
    });

    this.onGameStateChange?.(state);
  }

  private startTimer(): void {
    if (!this.scene) return;

    this.stopTimer();
    this.timeLeft = this.initialTime;

    this.gameTimer = this.scene.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  private stopTimer(): void {
    if (!this.gameTimer) return;

    this.gameTimer.destroy();
    this.gameTimer = null;
  }

  private updateTimer(): void {
    if (!this.isActive) return;

    const isWarning = this.timeLeft <= 10 && this.timeLeft > 5;
    const isCritical = this.timeLeft <= 5 && this.timeLeft > 0;
    const isTimeUp = this.timeLeft <= 0;

    this.timeLeft--;
    this.onTick?.(this.timeLeft);

    EventBus.emit(EmitEvents.TIME_CHANGED, {
      timeLeft: Math.max(0, this.timeLeft),
      isWarning: isWarning,
      isCritical: isCritical,
      isTimeUp: isTimeUp,
    });

    if (isTimeUp) this.end();
  }

  private setPausedTimer(paused: boolean) {
    if (this.gameTimer) {
      this.gameTimer.paused = paused;
    }
  }

  private reset(): void {
    this.timeLeft = this.initialTime;
    this.score = 0;

    this.stopTimer();

    EventBus.emit(EmitEvents.SCORE_CHANGED, {
      deltaScore: 0,
      totalScore: 0,
      comboChain: 1,
    });
  }

  private bindSceneEvents(): void {
    if (!this.scene) return;

    this.scene.events.once('shutdown', this.destroy, this);
    this.scene.events.once('destroy', this.destroy, this);
  }

  private unbindSceneEvents(): void {
    if (!this.scene) return;

    this.scene.events.off('shutdown', this.destroy, this);
    this.scene.events.off('destroy', this.destroy, this);
  }
}
