define(function(require) {

    'use strict';

    function Loader(assets) {

        this.assets = assets;
        this.loadCount = 0;
        this.total = 0;
        this.percentComplete = 0;
        this.id = Math.floor((Math.random() * 9000000) + 1000000);
        this.boundLoadHandler = this.handleLoad.bind(this);
        this.getTotal().start();

    }

    Loader.prototype.getTotal = function getTotal() {

        console.log('Loader.calcTotalAcount');

        for (var type in this.assets) {
            if (this.assets.hasOwnProperty(type)) {
                for (var i = 0; i < this.assets[type].length; i++) {
                    this.total += 1;
                }
            }
        }

        return this;

    };

    Loader.prototype.handleLoad = function handleLoad(e) {

        console.log('Loader.handleLoad', e);

        this.increment();

    };

    Loader.prototype.triggerEvent = function triggerEvent(eventType, detailObj) {

        console.log('Loader.triggerEvent', eventType, detailObj);

        var event = new CustomEvent(eventType, {
            "detail": (detailObj || null),
            bubbles: true,
            cancelable: false
        });

        return document.dispatchEvent(event);

    };

    Loader.prototype.increment = function increment() {

        console.log('Loader.increment');

        this.loadCount += 1;
        this.percentComplete = 100 * (this.loadCount / this.total);

        if (this.loadCount === this.total) {
            this.triggerEvent('LoadComplete', {
                percentComplete: this.percentComplete,
                id: this.id
            });
        } else {
            this.triggerEvent('LoadIncrement', {
                percentComplete: this.percentComplete,
                id: this.id
            });
        }

    };

    Loader.prototype.requestFile = function requestFile(fileUrl) {

        console.log('Loader.requestFile');

        var request = new XMLHttpRequest();
        request.open("GET", fileUrl, true);
        request.onload = this.boundLoadHandler;
        request.send(null);

    };

    Loader.prototype.start = function start() {

        console.log('Loader.start');

        for (var type in this.assets) {
            if (this.assets.hasOwnProperty(type)) {
                for (var i = 0; i < this.assets[type].length; i++) {
                    this.requestFile(this.assets[type][i]);
                }
            }
        }

    };

    return Loader;

});
