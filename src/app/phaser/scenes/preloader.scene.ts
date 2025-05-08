import * as Phaser from 'phaser';

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloaderScene' });
  }

  preload() {
    // Crear barra de progreso de carga
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    
    // Texto de carga
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Cargando...',
      style: {
        font: '20px monospace',
        color: '#ffffff'
      }
    }).setOrigin(0.5, 0.5);
    
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        color: '#ffffff'
      }
    }).setOrigin(0.5, 0.5);
    
    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        color: '#ffffff'
      }
    }).setOrigin(0.5, 0.5);
    
    // Eventos de progreso de carga
    this.load.on('progress', (value: number) => {
      percentText.setText(parseInt(String(value * 100)) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });
    
    this.load.on('fileprogress', (file: any) => {
      assetText.setText('Cargando: ' + file.key);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      
      this.createAnimations();
      this.scene.start('MenuScene');
    });
    
    // Cargar assets
    this.loadAssets();
  }
  
  loadAssets() {
    // Imágenes
    this.load.image('background', 'assets/game/images/background.jpg');
    this.load.svg('ship', 'assets/game/images/ship.svg');
    this.load.svg('asteroid', 'assets/game/images/asteroid.svg');
    this.load.svg('laser', 'assets/game/images/laser.svg');
    this.load.svg('explosion', 'assets/game/images/explosion.svg');
    
    // Sonidos
    this.load.audio('laserSound', 'assets/game/sounds/retro-laser-1-236669.mp3');
    this.load.audio('explosionSound', 'assets/game/sounds/arcade-fx-288597.mp3');
    this.load.audio('bgMusic', 'assets/game/sounds/arcade-fx-288597.mp3'); // Usamos el mismo para música de fondo
  }
  
  createAnimations() {
    // No necesitamos animaciones de spritesheet ahora
    // Pero podemos crear una animación básica con tween
    this.anims.create({
      key: 'explode',
      frames: [
        { key: 'explosion' }
      ],
      frameRate: 10,
      repeat: 0
    });
  }
} 