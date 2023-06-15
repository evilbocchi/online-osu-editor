declare var window: {
    webkitAudioContext: typeof AudioContext;
} & Window & typeof globalThis;


export class Sound {
    static audioContext = null;

    static decodeAudioData = (data: any, cb: (sound: Sound) => void) => {
        Sound.audioContext = Sound.audioContext ? Sound.audioContext : new (window.AudioContext || window.webkitAudioContext)();
        Sound.audioContext.decodeAudioData(data, (buffer) => {
            cb(new Sound(buffer));
        }, () => { });
    }

    buffer = null;
    gainNode = null;
    i = 0;

    constructor(buffer?: AudioBuffer) {
        Sound.audioContext = Sound.audioContext ? Sound.audioContext : new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = Sound.audioContext.createGain();
        this.gainNode.gain.value = 1;
        this.gainNode.connect(Sound.audioContext.destination)
        this.buffer = buffer;
    }

    setVolume(volume: number) {
        this.gainNode.gain.value = volume;
    }

    start(offset: number, playbackRate?: number, detune?: number) {
        const source = Sound.audioContext.createBufferSource();
        source.buffer = this.buffer;
        source.playbackRate.value = playbackRate ? playbackRate : 1;
        source.detune.value = detune ? detune : 0;
        source.connect(this.gainNode);
        source.start(0, offset);
    }

    play(playbackRate?: number, detune?: number) {
        this.start(0, playbackRate, detune);
    }
}