define(function(require) {

    'use strict';

    var Model = require('src/js/ContentModel'),
        Pulse = require('src/js/PulseController'),
        Motion = require('src/js/MotionController');

    function ContentController() {

        this.resizeTimer = null;
        this.motionTimer = null;
        this.container = document.getElementById('main');
        this.model = new Model(this);
        this.pulse = new Pulse();
        this.motion = new Motion();

        var boundAppReadyHandler = this.handleAppReady.bind(this);

        document.addEventListener('AppReady', boundAppReadyHandler, false);

    }

    ContentController.prototype.setupEvents = function setupEvents() {

        //console.log('ContentController.setupEvents');

        var boundDOMNodeInsertedHandler = this.handleDOMNodeInserted.bind(this),
            boundResizeHandler = this.handleResize.bind(this),
            boundAppHashChangeHandler = this.handleAppHashChangeEvent.bind(this),
            boundMouseMoveHandler = this.handleMouseMove.bind(this),
            boundMotionEventHandler = this.handleMotionEvent.bind(this);

        window.addEventListener('resize', boundResizeHandler, false);
        window.addEventListener('AppHashChange', boundAppHashChangeHandler, false);
        document.addEventListener('DOMNodeInserted', boundDOMNodeInsertedHandler, false);

        if (!this.browser.isDesktop && this.motion.hasDeviceMotion) {
            console.log('atach motion listener');
            this.motion.start();
            window.addEventListener('motion', boundMotionEventHandler, false);
        } else {
            console.log('atache mouse listener');
            document.addEventListener("mousemove", boundMouseMoveHandler, false);
        }

        return this;

    };

    ContentController.prototype.handleMotionEvent = function handleMotionEvent(e) {

        console.log('ContentController.handleMotionEvent', e.detail.x, e.detail.y);

        var cx = Math.ceil(window.innerWidth / 2),
            cy = Math.ceil(window.innerHeight / 2),
            dx = e.detail.x - cx,
            dy = e.detail.y - cy,
            tiltx = (dy / cy),
            tilty = -(dx / cx),
            radius = Math.sqrt(Math.pow(tiltx, 2) + Math.pow(tilty, 2)),
            degree = (radius * 20);

        console.log(tiltx, tilty, degree);

        this.updateContainer(tiltx, tilty, degree);

    };

    ContentController.prototype.handleAppHashChangeEvent = function handleAppHashChangeEvent(e) {

        //console.log('ContentController.handleAppHashChangeEvent', this, e.detail.newHash);

        var id = e.detail.newHash.replace(/\//g, ''),
            content = this.model.get(id);

        this.model.update(content);

    };

    ContentController.prototype.handleResize = function handleResize(e) {

        //console.log('ContentController.handleResize', e);

        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }

        this.resizeTimer = setTimeout(function() {
            this.model.calculateChildRadius();
        }.bind(this), 200);

    };

    ContentController.prototype.handleDOMNodeInserted = function(e) {

        //console.log('ContentController.handleDOMNodeInserted', e);

        if (e.relatedNode.id === 'main' && e.target.classList.contains('item')) {
            var item = this.model.get(e.target.id.replace('content-', '')),
                hashId = location.hash.replace(/#/g, '').replace(/\//g, '');
            if (hashId !== item.id) {
                item.showAsChild();
            }
        }

    };

    ContentController.prototype.handleAppReady = function handleAppReady(e) {

        //console.log('ContentController.handleAppReady', e, location.hash);

        var hash = location.hash.substr(1).replace(/\//g, ''),
            content = (hash in this.model.content) ? this.model.content[hash] : this.model.content.home;

        this.isTouchDevice = e.detail.isTouchDevice;
        this.vendorPrefix = e.detail.vendorPrefix;
        this.browser = e.detail.browser;

        setTimeout(function() {
            if (hash === '') {
                this.model.showInitial();
            } else {
                this.model.update(content);
            }
        }.bind(this), 30);

        this.init();

    };

    ContentController.prototype.handleInteractStart = function handleInteractStart(e) {

        //console.log('ContentController.handleInteractStart', e.target.parentNode.id);

        var contentElement = e.target.parentNode,
            contentItem = this.model.get(contentElement.id.replace('content-', '')),
            hash = null;

        if (contentItem) {

            this.pulse.fire({
                w: contentItem.width,
                h: contentItem.height,
                x: contentItem.x,
                y: contentItem.y,
                s: contentItem.s,
                id: contentItem.id
            });

            if (contentItem.active) {
                contentItem.playSound(8); // play only when manually deactivating
                hash = contentItem.path.split('/');
                hash.pop();
                location.hash = hash.join('/');
            } else {
                if ('href' in contentItem) {
                    window.open(contentItem.href);
                }
                location.hash = contentItem.path;
            }

        }

        e.preventDefault();

    };

    ContentController.prototype.handleMouseMove = function handleMouseMove(e) {

        //console.log('ContentController.handleMouseMove', e);

        var cx = Math.ceil(window.innerWidth / 2),
            cy = Math.ceil(window.innerHeight / 2),
            dx = e.pageX - cx,
            dy = e.pageY - cy,
            tiltx = (dy / cy),
            tilty = -(dx / cx),
            radius = Math.sqrt(Math.pow(tiltx, 2) + Math.pow(tilty, 2)),
            degree = (radius * 20);

        this.updateContainer(tiltx, tilty, degree);

    };

    ContentController.prototype.updateContainer = function updateContainer(tiltx, tilty, degree) {

        //console.log('ContentController.updateContainer', tiltx, tilty, degree);

        this.container.style[this.vendorPrefix + 'Transform'] = 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)';
        this.container.style.transform = 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)';
        this.container.style[this.vendorPrefix + 'TransformStyle'] = 'preserve-3d';
        this.container.style.transformStyle = 'preserve-3d';
        this.container.style[this.vendorPrefix + 'BackfaceVisibility'] = 'hidden';
        this.container.style.backfaceVisibility = 'hidden';

    };

    ContentController.prototype.init = function init() {

        this.setupEvents();

    };

    return ContentController;

});
