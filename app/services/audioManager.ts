export class AudioManager {
  private static instance: AudioManager;
  private audioCtx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private synthesis: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private voices: SpeechSynthesisVoice[] = [];

  private constructor() {
    if (this.synthesis) {
      this.voices = this.synthesis.getVoices();
      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = () => {
          this.voices = this.synthesis!.getVoices();
        };
      }
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioCtx;
  }

  public stopAll() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch (e) {
        // Ignore errors if already stopped
      }
      this.currentSource = null;
    }

    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  public async playGeminiAudio(base64Audio: string): Promise<AudioBufferSourceNode> {
    this.stopAll();

    const ctx = this.getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const float32Array = new Float32Array(len / 2);
    const dataView = new DataView(bytes.buffer);
    for (let i = 0; i < len / 2; i++) {
      float32Array[i] = dataView.getInt16(i * 2, true) / 32768.0;
    }

    const buffer = ctx.createBuffer(1, float32Array.length, 24000);
    buffer.getChannelData(0).set(float32Array);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    
    this.currentSource = source;
    source.start();
    
    source.onended = () => {
      if (this.currentSource === source) {
        this.currentSource = null;
      }
    };

    return source;
  }

  public playTTS(text: string) {
    this.stopAll();
    if (!this.synthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.05;
    utterance.lang = 'en-US';

    if (this.voices.length === 0) {
      this.voices = this.synthesis.getVoices();
    }

    const preferredVoice = 
      this.voices.find(v => v.name === 'Google US English') ||
      this.voices.find(v => v.name === 'Samantha') || 
      this.voices.find(v => v.lang === 'en-US' && v.localService) ||
      this.voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.synthesis.speak(utterance);
  }
}

export const audioManager = AudioManager.getInstance();
