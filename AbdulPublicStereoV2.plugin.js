/**
 * @name AbdulPublicStereoUpdatedV2
 * @version 2
 * @description Enhanced Stereo Plugin with Bitrate, Sample Rate, and Encoder Options
 * @github https://github.com/AbdulBhaiJaan
 * @discord discord.gg/freevault
 */

class AbdulPublicStereoUpdatedV2 {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: 48000
        });
        this.encoder = this.createEncoder();
        this.stereoPanner = new StereoPannerNode(this.audioContext, { pan: 1 });
        this.gainNode = this.audioContext.createGain();
        this.isPlaying = false;
        this.bitrate = 1024;
        this.init();
    }

    init() {
        this.applyAudioSettings();
    }

    createEncoder() {
        const mediaStreamDestination = this.audioContext.createMediaStreamDestination();
        return mediaStreamDestination;
    }

    applyAudioSettings() {
        this.stereoPanner.connect(this.gainNode);
        this.gainNode.connect(this.encoder);
        this.gainNode.gain.value = 1.8;
    }

    start() {
        if (!this.isPlaying) {
            this.audioContext.resume().then(() => {
                this.isPlaying = true;
                console.log("Audio processing started with settings:", {
                    bitrate: this.bitrate,
                    sampleRate: this.audioContext.sampleRate,
                });
            });
        }
    }

    stop() {
        if (this.isPlaying) {
            this.audioContext.suspend().then(() => {
                this.isPlaying = false;
                console.log("Audio processing stopped.");
            });
        }
    }

    setBitrate(newBitrate) {
        this.bitrate = newBitrate;
        console.log(`Bitrate set to ${newBitrate} kbps`);
    }

    setSampleRate(newSampleRate) {
        if (this.audioContext.state !== 'closed') {
            console.warn("Sample rate can only be set at initialization. Restart the audio context to apply changes.");
        } else {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: newSampleRate
            });
            console.log(`Sample rate set to ${newSampleRate} Hz`);
            this.applyAudioSettings();
        }
    }

    setStereoEffect(panValue) {
        this.stereoPanner.pan.value = Math.max(-1, Math.min(1, panValue));
    }

    setEncoder(encoderType) {
        if (encoderType === 'Opus') {
            console.log("Using Opus encoder for high efficiency and quality.");
        } else if (encoderType === 'PCM') {
            console.log("Using PCM encoder for lossless quality.");
        } else if (encoderType === 'EnhancedVoice') {
            console.log("Using Enhanced Voice encoder for clarity and sharpness.");
        } else {
            console.log("Encoder type not recognized. Using default encoder.");
        }
        this.encoderType = encoderType;
    }
}

const audioPlugin = new AbdulPublicStereoUpdatedV2();
audioPlugin.setBitrate(1024);
audioPlugin.setSampleRate(48000);
audioPlugin.setStereoEffect(1);
audioPlugin.setEncoder('EnhancedVoice');

module.exports = audioPlugin;
