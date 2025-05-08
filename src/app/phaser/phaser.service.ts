import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { PreloaderScene } from './scenes/preloader.scene';
import { MenuScene } from './scenes/menu.scene';
import { GameScene } from './scenes/game.scene';
import { ScoresScene } from './scenes/scores.scene';

// Esta configuración ayuda a Angular a optimizar la importación de Phaser
declare global {
  interface Window {
    Phaser: typeof Phaser;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PhaserService {
  phaserGame: Phaser.Game | null = null;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      dom: {
        createContainer: true
      },
      scene: [
        PreloaderScene,
        MenuScene,
        GameScene,
        ScoresScene
      ]
    };
  }

  createGame(): Phaser.Game {
    if (!this.phaserGame) {
      this.phaserGame = new Phaser.Game(this.config);
    }
    return this.phaserGame;
  }

  destroyGame() {
    if (this.phaserGame) {
      this.phaserGame.destroy(true);
      this.phaserGame = null;
    }
  }
} 