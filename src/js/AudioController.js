define(function(require) {

    var BufferLoader = require('src/js/BufferLoader');

    function AudioController(audioAssetsArray) {

        //console.log('AudioController init');

        this.BufferLoader = BufferLoader;
        this.AudioContextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);
        this.context = this.AudioContextClass ? new this.AudioContextClass() : null;
        this.oscillator = this.context ? this.context.createOscillator() : null;
        this.gainNode = this.context ? this.context.createGain() : null;
        this.bufferLoader = null;

        this.audioAssetsArray = audioAssetsArray;

        this.setupEvents();

        this.load();

    }

    AudioController.prototype.setupEvents = function setupEvents() {

        //console.log('AudioController.setupEvents');

        var boundAppReadyHandler = this.handleAppReady.bind(this),
            boundAudioPlayEventHandler = this.handleAudioPlayEvent.bind(this);

        document.addEventListener('AppReady', boundAppReadyHandler);
        document.addEventListener('AppAudioPlay', boundAudioPlayEventHandler, false);

    };

    AudioController.prototype.handleAudioPlayEvent = function handleAudioPlayEvent(e) {

        //console.log('AudioController.handleAudioPlayEvent', e);

        this.play(e.detail);

    };

    AudioController.prototype.handleAppReady = function handleAppReady(e) {

        //console.log('AudioController.handleAppReady');

        this.isTouchDevice = e.detail.isTouchDevice;
        this.vendorPrefix = e.detail.vendorPrefix;
        this.browser = e.detail.browser;

        return this;

    };

    AudioController.prototype.load = function load() {

        //console.log('AudioController.load');

        var boundCallback = this.finishLoading.bind(this);
        this.bufferLoader = new this.BufferLoader(this.context, this.audioAssetsArray, boundCallback);
        this.bufferLoader.load();

    };

    AudioController.prototype.finishLoading = function finishLoading(bufferList) {

        //console.log('AudioController.finishLoading', bufferList);

        var event = new CustomEvent('AppAudioLoaded', {
            "detail": {
                bufferList: bufferList
            },
            bubbles: true,
            cancelable: false
        });

        document.dispatchEvent(event);

    };

    AudioController.prototype.play = function play(data) {

        //console.log('AudioController.play', data);

        if (this.bufferLoader.bufferList[data.index]) {
            setTimeout(function() {
                var sound = this.context.createBufferSource();
                sound.buffer = this.bufferLoader.bufferList[data.index];
                sound.connect(this.context.destination);
                sound.start(data.index);
            }.bind(this), data.delay);
        }

    };

    return AudioController;

});
