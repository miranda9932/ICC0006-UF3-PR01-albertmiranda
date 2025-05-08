import * as Phaser from 'phaser';

export class ScoresScene extends Phaser.Scene {
  private backButton!: Phaser.GameObjects.Text;
  private scores: Array<{name: string, score: number, date: string}> = [];
  
  constructor() {
    super({ key: 'ScoresScene' });
  }

  create() {
    // Fondo
    this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(800, 600);
    
    // Título
    this.add.text(400, 50, 'MEJORES PUNTUACIONES', { 
      fontSize: '40px', 
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Cargar puntuaciones
    this.loadScores();
    
    // Mostrar puntuaciones
    this.displayScores();
    
    // Botón de regreso
    this.backButton = this.add.text(400, 520, 'VOLVER AL MENÚ', { 
      fontSize: '30px', 
      color: '#ffff00',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();
    
    this.backButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
  
  loadScores() {
    const storedScores = localStorage.getItem('scores');
    if (storedScores) {
      this.scores = JSON.parse(storedScores);
      // Asegurar que estén ordenados de mayor a menor
      this.scores.sort((a, b) => b.score - a.score);
      // Limitar a 10 mejores puntuaciones
      this.scores = this.scores.slice(0, 10);
    }
  }
  
  displayScores() {
    if (this.scores.length === 0) {
      this.add.text(400, 300, 'Aún no hay puntuaciones registradas', { 
        fontSize: '24px', 
        color: '#ffffff'
      }).setOrigin(0.5);
      return;
    }
    
    // Títulos de columnas
    this.add.text(150, 120, 'JUGADOR', { 
      fontSize: '24px', 
      color: '#00ffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.add.text(400, 120, 'PUNTUACIÓN', { 
      fontSize: '24px', 
      color: '#00ffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.add.text(650, 120, 'FECHA', { 
      fontSize: '24px', 
      color: '#00ffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Línea separadora
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.lineBetween(50, 150, 750, 150);
    
    // Mostrar cada puntuación
    this.scores.forEach((score, index) => {
      const y = 180 + index * 30;
      
      // Posición/rango
      this.add.text(30, y, `${index + 1}.`, { 
        fontSize: '20px', 
        color: '#ffffff'
      });
      
      // Nombre del jugador
      this.add.text(150, y, score.name, { 
        fontSize: '20px', 
        color: '#ffffff'
      }).setOrigin(0.5);
      
      // Puntuación
      this.add.text(400, y, score.score.toString(), { 
        fontSize: '20px', 
        color: '#ffffff'
      }).setOrigin(0.5);
      
      // Fecha formateada
      const date = new Date(score.date);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      
      this.add.text(650, y, formattedDate, { 
        fontSize: '20px', 
        color: '#ffffff'
      }).setOrigin(0.5);
    });
  }
} 