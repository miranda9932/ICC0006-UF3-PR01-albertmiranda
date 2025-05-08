# Space Shooter - Juego Arcade Espacial

Este es un juego espacial desarrollado con Ionic y Phaser donde controlas una nave espacial para destruir asteroides y sumar puntos.

## Instrucciones de instalación

1. Instalar dependencias:
```
npm install
```

2. Iniciar el juego:
```
ionic serve
```

## Información sobre los assets

Este proyecto utiliza archivos SVG básicos para las gráficas y genera sonidos mediante la Web Audio API. No es necesario añadir archivos de recursos adicionales para probarlo.

### Imágenes
- Se han creado SVG básicos para:
  - Nave del jugador (ship.svg)
  - Asteroides (asteroid.svg)
  - Láser (laser.svg)
  - Explosión (explosion.svg)

### Sonidos
- Se generan en tiempo real con Web Audio API
- Existe un script de demostración en `src/assets/game/sounds/generate-sounds.js`

## Mecánicas del juego

1. El jugador puede mover la nave de izquierda a derecha con las flechas del teclado
2. El jugador puede disparar con la barra espaciadora
3. Los disparos destruyen asteroides y suman puntos
4. Si un asteroide colisiona con la nave, la partida termina
5. Las puntuaciones se guardan en localStorage

## Estructura del proyecto

- `src/app/phaser/` - Carpeta con todo el código de Phaser
- `src/app/phaser/scenes/` - Escenas del juego (menú, juego, puntuaciones)
- `src/app/phaser/phaser.service.ts` - Servicio que inicializa Phaser
- `src/assets/game/` - Recursos del juego (imágenes SVG, script de sonidos)

## Personalización

Si quieres mejorar este juego, puedes:

1. Reemplazar los SVG por imágenes más elaboradas
2. Añadir archivos de audio reales (MP3/WAV) en lugar de generación por Web Audio
3. Personalizar la estética y el comportamiento de los elementos
4. Añadir niveles de dificultad y power-ups

## Instrucciones para estudiantes

Este es un proyecto educativo para entender la integración de Phaser con Ionic. Analiza el código para entender:

1. La estructura de escenas en Phaser
2. Cómo se maneja la física y las colisiones
3. Cómo Ionic y Angular se integran con un motor de juegos
4. Cómo implementar almacenamiento local para guardar puntuaciones 