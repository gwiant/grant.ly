// copyright 2014 grant wiant : grant@grant.ly
define(function(require) {

    'use strict';

    var fontello = require('css!src/css/fontello'),
        fontelloAnimation = require('css!src/css/animation'),
        style = require('less!src/less/style'),
        ContentController = require('src/js/ContentController'),
        BreadcrumbsController = require('src/js/BreadcrumbsController'),
        Audio = require('src/js/AudioController'),
        Loader = require('src/js/Loader');

    function AppController() {

        this.assets = {
            audio: [
                "src/audio/mp3/tiny0.mp3",
                "src/audio/mp3/beep-6.mp3",
                "src/audio/mp3/simple-soft-tone-blip-reverb.mp3",
                "src/audio/mp3/alien-bright-power-noise.mp3",
                "src/audio/mp3/sci-fi-sfx-30.mp3",
                "src/audio/mp3/alien-bright-power-noise-reverse.mp3",
                "src/audio/mp3/sci-fi-data-input-chatter-effe.mp3",
                "src/audio/mp3/interface-multimedia-beep-1.mp3",
                "src/audio/mp3/interface-multimedia-beep-2.mp3"
            ],
            images: [
                'src/images/degrees7_116492.png',
                'src/images/degrees6a_116492.png',
                'src/images/degrees5_116492.png',
                'src/images/degrees9_116492.png',
                'src/images/inner-shadow2.png'
            ]
        };

        this.loader = new Loader(this.assets);
        this.appSpinner = document.getElementById('appLoadingSpinner');
        this.isTouchDevice = 'ontouchstart' in document.body;
        this.vendorPrefix = this.getVendorPrefix();

        this.ua = window.navigator.userAgent.toLowerCase();

        this.browser = {};
        this.browser.isIE = /*@cc_on!@*/ false; // thank you Dean Edwards!
        this.browser.isIOS = /(iPad|iPhone|iPod)/g.test(this.ua);
        this.browser.isWindows = /windows/.test(this.ua);
        this.browser.isAndroid = /android/.test(this.ua);
        this.browser.isWebkit = /webkit/.test(this.ua);
        this.browser.isSafari = (/safari/.test(this.ua) && !/chrome/.test(this.ua)) ? true : false;
        this.browser.isChrome = /chrome/.test(this.ua);
        this.browser.isOpera = /opera|opr/.test(this.ua);
        this.browser.isFirefox = /firefox/.test(this.ua);
        this.browser.isDesktop = !('ontouchstart' in window);
        this.browser.hasDeviceMotion = window.hasOwnProperty('DeviceMotionEvent');
        this.audioReady = false;

        this.cutTheMustard(function() {
            this.init();
        });

    }

    AppController.prototype.init = function init() {

        //console.log('AppController.init');

        this.audio = new Audio(this.assets.audio);
        this.audioReady = true;

        this.breadcrumbs = new BreadcrumbsController();
        //this.audio = new AudioController();
        this.content = new ContentController();

        this.setupEvents();

    };

    AppController.prototype.handleCallback = function handleCallback(callback) {

        if (callback) {
            setTimeout(function() {
                callback.apply(this);
            }.bind(this), this.transitionTime);
        }

    };

    AppController.prototype.setupEvents = function setupEvents() {

        //console.log('AppController.setupEvents');

        var boundHashChangeHandler = this.handleHashChange.bind(this),
            boundBodyInteractStartHandler = this.handleBodyInteractStart.bind(this),
            boundLoadCompleteHandler = this.handleLoadComplete.bind(this);

        window.addEventListener("hashchange", boundHashChangeHandler, false);

        if (this.isTouchDevice) {
            document.addEventListener('touchstart', boundBodyInteractStartHandler, false);
        } else {
            document.addEventListener('click', boundBodyInteractStartHandler, false);
        }

        document.addEventListener('LoadComplete', boundLoadCompleteHandler, false);

    };

    AppController.prototype.handleLoadComplete = function handleLoadComplete(e) {

        //console.log('AppController.handleAppAudioLoaded', e);

        this.audioReady = true;

        this.removeAppSpinner();

        this.triggerEvent('AppReady', {
            isTouchDevice: this.isTouchDevice,
            vendorPrefix: this.vendorPrefix,
            browser: this.browser
        });

    };

    AppController.prototype.removeAppSpinner = function removeAppSpinner() {

        this.appSpinner.parentNode.removeChild(this.appSpinner);

    };

    AppController.prototype.handleBodyInteractStart = function handleBodyInteractStart(e) {

        //console.log('AppController.handleBodyInteractStart', e);

    };

    AppController.prototype.handleHashChange = function handleHashChange(e) {

        //console.log('AppController.handleHashChange', e);

        var newHash = e.newURL.split('#')[1];

        this.triggerEvent('AppHashChange', {
            newHash: newHash
        });

    };

    AppController.prototype.cutTheMustard = function cutTheMustard(callback) {

        //console.log('AppController.cutTheMustard');

        if ('XMLHttpRequest' in window && 'classList' in document.body && 'addEventListener' in document &&
            'CustomEvent' in window && !!Function.prototype.bind) {
            this.handleCallback(callback);
        } else {
            this.removeAppSpinner();
            this.betterBrowserMessaage();
            console.error('upgrade browser');
        }

    };

    AppController.prototype.betterBrowserMessaage = function betterBrowserMessaage() {

        console.log('AppController.betterBrowserMessaage');

        var message = document.createElement('div');
        message.style.position = 'absolute';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.width = '300px';
        message.style.height = '220px';
        message.style.margin = '-110px 0 0 -150px';
        message.style.border = '1px solid #0d6b88';
        message.style.borderRadius = '11px';
        message.style.textAlign = 'center';
        message.style.color = '#08fbff';
        message.innerHTML = '<h2>Sorry!</h2><p>This site requires features that your browser doesn\'t support: XMLHttpRequest, ClassList, AddEventListener, CustomEvent, Function.bind.</p><p>Try again with: <a href="http://www.google.com/chrome/">Chrome</a> or <a href="https://www.apple.com/safari/">Safari</a></p>';

        document.body.appendChild(message);

    };

    AppController.prototype.getVendorPrefix = function getVendorPrefix() {

        //console.log('AppController.getVendorPrefix');

        var styles = window.getComputedStyle(document.documentElement, ''),
            prefix = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];

        return prefix;

    };

    AppController.prototype.triggerEvent = function triggerEvent(eventName, detailObj) {

        if (!eventName) {
            return false;
        }

        var event = new CustomEvent(eventName, {
            "detail": (detailObj || null),
            bubbles: true,
            cancelable: false
        });

        return document.dispatchEvent(event);

    };

    return new AppController();

});
