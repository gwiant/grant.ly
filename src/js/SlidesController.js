define(function(require) {

    'use strict';

    var Model = require('src/js/SlidesModel');

    function SlidesController() {

        console.log('new SlidesController');

        this.instance = this;
        this.container = document.getElementById('slides');
        this.closeButton = document.getElementById('slidesCloseButton');
        this.isTouchDevice = null;
        this.vendorPrefix = null;
        this.model = new Model(this);
        this.setupEvents();

    }

    SlidesController.prototype.setupEvents = function setupEvents() {

        var boundAppReadyHandler = this.handleAppReady.bind(this);

        document.addEventListener('AppReady', boundAppReadyHandler);

    };

    SlidesController.prototype.handleAppReady = function handleAppReady(e) {

        this.isTouchDevice = e.detail.isTouchDevice;
        this.vendorPrefix = e.detail.vendorPrefix;

        this.setupEvents();

    };

    SlidesController.prototype.setupEvents = function setupEvents() {

        //console.log('SlidesController.setupEvents', this);

        var boundCloseInteractStartHandler = this.handleCloseInteractStart.bind(this),
            boundAppHashChangeHandler = this.handleAppHashChange.bind(this);

        if (this.isTouchDevice) {
            this.closeButton.addEventListener('touchstart', boundCloseInteractStartHandler, false);
        } else {
            this.closeButton.addEventListener('mousedown', boundCloseInteractStartHandler, false);
        }
        document.addEventListener('AppHashChange', boundAppHashChangeHandler, false);

    };

    SlidesController.prototype.handleAppHashChange = function handleAppHashChange(e) {

        //console.log('SlidesController.handleAppHashChange', e);

        var hashId = e.detail.newHash.replace(/\//g, '');

        if (!this.model.isSlideId(hashId)) {
            this.model.unload();
            this.hide();
        }

    };

    SlidesController.prototype.handleImageLoad = function handleImageLoad(e) {

        //console.log('SlidesController.handleImageLoad', e);

        this.model.incrementLoadCount(e.target.parentNode.id.replace('slide', ''));

        if (this.model.imagesLoaded()) {
            this.show();
        }

    };

    SlidesController.prototype.handleCloseInteractStart = function handleCloseInteractStart(e) {

        //console.log('SlidesController.handleCloseInteractStart', e);

        this.container.classList.remove('show');

        setTimeout(function() {
            var hashArray = location.hash.substr(1).split('/');
            hashArray.pop();

            this.hide();
            location.hash = hashArray.join('/');
        }.bind(this), 500);

    };

    SlidesController.prototype.show = function show() {

        //console.log('SlidesController.show');

        setTimeout(function() {
            this.container.classList.add('show');
        }.bind(this), 30);

    };

    SlidesController.prototype.start = function start(slidesArray) {

        //console.log('SlidesController.start');

        this.container.style.display = 'block';

        this.model.load(slidesArray);

    };

    SlidesController.prototype.hide = function hide() {

        //console.log('SlidesController.hide');

        this.container.classList.remove('show');
        this.container.style.display = 'none';

        setTimeout(function() {
            this.model.unload();
        }.bind(this), 30);

    };

    return SlidesController;

});
