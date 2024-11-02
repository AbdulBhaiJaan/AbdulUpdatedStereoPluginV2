/**
 * @name AbdulStereoSoundPluginV2
 * @version 2.0.0
 * @description They Call Me King Of Universal 🎙
 * @author AbdulTheKingOfAsia Bd King #LoudestOnCord #1
 */

class StereoSoundPlugin {
    constructor() {
        this.settings = {
            sampleRate: 48000,
            bitRate: 712,
            stereoWidth: 1.5,
            gain: 1.0,
            filters: {
                bassBoost: 1.2,
                highShelf: 1.1,
                clarityBoost: 1.3,
            },
            warningAcknowledged: true, 
            stereoEnabled: true, 
        };
    }

    
    start() {
        
        if (!this.settings.warningAcknowledged) {
            console.warn("Warning: Please acknowledge the warning before starting the plugin.");
            return;
        }

        
        this.audioContext = new AudioContext({ sampleRate: this.settings.sampleRate });
        this.getInputStream()
            .then(stream => {
                this.source = this.audioContext.createMediaStreamSource(stream);
                this.setupAudioNodes();
            })
            .catch(err => {
                console.error("Failed to get audio stream: ", err);
                this.showError("Unable to access audio input. Please check your microphone settings. Working...");
            });
    }

    
    setupAudioNodes() {
        this.stereoPanner = this.audioContext.createStereoPanner();
        this.stereoPanner.pan.value = this.settings.stereoWidth;
        
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = this.settings.gain;
        
        this.bassFilter = this.audioContext.createBiquadFilter();
        this.bassFilter.type = "lowshelf";
        this.bassFilter.frequency.value = 200;
        this.bassFilter.gain.value = this.settings.filters.bassBoost;
        
        this.highShelfFilter = this.audioContext.createBiquadFilter();
        this.highShelfFilter.type = "highshelf";
        this.highShelfFilter.frequency.value = 3000;
        this.highShelfFilter.gain.value = this.settings.filters.highShelf;
        
        this.clarityFilter = this.audioContext.createBiquadFilter();
        this.clarityFilter.type = "peaking";
        this.clarityFilter.frequency.value = 1000;
        this.clarityFilter.Q.value = 1;
        this.clarityFilter.gain.value = this.settings.filters.clarityBoost;

        this.connectNodes();
        this.settings.stereoEnabled = true; 
        console.log("Abdul Stereo is enabled.");
    }

    
    getInputStream() {
        return navigator.mediaDevices.getUserMedia({ audio: true });
    }

   
    connectNodes() {
        this.source
            .connect(this.bassFilter)
            .connect(this.highShelfFilter)
            .connect(this.clarityFilter)
            .connect(this.gainNode)
            .connect(this.stereoPanner)
            .connect(this.audioContext.destination);
    }

    
    stop() {
        if (this.audioContext) {
            this.audioContext.close();
            this.settings.stereoEnabled = false; 
            console.log("Abdul Stereo has been disabled.");
        }
    }

    
    showError(message) {
        
        alert(message);
    }

    
    acknowledgeWarning() {
        this.settings.warningAcknowledged = true;
        console.log("Warning acknowledged.");
    }

    
    toggleStereo(enabled) {
        this.settings.stereoEnabled = enabled;
        if (enabled) {
            console.log("Abdul Stereo is now enabled.");
        } else {
            console.log("Abdul Stereo is now disabled.");
        }
    }

    
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        console.log("Settings updated:", this.settings);
        
        // If settings that affect audio processing are changed, re-setup audio nodes
        if (newSettings.sampleRate || newSettings.gain || newSettings.stereoWidth) {
            this.stop();
            this.start();
        }
    }

    
    getSettings() {
        return this.settings;
    }
}

module.exports = StereoSoundPlugin;
