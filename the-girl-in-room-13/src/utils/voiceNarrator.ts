// Speech Synthesis & Voice Narration Engine for "The Girl in Room 13"

export interface VoiceState {
  isPlaying: boolean;
  isPaused: boolean;
  currentChapterId: string | null;
  currentParagraphIndex: number | null;
  currentText: string;
  speed: number;
}

type VoiceStateListener = (state: VoiceState) => void;

class StoryVoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<VoiceStateListener> = new Set();
  private queue: {
    text: string;
    speaker?: string;
    chapterId: string;
    paragraphIndex: number;
    soundCue?: () => void;
  }[] = [];
  private queueIndex = 0;
  private isProcessingQueue = false;
  private speed = 0.92; // Slightly atmospheric slower storytelling pace

  private state: VoiceState = {
    isPlaying: false,
    isPaused: false,
    currentChapterId: null,
    currentParagraphIndex: null,
    currentText: '',
    speed: 0.92,
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public subscribe(listener: VoiceStateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }

  public setSpeed(speed: number) {
    this.speed = speed;
    this.state.speed = speed;
    this.notify();
  }

  public getSpeed(): number {
    return this.speed;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  private getVoiceForRole(speaker?: string): { voice: SpeechSynthesisVoice | null; pitch: number; rate: number } {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }

    const englishVoices = this.voices.filter((v) => v.lang.startsWith('en'));
    const pool = englishVoices.length > 0 ? englishVoices : this.voices;

    // Prefer high quality / natural voices
    const naturalVoice = pool.find((v) =>
      /natural|google|premium|daniel|george|arthur|david|guy/i.test(v.name)
    ) || pool[0] || null;

    const femaleVoice = pool.find((v) =>
      /female|zira|samantha|karen|victoria|catherine|jenny/i.test(v.name)
    ) || naturalVoice;

    if (!speaker) {
      // General Narrator: calm, measured, deep-seated storytelling
      return {
        voice: naturalVoice,
        pitch: 0.92,
        rate: this.speed,
      };
    }

    const role = speaker.toLowerCase();

    if (role.includes('landlord')) {
      // Landlord: older, lower, stern and grave
      return {
        voice: naturalVoice,
        pitch: 0.72,
        rate: this.speed * 0.88,
      };
    }

    if (role.includes('room 13') || role.includes('daughter') || role.includes('voice from inside') || role.includes('caller id')) {
      // The Girl in Room 13: high, airy, slow chilling whisper cadence
      return {
        voice: femaleVoice,
        pitch: 1.25,
        rate: this.speed * 0.75,
      };
    }

    if (role.includes('mom') || role.includes('outside bedroom')) {
      // Deceased Mother Mimicry: uncanny soft voice
      return {
        voice: femaleVoice,
        pitch: 1.05,
        rate: this.speed * 0.82,
      };
    }

    if (role.includes('daniel')) {
      // Daniel: tense, breathless
      return {
        voice: naturalVoice,
        pitch: 1.05,
        rate: this.speed * 1.05,
      };
    }

    return {
      voice: naturalVoice,
      pitch: 0.95,
      rate: this.speed,
    };
  }

  /**
   * Speak a single short phrase or dialogue line immediately
   */
  public speakSnippet(text: string, speaker?: string, onComplete?: () => void) {
    if (!this.synth) return;

    this.stop();

    const cleanText = text.replace(/["']/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const { voice, pitch, rate } = this.getVoiceForRole(speaker);

    if (voice) utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;

    this.currentUtterance = utterance;

    this.state = {
      ...this.state,
      isPlaying: true,
      isPaused: false,
      currentText: cleanText,
    };
    this.notify();

    utterance.onend = () => {
      this.state = {
        ...this.state,
        isPlaying: false,
        isPaused: false,
        currentText: '',
      };
      this.notify();
      if (onComplete) onComplete();
    };

    utterance.onerror = () => {
      this.state = {
        ...this.state,
        isPlaying: false,
        isPaused: false,
        currentText: '',
      };
      this.notify();
    };

    this.synth.speak(utterance);
  }

  /**
   * Start narrating an entire chapter or the whole story queue
   */
  public startChapterQueue(
    items: {
      text: string;
      speaker?: string;
      chapterId: string;
      paragraphIndex: number;
      soundCue?: () => void;
    }[]
  ) {
    if (!this.synth || items.length === 0) return;

    this.stop();
    this.queue = items;
    this.queueIndex = 0;
    this.isProcessingQueue = true;

    this.playNextInQueue();
  }

  private playNextInQueue() {
    if (!this.synth || !this.isProcessingQueue || this.queueIndex >= this.queue.length) {
      this.isProcessingQueue = false;
      this.state = {
        ...this.state,
        isPlaying: false,
        isPaused: false,
        currentChapterId: null,
        currentParagraphIndex: null,
        currentText: '',
      };
      this.notify();
      return;
    }

    const item = this.queue[this.queueIndex];

    // Trigger associated sound cue if any (e.g. footsteps, knock)
    if (item.soundCue) {
      try {
        item.soundCue();
      } catch {
        // ignore audio cue error
      }
    }

    const { voice, pitch, rate } = this.getVoiceForRole(item.speaker);
    const cleanText = item.text.replace(/THUD\.\.\.|KNOCK\.\.\./gi, '').trim() || item.text;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (voice) utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;

    this.currentUtterance = utterance;

    this.state = {
      ...this.state,
      isPlaying: true,
      isPaused: false,
      currentChapterId: item.chapterId,
      currentParagraphIndex: item.paragraphIndex,
      currentText: cleanText,
    };
    this.notify();

    utterance.onend = () => {
      if (this.isProcessingQueue) {
        this.queueIndex++;
        // Natural pause between sentences/paragraphs
        setTimeout(() => {
          this.playNextInQueue();
        }, 320);
      }
    };

    utterance.onerror = () => {
      if (this.isProcessingQueue) {
        this.queueIndex++;
        this.playNextInQueue();
      }
    };

    this.synth.speak(utterance);
  }

  public pause() {
    if (!this.synth) return;
    this.synth.pause();
    this.state = {
      ...this.state,
      isPaused: true,
    };
    this.notify();
  }

  public resume() {
    if (!this.synth) return;
    this.synth.resume();
    this.state = {
      ...this.state,
      isPaused: false,
      isPlaying: true,
    };
    this.notify();
  }

  public stop() {
    this.isProcessingQueue = false;
    this.queue = [];
    this.queueIndex = 0;
    if (this.synth) {
      this.synth.cancel();
    }
    this.state = {
      ...this.state,
      isPlaying: false,
      isPaused: false,
      currentChapterId: null,
      currentParagraphIndex: null,
      currentText: '',
    };
    this.notify();
  }
}

export const voiceNarrator = new StoryVoiceEngine();
