import * as Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  private startButton!: Phaser.GameObjects.Text;
  private scoresButton!: Phaser.GameObjects.Text;
  private nameInput!: Phaser.GameObjects.DOMElement;
  private playerName: string = '';
  private inputElement!: HTMLInputElement;
  
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Fondo
    this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(800, 600);
    
    // Título del juego
    this.add.text(400, 100, 'SPACE SHOOTER', { 
      fontSize: '48px', 
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Decoración con nave
    const ship = this.add.image(400, 170, 'ship').setScale(1.5);
    
    // Animación de rotación para la nave
    this.tweens.add({
      targets: ship,
      angle: { from: -5, to: 5 },
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
    
    // Input para el nombre del jugador
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.style.width = '200px';
    this.inputElement.style.height = '30px';
    this.inputElement.style.fontSize = '18px';
    this.inputElement.style.padding = '5px';
    this.inputElement.placeholder = 'Tu nombre...';
    this.inputElement.id = 'player-name-input';
    
    this.nameInput = this.add.dom(400, 250, this.inputElement).setOrigin(0.5);
    
    // Botón de inicio
    this.startButton = this.add.text(400, 320, 'JUGAR', { 
      fontSize: '32px', 
      color: '#00ff00',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();
    
    // Botón de puntuaciones
    this.scoresButton = this.add.text(400, 400, 'PUNTUACIONES', { 
      fontSize: '32px', 
      color: '#ffff00',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();
    
    // Eventos de botones
    this.startButton.on('pointerdown', () => {
      // Acceder al valor directamente desde la variable de clase
      this.playerName = this.inputElement.value.trim();
      
      if (this.playerName !== '') {
        // Guardar el nombre del jugador y comenzar el juego
        localStorage.setItem('currentPlayer', this.playerName);
        this.scene.start('GameScene');
      } else {
       
        alert('Por favor, introduce tu nombre');
      }
    });
    
    this.scoresButton.on('pointerdown', () => {
      this.scene.start('ScoresScene');
    });
    
    // Instrucciones
    this.add.text(400, 500, 'Usa las flechas ← → para moverte y ESPACIO para disparar', {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Animación para los botones
    this.tweens.add({
      targets: [this.startButton, this.scoresButton],
      scale: { from: 1, to: 1.1 },
      duration: 700,
      yoyo: true,
      repeat: -1
    });
  }
} 