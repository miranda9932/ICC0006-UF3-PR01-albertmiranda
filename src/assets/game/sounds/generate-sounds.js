
function generateLaserSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const duration = 0.3;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + duration);
  
  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
  
  
}

function generateExplosionSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const duration = 0.5;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  const noiseBuffer = createNoiseBuffer(audioCtx);
  const noiseSource = audioCtx.createBufferSource();
  
  noiseSource.buffer = noiseBuffer;
  
  const lowpass = audioCtx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(800, audioCtx.currentTime);
  lowpass.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + duration);
  
  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  noiseSource.connect(lowpass);
  lowpass.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  noiseSource.start();
  noiseSource.stop(audioCtx.currentTime + duration);
  
  
}

function createNoiseBuffer(audioCtx) {
  const bufferSize = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  
  return buffer;
}

console.log('Utiliza estas funciones en el navegador para generar sonidos de demostración');
console.log('generateLaserSound()');
console.log('generateExplosionSound()'); 