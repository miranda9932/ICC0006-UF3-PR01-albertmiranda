import * as Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private ship!: Phaser.Physics.Arcade.Sprite;
  private asteroids!: Phaser.Physics.Arcade.Group;
  private lasers!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private fireKey!: Phaser.Input.Keyboard.Key;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private gameOver: boolean = false;
  private pauseButton!: Phaser.GameObjects.Text;
  private isPaused: boolean = false;
  private pauseText!: Phaser.GameObjects.Text;
  private restartButton!: Phaser.GameObjects.Text;
  private gameOverText!: Phaser.GameObjects.Text;
  private finalScoreText!: Phaser.GameObjects.Text;
  private backToMenuButton!: Phaser.GameObjects.Text;
  private asteroidSpawnTimer!: Phaser.Time.TimerEvent;
  private backgroundMusic!: Phaser.Sound.BaseSound;
  private laserSound!: Phaser.Sound.BaseSound;
  private explosionSound!: Phaser.Sound.BaseSound;
  private audioCtx: AudioContext | null = null;
  
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Fondo
    this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(800, 600);
    
    // Contexto de audio
    this.audioCtx = this.game.registry.get('audioCtx') || null;
    
    // Configurar sonidos simulados
    this.setupSounds();
    
    // Configuración de física
    this.physics.world.setBounds(0, 0, 800, 600);
    
    // Nave del jugador
    this.ship = this.physics.add.sprite(400, 550, 'ship');
    this.ship.setCollideWorldBounds(true);
    this.ship.setSize(40, 40);
    
    // Grupo de láseres
    this.lasers = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 20,
      runChildUpdate: true
    });
    
    // Grupo de asteroides
    this.asteroids = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      runChildUpdate: true
    });
    
    // Iniciar el temporizador de generación de asteroides
    this.startAsteroidSpawner();
    
    // Controles
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.fireKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // Colisiones
    this.physics.add.collider(
      this.lasers,
      this.asteroids,
      this.hitAsteroid as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    
    this.physics.add.collider(
      this.ship,
      this.asteroids,
      this.hitShip as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    
    // Puntuación
    this.scoreText = this.add.text(16, 16, 'Puntuación: 0', { 
      fontSize: '24px', 
      color: '#ffffff' 
    });
    
    // Botón de pausa
    this.pauseButton = this.add.text(700, 16, 'PAUSA', { 
      fontSize: '20px', 
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setInteractive();
    
    this.pauseButton.on('pointerdown', () => {
      this.togglePause();
    });
    
    // Texto de pausa (inicialmente invisible)
    this.pauseText = this.add.text(400, 300, 'JUEGO PAUSADO', { 
      fontSize: '40px', 
      color: '#ffffff',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setVisible(false);
    
    // Botón de reinicio (inicialmente invisible)
    this.restartButton = this.add.text(400, 380, 'REINICIAR', { 
      fontSize: '30px', 
      color: '#00ff00',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive().setVisible(false);
    
    this.restartButton.on('pointerdown', () => {
      this.restart();
    });
    
    // Textos de Game Over (inicialmente invisibles)
    this.gameOverText = this.add.text(400, 200, 'GAME OVER', { 
      fontSize: '64px', 
      color: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setVisible(false);
    
    this.finalScoreText = this.add.text(400, 280, '', { 
      fontSize: '32px', 
      color: '#ffffff'
    }).setOrigin(0.5).setVisible(false);
    
    this.backToMenuButton = this.add.text(400, 450, 'MENÚ PRINCIPAL', { 
      fontSize: '30px', 
      color: '#ffff00',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive().setVisible(false);
    
    this.backToMenuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
  
  setupSounds() {
    // Crear objetos de sonido vacíos
    this.backgroundMusic = {
      play: () => {},
      stop: () => {}
    } as any;
    
    this.laserSound = {
      play: () => {
        this.generateLaserSound();
      }
    } as any;
    
    this.explosionSound = {
      play: () => {
        this.generateExplosionSound();
      }
    } as any;
  }
  
  generateLaserSound() {
    if (!this.audioCtx) return;
    
    const duration = 0.2;
    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(880, this.audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, this.audioCtx.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(this.audioCtx.currentTime + duration);
  }
  
  generateExplosionSound() {
    if (!this.audioCtx) return;
    
    const duration = 0.5;
    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(100, this.audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(10, this.audioCtx.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(this.audioCtx.currentTime + duration);
  }
  
  override update() {
    if (this.gameOver || this.isPaused) return;
    
    // Movimiento horizontal de la nave
    if (this.cursors.left.isDown) {
      this.ship.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
      this.ship.setVelocityX(300);
    } else {
      this.ship.setVelocityX(0);
    }
    
    // Disparar
    if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
      this.fireLaser();
    }
    
    // Comprobar láseres fuera de pantalla
    this.lasers.getChildren().forEach((laser: any) => {
      if (laser.y < -50) {
        laser.setActive(false);
        laser.setVisible(false);
        laser.disableBody(true, true);
      }
    });
    
    // Comprobar asteroides fuera de pantalla
    this.asteroids.getChildren().forEach((asteroid: any) => {
      if (asteroid.y > 650) {
        asteroid.setActive(false);
        asteroid.setVisible(false);
        asteroid.disableBody(true, true);
      }
    });
  }
  
  startAsteroidSpawner() {
    this.asteroidSpawnTimer = this.time.addEvent({
      delay: 1000,
      callback: this.spawnAsteroid,
      callbackScope: this,
      loop: true
    });
  }
  
  spawnAsteroid() {
    if (this.gameOver || this.isPaused) return;
    
    // Crear un asteroide en una posición aleatoria en la parte superior
    const x = Phaser.Math.Between(50, 750);
    const asteroid = this.asteroids.create(x, 0, 'asteroid');
    
    // Configurar física y escala
    asteroid.setScale(1);
    asteroid.setVelocityY(Phaser.Math.Between(100, 200));
    asteroid.setAngularVelocity(Phaser.Math.Between(-30, 30));
    asteroid.setCircle(20, 4, 4); // Usar un círculo fijo
    
    // Eliminar el asteroide cuando sale de la pantalla
    asteroid.setDataEnabled();
    asteroid.data.set('active', true);
    
    // Aumentar la velocidad según la puntuación
    const speedMultiplier = 1 + (this.score / 100);
    asteroid.setVelocityY(asteroid.body.velocity.y * speedMultiplier);
  }
  
  fireLaser() {
    // Limpiar láseres inactivos antes de crear uno nuevo
    this.lasers.getChildren().forEach((laser: any) => {
      if (!laser.active) {
        this.lasers.remove(laser, true, true);
      }
    });
    
    // Posicionar el láser con más separación de la nave
    const laserY = this.ship.y - 30; // Mayor distancia
    const laser = this.lasers.get(this.ship.x, laserY);
    
    if (laser) {
      laser.setTexture('laser');
      laser.setActive(true);
      laser.setVisible(true);
      laser.setVelocityY(-500); // Velocidad más alta
      
      // Asegurar que no hay física entre la nave y el láser
      laser.body.allowGravity = false;
      laser.body.immovable = true;
      
      this.laserSound.play();
      
      // Destruir el láser después de 2 segundos por seguridad
      this.time.delayedCall(2000, () => {
        if (laser.active) {
          laser.setActive(false);
          laser.setVisible(false);
          laser.disableBody(true, true);
        }
      });
    } else {
      // Si no hay láser disponible, forzar la reutilización del más antiguo
      const oldestLaser = this.lasers.getFirstAlive();
      if (oldestLaser) {
        oldestLaser.setPosition(this.ship.x, laserY);
        oldestLaser.setActive(true);
        oldestLaser.setVisible(true);
        oldestLaser.setVelocityY(-500); // Velocidad más alta
        oldestLaser.body.allowGravity = false;
        oldestLaser.body.immovable = true;
        this.laserSound.play();
      }
    }
  }
  
  hitAsteroid(laser: any, asteroid: any) {
    laser.setActive(false);
    laser.setVisible(false);
    laser.disableBody(true, true);
    
    asteroid.setActive(false);
    asteroid.setVisible(false);
    asteroid.disableBody(true, true);
    
    // Efectos de explosión
    this.createExplosion(asteroid.x, asteroid.y);
    this.explosionSound.play();
    
    // Actualizar puntuación
    this.score += 1;
    this.scoreText.setText('Puntuación: ' + this.score);
  }
  
  hitShip(ship: any, asteroid: any) {
    asteroid.setActive(false);
    asteroid.setVisible(false);
    asteroid.disableBody(true, true);
    
    // Crear explosión en la nave
    this.createExplosion(ship.x, ship.y);
    this.explosionSound.play();
    
    // Desactivar la nave
    ship.setVisible(false);
    ship.disableBody(true, true);
    
    // Game over
    this.endGame();
  }
  
  createExplosion(x: number, y: number) {
    const explosion = this.add.sprite(x, y, 'explosion');
    explosion.setScale(1);
    
    // Crear animación con tweens
    this.tweens.add({
      targets: explosion,
      scale: 2,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        explosion.destroy();
      }
    });
  }
  
  endGame() {
    this.gameOver = true;
    this.asteroidSpawnTimer.remove();
    
    // Detener todos los asteroides
    this.asteroids.getChildren().forEach((asteroid: any) => {
      asteroid.setVelocity(0);
      asteroid.setAngularVelocity(0);
    });
    
    // Mostrar textos de Game Over
    this.gameOverText.setVisible(true);
    this.finalScoreText.setText('Tu puntuación final: ' + this.score);
    this.finalScoreText.setVisible(true);
    this.backToMenuButton.setVisible(true);
    this.restartButton.setVisible(true);
    
    // Guardar la puntuación
    this.saveScore();
  }
  
  saveScore() {
    const playerName = localStorage.getItem('currentPlayer') || 'Jugador';
    
    // Obtener puntuaciones anteriores
    let scores = JSON.parse(localStorage.getItem('scores') || '[]');
    
    // Añadir la nueva puntuación
    scores.push({
      name: playerName,
      score: this.score,
      date: new Date().toISOString()
    });
    
    // Ordenar las puntuaciones de mayor a menor
    scores.sort((a: any, b: any) => b.score - a.score);
    
    // Guardar las puntuaciones actualizadas
    localStorage.setItem('scores', JSON.stringify(scores));
  }
  
  togglePause() {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      // Pausar el juego
      this.pauseText.setVisible(true);
      this.restartButton.setVisible(true);
      this.physics.pause();
      this.asteroidSpawnTimer.paused = true;
      this.pauseButton.setText('REANUDAR');
    } else {
      // Reanudar el juego
      this.pauseText.setVisible(false);
      this.restartButton.setVisible(false);
      this.physics.resume();
      this.asteroidSpawnTimer.paused = false;
      this.pauseButton.setText('PAUSA');
    }
  }
  
  restart() {
    // Reiniciar variables
    this.gameOver = false;
    this.isPaused = false;
    this.score = 0;
    
    // Limpiar objetos
    this.asteroids.clear(true, true);
    this.lasers.clear(true, true);
    
    // Restablecer la nave
    this.ship.enableBody(true, 400, 550, true, true);
    this.ship.setVelocity(0);
    
    // Reiniciar textos
    this.scoreText.setText('Puntuación: 0');
    this.pauseButton.setText('PAUSA');
    
    // Ocultar textos
    this.pauseText.setVisible(false);
    this.gameOverText.setVisible(false);
    this.finalScoreText.setVisible(false);
    this.backToMenuButton.setVisible(false);
    this.restartButton.setVisible(false);
    
    // Reiniciar generación de asteroides
    if (this.asteroidSpawnTimer) {
      this.asteroidSpawnTimer.remove();
    }
    this.startAsteroidSpawner();
    
    // Reanudar física
    this.physics.resume();
  }
} 