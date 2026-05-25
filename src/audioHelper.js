/**
 * Ethereal Sound Synthesis Engine
 * Built using the Browser's Native Web Audio API.
 * Provides offline-ready, high-fidelity sound effects without any external assets.
 */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.ambientSource = null;
    this.ambientWindGain = null;
    this.ambientStreamGain = null;
    this.isMuted = true;
    this.windLfo = null;
  }

  // Lazy initialize Audio Context on first user interaction
  init() {
    if (this.audioCtx) return;
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.audioCtx.currentTime); // Standard comfortable volume
      this.masterGain.connect(this.audioCtx.destination);
    } catch (error) {
      console.warn("Web Audio API not supported in this browser.", error);
    }
  }

  resume() {
    this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setMute(mute) {
    this.isMuted = mute;
    this.resume();
    if (!this.masterGain) return;
    
    const targetVolume = mute ? 0 : 0.45;
    this.masterGain.gain.linearRampToValueAtTime(targetVolume, this.audioCtx.currentTime + 0.3);
    
    if (!mute) {
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
  }

  // Synthesize Organic Nature Ambient Drone (Low wind + Water Stream murmur)
  startAmbient() {
    if (this.isMuted || !this.audioCtx) return;
    if (this.ambientSource) return; // Already running

    const now = this.audioCtx.currentTime;

    // 1. GENERATE WHITE NOISE FOR WIND
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Wind Bandpass/Lowpass Filter
    const windFilter = this.audioCtx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.Q.setValueAtTime(3.0, now);
    windFilter.frequency.setValueAtTime(350, now); // Baseline wind howl frequency

    // LFO to modulate Wind frequency (creating wind gusts)
    this.windLfo = this.audioCtx.createOscillator();
    this.windLfo.type = 'sine';
    this.windLfo.frequency.setValueAtTime(0.08, now); // Very slow LFO (0.08 Hz = ~12s loop)
    
    const windLfoGain = this.audioCtx.createGain();
    windLfoGain.gain.setValueAtTime(150, now); // Modulate frequency by +/- 150Hz

    this.windLfo.connect(windLfoGain);
    windLfoGain.connect(windFilter.frequency);
    
    this.ambientWindGain = this.audioCtx.createGain();
    this.ambientWindGain.gain.setValueAtTime(0.04, now); // Soft volume

    whiteNoise.connect(windFilter);
    windFilter.connect(this.ambientWindGain);
    this.ambientWindGain.connect(this.masterGain);

    // Start Wind sources
    whiteNoise.start(now);
    this.windLfo.start(now);
    this.ambientSource = whiteNoise;

    // 2. WATER STREAM STREAM MURMUR (Low hum combined with soft high bubbling)
    this.streamOsc1 = this.audioCtx.createOscillator();
    this.streamOsc1.type = 'triangle';
    this.streamOsc1.frequency.setValueAtTime(65, now); // Deep river bass rumble

    const streamOsc1Filter = this.audioCtx.createBiquadFilter();
    streamOsc1Filter.type = 'lowpass';
    streamOsc1Filter.frequency.setValueAtTime(120, now);

    this.ambientStreamGain = this.audioCtx.createGain();
    this.ambientStreamGain.gain.setValueAtTime(0.03, now); // Subtle hum

    this.streamOsc1.connect(streamOsc1Filter);
    streamOsc1Filter.connect(this.ambientStreamGain);
    this.ambientStreamGain.connect(this.masterGain);
    this.streamOsc1.start(now);

    // 3. WATER RIPPLE / BUBBLES
    this.bubbleTimer = setInterval(() => {
      if (!this.isMuted) {
        this.playBubble();
      }
    }, 2800);
  }

  playBubble() {
    if (!this.audioCtx || this.isMuted) return;
    const now = this.audioCtx.currentTime;
    
    // Quick high pitch water plop
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    // Random water bubble frequencies
    const freq = 1200 + Math.random() * 800;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.15); // Fast sweep up
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.015, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + 0.2);
  }

  stopAmbient() {
    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
        if (this.windLfo) this.windLfo.stop();
        if (this.streamOsc1) this.streamOsc1.stop();
      } catch (e) {}
      this.ambientSource = null;
      this.windLfo = null;
      this.streamOsc1 = null;
    }
    if (this.bubbleTimer) {
      clearInterval(this.bubbleTimer);
      this.bubbleTimer = null;
    }
  }

  // Adjust wind sound speed based on Nature interactive slider
  setWindSpeed(speed) {
    if (!this.audioCtx || this.isMuted) return;
    const now = this.audioCtx.currentTime;
    
    if (this.ambientWindGain) {
      // Wind speed increases wind loudness and pitch slightly
      const targetVolume = 0.02 + (speed / 100) * 0.15;
      this.ambientWindGain.gain.linearRampToValueAtTime(targetVolume, now + 0.1);
    }
  }

  /**
   * Play specific high-fidelity node hover sound
   */
  playHover(nodeId) {
    this.resume();
    if (this.isMuted || !this.audioCtx) return;
    
    const now = this.audioCtx.currentTime;
    
    switch (nodeId) {
      case 'code':
        // Two quick, high-precision digital blips (IDE compiling sound)
        this.synthBlip(523.25, now, 0.05); // C5
        this.synthBlip(1046.5, now + 0.05, 0.06); // C6
        break;
        
      case 'github':
        // Bouncy octave jump (representing commits uploading)
        this.synthBlip(329.63, now, 0.06); // E4
        this.synthBlip(659.25, now + 0.06, 0.1); // E5
        break;
        
      case 'photography':
        // SYNTHESIZED DSLR CAMERA SHUTTER SOUND!
        // Shutter release (short white noise click) followed by mirror slap
        this.synthShutter(now);
        break;
        
      case 'nature':
        // Soaring organic flute tone with nice lowpass filter
        this.synthFlute(261.63, now, 0.4); // C4
        break;
        
      case 'music':
        // Lush major seventh arpeggio
        this.synthArpeggio([261.63, 329.63, 392.00, 493.88], now, 0.06); // C4, E4, G4, B4
        break;
        
      case 'food':
        // Culinary clink/pop
        this.synthClink(1500, now, 0.15);
        break;
        
      case 'growth':
        // Sparkling exponential compounding scale
        this.synthArpeggio([392.00, 523.25, 659.25, 783.99, 1046.50], now, 0.04); // G4, C5, E5, G5, C6
        break;
        
      case 'journey':
        // Ethereal echoing chime with Simulated Reverberation delay line!
        this.synthEchoChime(587.33, now); // D5
        break;
        
      default:
        this.synthBlip(440, now, 0.1);
    }
  }

  // Play satisfying success / select sound
  playClick() {
    this.resume();
    if (this.isMuted || !this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    
    // Sparkly chime
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      
      gain.gain.setValueAtTime(0, now + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.04 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.3);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.35);
    });
  }

  // Sound generator helpers
  synthBlip(freq, time, duration) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.08, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(time);
    osc.stop(time + duration);
  }

  synthShutter(time) {
    // 1. White noise generator for the shutter snap
    const bufferSize = 0.08 * this.audioCtx.sampleRate;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = this.audioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    
    const noiseFilter = this.audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1000, time);
    noiseFilter.Q.setValueAtTime(1.0, time);
    
    const noiseGain = this.audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0, time);
    noiseGain.gain.linearRampToValueAtTime(0.12, time + 0.005);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);
    
    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    
    noiseNode.start(time);
    noiseNode.stop(time + 0.05);

    // 2. High metallic click (mirror slap)
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, time + 0.02);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.05);
    
    gain.gain.setValueAtTime(0, time + 0.02);
    gain.gain.linearRampToValueAtTime(0.1, time + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.07);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time + 0.02);
    osc.stop(time + 0.075);
  }

  synthFlute(freq, time, duration) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    // Slow pitch vibrato
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.linearRampToValueAtTime(freq * 1.2, time + duration);
    
    // Soft high harmonic
    const oscHarmonic = this.audioCtx.createOscillator();
    oscHarmonic.type = 'sine';
    oscHarmonic.frequency.setValueAtTime(freq * 3, time); // Odd harmonic
    
    const harmonicGain = this.audioCtx.createGain();
    harmonicGain.gain.setValueAtTime(0.015, time);
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.1, time + 0.08); // Slow attack
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    
    osc.connect(gain);
    oscHarmonic.connect(harmonicGain);
    harmonicGain.connect(gain);
    
    gain.connect(this.masterGain);
    
    osc.start(time);
    osc.stop(time + duration);
    oscHarmonic.start(time);
    oscHarmonic.stop(time + duration);
  }

  synthArpeggio(freqs, time, delay) {
    freqs.forEach((freq, idx) => {
      this.synthBlip(freq, time + idx * delay, 0.12);
    });
  }

  synthClink(freq, time, duration) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.08, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    
    // Add high frequency resonance ring
    const res = this.audioCtx.createOscillator();
    res.type = 'sine';
    res.frequency.setValueAtTime(freq * 2.2, time);
    
    const resGain = this.audioCtx.createGain();
    resGain.gain.setValueAtTime(0.02, time);
    resGain.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.5);
    
    osc.connect(gain);
    res.connect(resGain);
    resGain.connect(this.masterGain);
    gain.connect(this.masterGain);
    
    osc.start(time);
    osc.stop(time + duration);
    res.start(time);
    res.stop(time + duration);
  }

  synthEchoChime(freq, time) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.12, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.8);
    
    // Delay node for the ECHO
    const delay = this.audioCtx.createDelay();
    delay.delayTime.setValueAtTime(0.25, time); // 250ms echo delay
    
    const feedback = this.audioCtx.createGain();
    feedback.gain.setValueAtTime(0.4, time); // 40% feedback loudness
    
    osc.connect(gain);
    
    // Connect output to delay line
    gain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay); // Loop delay
    
    // Connect delay to output
    delay.connect(this.masterGain);
    gain.connect(this.masterGain);
    
    osc.start(time);
    osc.stop(time + 1.2);
  }

  // Chime Synthesizer for Zen Garden Wind Chimes
  playChime(noteIndex) {
    this.resume();
    if (this.isMuted || !this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    
    // Pentatonic scale pitches: C4, D4, E4, G4, A4, C5, D5, E5, G5, A5
    const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
    const freq = pentatonic[noteIndex % pentatonic.length] || 440;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5); // long decay
    
    // High-pitched minor metallic overtones
    const overtone1 = this.audioCtx.createOscillator();
    overtone1.type = 'sine';
    overtone1.frequency.setValueAtTime(freq * 2.76, now); // Non-harmonic metal chime overtone
    
    const otGain1 = this.audioCtx.createGain();
    otGain1.gain.setValueAtTime(0.04, now);
    otGain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    
    osc.connect(gain);
    overtone1.connect(otGain1);
    
    otGain1.connect(this.masterGain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    overtone1.start(now);
    
    osc.stop(now + 1.6);
    overtone1.stop(now + 0.65);
  }
}

// Export a single instance to be shared across components
const audioHelper = new SoundEngine();
export default audioHelper;
