
const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
let audioCtx: AudioContext | null = null;

const getCtx = () => {
    if (!audioCtx) {
        audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

export const playClick = () => {
    try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        // High pitch "tick"
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
};

export const playPop = () => {
    try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        // Bubble pop sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
};

export const playSuccess = () => {
    try {
        const ctx = getCtx();
        const t = ctx.currentTime;
        
        const playNote = (freq: number, offset: number, duration: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + offset);
            gain.gain.setValueAtTime(0.05, t + offset);
            gain.gain.linearRampToValueAtTime(0.001, t + offset + duration);
            osc.start(t + offset);
            osc.stop(t + offset + duration);
        };

        // Magical Upward Chime (Pentatonic run)
        playNote(523.25, 0, 0.3); // C5
        playNote(659.25, 0.1, 0.3); // E5
        playNote(783.99, 0.2, 0.3); // G5
        playNote(1046.50, 0.3, 0.6); // C6
        playNote(1318.51, 0.4, 0.8); // E6
    } catch(e) {}
};

export const playError = () => {
    try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } catch(e) {}
};

export const playFanfare = () => {
    try {
        const ctx = getCtx();
        const t = ctx.currentTime;
        // Simple fanfare trumpet-like
        const play = (f: number, s: number, d: number) => {
             const osc = ctx.createOscillator();
             const gain = ctx.createGain();
             osc.type = 'triangle';
             osc.connect(gain);
             gain.connect(ctx.destination);
             osc.frequency.value = f;
             gain.gain.setValueAtTime(0.08, t + s);
             gain.gain.linearRampToValueAtTime(0, t + s + d);
             osc.start(t + s);
             osc.stop(t + s + d);
        }
        play(523.25, 0, 0.15);
        play(523.25, 0.15, 0.15);
        play(523.25, 0.3, 0.15);
        play(783.99, 0.5, 0.8); // G5 long
    } catch (e) {}
};

export const playPageTurn = () => {
    try {
        const ctx = getCtx();
        const bufferSize = ctx.sampleRate * 0.1; // 0.1s noise
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = ctx.createGain();
        // Bandpass to sound like paper
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        noise.start();
    } catch(e) {}
};
