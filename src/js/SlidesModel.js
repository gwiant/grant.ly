define(function(require) {

    'use strict';

    var View = require('src/js/SlideView');

    function SlidesModel(controller) {

        this.instance = this;
        this.controller = controller;
        this.count = 0;
        this.loadCount = 0;
        this.data = {};

    }

    SlidesModel.prototype.incrementLoadCount = function incrementLoadCount(id) {

        //console.log('SlidesModel.incrementLoadCount', id, this.data);

        this.loadCount += 1;

        if (id in this.data) {
            this.data[id].removeImage();
        }

    };

    SlidesModel.prototype.imagesLoaded = function imagesLoaded() {

        return (this.count === this.loadCount) ? true : false;

    };

    SlidesModel.prototype.unload = function() {

        //console.log('SlidesModel.unload');

        var slide = null;

        this.count = 0;
        this.loadCount = 0;

        for (slide in this.data) {
            this.data[slide].detach();
            delete this.data[slide];
        }

    };

    SlidesModel.prototype.isSlideId = function isSlideId(id) {

        //console.log('SlidesModel.isSlideId', id, this.data);

        return (this.data.hasOwnProperty(id)) ? true : false;

    };

    SlidesModel.prototype.load = function load(slidesArray) {

        //console.log('SlidesModel.load', slidesArray);

        this.count = slidesArray.length;
        this.loadCount = 0;

        for (var i = 0; i < slidesArray.length; i++) {
            this.data[slidesArray[i].id] = new View(slidesArray[i], i, this.controller);
        }

    };

    return SlidesModel;

});
