define(function(require) {

    'use strict';

    var Model = require('src/js/RingModel'),
        View = require('src/js/RingView');

    function RingController() {

        this.model = new Model(this);
        this.instance = this;
        this.resizeTimer = null;
        this.ringContainer1 = document.getElementById('ring1');
        this.ringContainer2 = document.getElementById('ring2');
        this.ringContainer3 = document.getElementById('ring3');
        this.ringContainer4 = document.getElementById('ring4');

        var boundAppReadyHandler = this.handleAppReady.bind(this);

        document.addEventListener('AppReady', boundAppReadyHandler, false);

    }

    RingController.prototype.setupEvents = function setupEvents() {

        //console.log('RingController.setupEvents');

        var boundDOMNodeInsertedHandler = this.handleDOMNodeInserted.bind(this),
            boundResizeHandler = this.handleResize.bind(this),
            boundMouseMoveHandler = this.handleMouseMove.bind(this);

        window.addEventListener('resize', boundResizeHandler, false);
        document.addEventListener("mousemove", boundMouseMoveHandler, false);
        document.addEventListener('DOMNodeInserted', boundDOMNodeInsertedHandler, false);

    };

    RingController.prototype.handleMouseMove = function handleMouseMove(e) {

        //console.log('RingController.handleMouseMove', e);

        var cx = Math.ceil(window.innerWidth / 2),
            cy = Math.ceil(window.innerHeight / 2),
            dx = e.pageX - cx,
            dy = e.pageY - cy,
            tiltx = (dy / cy),
            tilty = -(dx / cx),
            radius = Math.sqrt(Math.pow(tiltx, 2) + Math.pow(tilty, 2)),
            degree = (radius * 20);

        this.ringContainer1.style[this.vendorPrefix + 'Transform'] = 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg) translateZ(-100px)';
        this.ringContainer1.style.transform = 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg) translateZ(-100px)';

        this.ringContainer2.style[this.vendorPrefix + 'Transform'] = 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg) translateZ(-80px)';
        this.ringContainer2.style.transform = 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg) translateZ(-80px)';

        this.ringContainer3.style[this.vendorPrefix + 'Transform'] = 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg) translateZ(-60px)';
        this.ringContainer3.style.transform = 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg) translateZ(-60px)';

        this.ringContainer4.style[this.vendorPrefix + 'Transform'] = 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg) translateZ(-40px)';
        this.ringContainer4.style.transform = 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg) translateZ(-40px)';

    };

    RingController.prototype.handleDOMNodeInserted = function handleDOMNodeInserted(e) {

        //console.log('RingController.handleDOMNodeInserted', e);

        var ringId = null;

        if (e.target.classList.contains('ring')) {

            ringId = e.target.id;

            this.model.expandById(ringId);

        }

    };

    RingController.prototype.handleResize = function handleResize(e) {

        //console.log('RingController.handleResize', e);

        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }

        this.resizeTimer = setTimeout(function() {
            this.model.resize();
        }.bind(this), 300);

    };

    RingController.prototype.handleAppReady = function handleAppReady(e) {

        //console.log('RingController.handleAppReady', e);

        this.isTouchDevice = e.detail.isTouchDevice;
        this.vendorPrefix = e.detail.vendorPrefix;
        this.browser = e.detail.browser;

        this.setupEvents();

    };

    RingController.prototype.closeByRefId = function closeByRefId(id) {

        //console.log('RingController.closeByRefId', id);

        this.model.closeRingsByRefId(id);

    };

    RingController.prototype.fire = function(data) {

        //console.log('RingController.show', data);

        this.model.add(data);

    };

    return RingController;

});
