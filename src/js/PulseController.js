define(function(require) {

    'use strict';

    var Model = require('src/js/PulseModel'),
        View = require('src/js/PulseView');

    function PulseController() {

        this.model = new Model(this);
        this.container = document.getElementById('pulses');
        this.instance = this;
        this.setupEvents();

    }

    PulseController.prototype.setupEvents = function setupEvents() {

        var boundAppReadyHandler = this.handleAppReady.bind(this),
            boundMouseMoveHandler = this.handleMouseMove.bind(this);

        document.addEventListener('AppReady', boundAppReadyHandler, false);
        document.addEventListener("mousemove", boundMouseMoveHandler, false);

    };

    PulseController.prototype.handleMouseMove = function handleMouseMove(e) {

        //console.log('PulseController.handleMouseMove', e);

        var cx = Math.ceil(window.innerWidth / 2),
            cy = Math.ceil(window.innerHeight / 2),
            dx = e.pageX - cx,
            dy = e.pageY - cy,
            tiltx = (dy / cy),
            tilty = -(dx / cx),
            radius = Math.sqrt(Math.pow(tiltx, 2) + Math.pow(tilty, 2)),
            degree = (radius * 20);

        this.container.style[this.vendorPrefix + 'Transform'] = 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)';
        this.container.style.transform = 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)';
        this.container.style[this.vendorPrefix + 'TransformStyle'] = 'preserve-3d';
        this.container.style.transformStyle = 'preserve-3d';
        this.container.style[this.vendorPrefix + 'BackfaceVisibility'] = 'hidden';
        this.container.style.backfaceVisibility = 'hidden';

    };

    PulseController.prototype.handleAppReady = function handleAppReady(e) {

        //console.log('PulseController.handleAppReady', e);

        this.isTouchDevice = e.detail.isTouchDevice;
        this.vendorPrefix = e.detail.vendorPrefix;

    };

    PulseController.prototype.fire = function(data) {

        //console.log('PulseController.fire', data);

        this.model.add(data);

    };

    return PulseController;

});
