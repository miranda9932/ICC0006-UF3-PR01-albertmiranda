/**
 * Definición para ActiveXObject que falta en el entorno TypeScript moderno
 * pero que es requerida por Phaser
 */
interface ActiveXObject {
  [key: string]: any;
} 