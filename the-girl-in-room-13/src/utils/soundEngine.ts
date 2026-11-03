// Procedural Web Audio API Sound Engine for "The Girl in Room 13"

class HorrorSoundEngine {
  private ctx: AudioContext | null = null;
  private ambienceGain: GainNode | null = null;
  private ambienceOsc1: OscillatorNode | null = null;
  private ambienceOsc2: OscillatorNode | null = null;
  private isAmbiencePlaying = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleAmbience(forceState?: boolean): boolean {
    const ctx = this.ensureContext();
    if (!ctx) return false;

    const target = forceState !== undefined ? forceState : !this.isAmbiencePlaying;

    if (target && !this.isAmbiencePlaying) {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.08, now + 1.5);

      // Deep sub-room resonance (55Hz & 82.4Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(55, now);
      osc2.frequency.setValueAtTime(82.41, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);

      this.ambienceGain = masterGain;
      this.ambienceOsc1 = osc1;
      this.ambienceOsc2 = osc2;
      this.isAmbiencePlaying = true;
      return true;
    } else if (!target && this.isAmbiencePlaying) {
      const now = ctx.currentTime;
      if (this.ambienceGain) {
        this.ambienceGain.gain.setValueAtTime(this.ambienceGain.gain.value, now);
        this.ambienceGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      }
      setTimeout(() => {
        try {
          this.ambienceOsc1?.stop();
          this.ambienceOsc2?.stop();
          this.ambienceOsc1?.disconnect();
          this.ambienceOsc2?.disconnect();
        } catch {
          // ignore if already stopped
        }
        this.ambienceOsc1 = null;
        this.ambienceOsc2 = null;
        this.ambienceGain = null;
      }, 450);
      this.isAmbiencePlaying = false;
      return false;
    }

    return this.isAmbiencePlaying;
  }

  public getAmbienceState(): boolean {
    return this.isAmbiencePlaying;
  }

  // Heavy upstairs wooden footsteps: THUD... THUD... THUD...
  public playFootsteps() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const times = [0, 0.85, 1.7];
    times.forEach((offset) => {
      const start = ctx.currentTime + offset;

      // Low resonant floorboard thud
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, start);
      osc.frequency.exponentialRampToValueAtTime(28, start + 0.32);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.45, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.4);
    });
  }

  // Urgent bedroom door knock: KNOCK... KNOCK... KNOCK...
  public playDoorKnock() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const times = [0, 0.36, 0.72];
    times.forEach((offset) => {
      const start = ctx.currentTime + offset;

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(190, start);
      osc.frequency.exponentialRampToValueAtTime(62, start + 0.09);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(280, start);
      filter.Q.setValueAtTime(2.5, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.38, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.14);
    });
  }

  // 2:13 AM Motion Detection Alert chime
  public playMotionAlert() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [880, 1174.66].forEach((freq, idx) => {
      const start = now + idx * 0.14;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.26);
    });
  }

  // Eerie whisper / breath resonance when leaning near Room 13
  public playWhisperPulse() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 1.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(620, now);
    filter.frequency.exponentialRampToValueAtTime(340, now + 1.3);
    filter.Q.setValueAtTime(6, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 1.4);
  }

  // Phone ring / disconnect beep for Alex's 2:13 AM call
  public playPhoneRingPulse() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [440, 480].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gain.gain.setValueAtTime(0.12, now + 0.45);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.56);
    });
  }

  public playDisconnectTone() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [0, 0.35, 0.7].forEach((offset) => {
      const start = now + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.24);
    });
  }
}

export const soundEngine = new HorrorSoundEngine();
