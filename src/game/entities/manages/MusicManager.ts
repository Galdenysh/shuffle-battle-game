import logger from '@/lib/logger';
import { Sound } from 'phaser';
import type { Scene, Types } from 'phaser';

type PhaserAudio =
  | Sound.NoAudioSound
  | Sound.HTML5AudioSound
  | Sound.WebAudioSound;

export class MusicManager {
  private scene: Scene | null = null;
  private currentMusic: PhaserAudio | null = null;
  private reverbNode: ConvolverNode | null = null;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public playBackgroundMusic(
    key: string,
    volume: number = 0.5,
    loop: boolean = true
  ) {
    if (this.currentMusic && this.currentMusic.isPlaying) {
      this.fadeOutMusic(this.currentMusic, 1000, () => {
        this.playNewMusic(key, volume, loop);
      });
    } else {
      this.playNewMusic(key, volume, loop);
    }
  }

  public playBattleMusic(
    battleKey: string,
    volume: number = 0.5,
    loop: boolean = false
  ) {
    if (!this.scene || !this.currentMusic) return;

    const bgMusic = this.currentMusic;
    const bgVolume = bgMusic.volume;

    const battleMusic = this.scene.sound.add(battleKey, {
      volume,
      loop,
    });

    battleMusic.play();

    this.currentMusic = battleMusic;

    this.fadeOutMusic(bgMusic, 1000, () => {
      bgMusic.pause();
    });

    battleMusic.once('complete', () => {
      if (this.currentMusic === battleMusic && this.scene) {
        battleMusic.destroy();

        this.currentMusic = bgMusic;

        bgMusic.setVolume(0);
        bgMusic.resume();

        this.fadeInMusic(bgMusic, bgVolume, 1000);
      }
    });
  }

  public setupReverb(impulseKey: string) {
    if (!this.scene) return;

    if (this.scene.sound instanceof Sound.WebAudioSoundManager) {
      const context = this.scene.sound.context;
      const impulseBuffer = this.scene.cache.audio.get(impulseKey);

      this.reverbNode = context.createConvolver();

      if (impulseBuffer && impulseBuffer instanceof AudioBuffer) {
        this.reverbNode.buffer = impulseBuffer;
        this.reverbNode.connect(this.scene.sound.masterMuteNode);
      }
    }
  }

  public destroy() {
    if (this.scene) {
      this.scene.tweens.killTweensOf(this.currentMusic as object);
    }

    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic.destroy();
    }

    this.scene = null;
    this.currentMusic = null;
  }

  private playNewMusic(key: string, volume: number, loop: boolean) {
    if (!this.scene) return;

    const music = this.scene.sound.add(key, {
      volume: 0,
      loop: loop,
    });

    this.currentMusic = music;

    music.play();
    this.connectReverb(music);

    this.fadeInMusic(music, volume, 1000);
  }

  private fadeOutMusic(
    sound: PhaserAudio,
    duration: number,
    onComplete: Types.Tweens.TweenOnCompleteCallback
  ) {
    if (!this.scene) return;

    this.scene.tweens.add({
      targets: sound,
      volume: 0,
      duration: duration,
      onComplete: onComplete,
    });
  }

  private fadeInMusic(
    sound: PhaserAudio,
    targetVolume: number,
    duration: number
  ) {
    if (!this.scene) return;

    this.scene.tweens.add({
      targets: sound,
      volume: targetVolume,
      duration: duration,
    });
  }

  private connectReverb(sound: PhaserAudio) {
    if (this.reverbNode && sound instanceof Sound.WebAudioSound) {
      try {
        const volumeNode = sound.volumeNode;

        if (volumeNode) {
          volumeNode.disconnect();
          volumeNode.connect(this.reverbNode);
        }
      } catch (e) {
        logger.warn('Реверберация звука не подключена.', e);
      }
    }
  }
}
