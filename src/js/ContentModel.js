define(function(require) {

    'use strict';

    var data = require('json!src/json/data.json'),
        ContentItemView = require('src/js/ContentItemView'),
        Rings = require('src/js/RingController'),
        SlidesController = require('src/js/SlidesController');

    function ContentModel(controller) {

        this.rings = new Rings();
        this.slides = new SlidesController();

        this.delay = 0.09;
        this.instance = this;
        this.controller = controller;
        this.data = data;
        this.content = {};
        this.active = null;
        this.childRadius = null;

        this.calculateChildRadius();

        this.init();

    }

    ContentModel.prototype.init = function init() {

        this.setupContent();

    };

    ContentModel.prototype.calculateChildRadius = function calculateChildRadius() {

        //console.log('ContentModel.calculateChildRadius');

        this.childRadius = (0.5 + (Math.min(window.innerWidth, window.innerHeight) / 3.5) >> 0);

        for (var item in this.content) {

            if (this.content.hasOwnProperty(item)) {

                if (this.content[item].hasChildren()) {

                    this.setChildShowCoordinates(this.content[item]);

                }

                if (this.content[item].x === 0 && this.content[item].y === 0 && this.content[item].isVisible()) {

                    this.content[item].s = (this.childRadius / 200);

                    this.content[item].update();

                }

            }

        }

    };

    ContentModel.prototype.setupContent = function setupContent() {

        var content = null,
            childId = null;

        for (var item in this.data) {

            if (this.data.hasOwnProperty(item)) {

                this.set(this.data[item]);

                for (var i = 0; i < this.data[item].children.length; i++) {

                    this.set(this.data[this.data[item].children[i]]);

                }

            }

        }

        setTimeout(function() {
            this.setupChildren();
        }.bind(this), 30);

    };

    ContentModel.prototype.setupChildren = function() {

        //console.log('ContentModel.setupChildren');

        for (var item in this.content) {

            if (this.content.hasOwnProperty(item) && this.content[item].hasChildren()) {

                this.setChildShowCoordinates(this.content[item]);

            }

        }

        setTimeout(function() {
            this.dataReady();
        }.bind(this), 30);

    };

    ContentModel.prototype.update = function update(contentItem) {

        //console.log('ContentModel.update', contentItem);

        if (this.active) {
            this.active.deactivate();
            if (this.childrenAreVisible(this.active)) {
                this.hideChildren(this.active);
            }
            if (!this.active.isSlide() && location.hash.length > 1) {
                this.active.hide();
            }
            this.active = null;
        }

        if (!contentItem.isVisible() && !contentItem.isSlide()) {
            contentItem.show();
        }

        contentItem.activate();
        this.active = this.content[contentItem.id];

        if (contentItem.isSlide()) {

            this.openSlide(contentItem);

        }

        if (contentItem.hasChildren()) {
            this.showChildren(contentItem);
        }

    };

    ContentModel.prototype.showInitial = function showInitial() {

        //console.log('ContentModel.showInitial');

        this.content.home.deactivate();
        this.content.home.show();
        this.active = null;
        this.rings.closeByRefId(this.content.home.id);

    };

    ContentModel.prototype.openSlide = function openSlide(contentItem) {

        //console.log('ContentModel.openSlideAt', parentObj, contentItem);

        var slide = null,
            i = 0,
            slides = [];

        slides.push(this.content[contentItem.id]);

        setTimeout(function() {
            this.slides.start(slides);
        }.bind(this), 200);

    };

    ContentModel.prototype.showChildren = function showChildren(parentObj) {

        //console.log('ContentModel.showChildren', parentObj.id);

        var item = null,
            contentId = null,
            childCount = parentObj.children.length,
            i = 0;

        this.rings.fire({
            cid: 'ring1',
            image: 'src/images/degrees7_116492.png',
            targetOpacity: 0.2,
            id: parentObj.id,
            d: 0.3,
            sAdd: 1.25
        });

        this.rings.fire({
            cid: 'ring2',
            image: 'src/images/degrees6a_116492.png',
            targetOpacity: 0.4,
            id: parentObj.id,
            d: 0.0,
            sAdd: 0.47
        });

        this.rings.fire({
            cid: 'ring3',
            image: 'src/images/degrees5_116492.png',
            targetOpacity: 0.6,
            id: parentObj.id,
            d: 0.1,
            sAdd: 0.52
        });

        this.rings.fire({
            cid: 'ring4',
            image: 'src/images/degrees9_116492.png',
            targetOpacity: 0.8,
            id: parentObj.id,
            d: 0.2,
            sAdd: 0.59
        });

        setTimeout(function() {
            for (; i < childCount; i++) {

                contentId = parentObj.children[i];

                item = this.content[contentId];

                if (!item.el.parentNode) {

                    item.reset().insert();

                } else {

                    item.showAsChild();

                }

            }
        }.bind(this), 600);

    };

    ContentModel.prototype.setChildShowCoordinates = function setChildShowCoordinates(parentObj) {

        //console.log('ContentModel.setChildShowCoordinates', parentObj);

        var childCount = parentObj.children.length,
            step = (2 * Math.PI) / childCount,
            angle = -1.57,
            content = null,
            delay = 0,
            i = null;

        for (i = 0; i < childCount; i++) {

            content = this.content[parentObj.children[i]];

            content.childRadius = this.childRadius;
            content.showX = (content.width / 2 + content.childRadius * Math.cos(angle) - content.width / 2);
            content.showY = (content.height / 2 + content.childRadius * Math.sin(angle) - content.height / 2);
            content.transitionDelay = content.defaults.transitionDelay = delay;
            content.angle = (Math.atan2(content.showY, content.showX) * 180 / Math.PI);
            content.s = (content.childRadius / 400);

            angle += step;
            delay += this.delay;

            if (this.active && this.active.id === content.parent) {
                content.x = content.showX;
                content.y = content.showY;
                content.update();
            }

        }

    };

    ContentModel.prototype.hideChildren = function hideChildren(parentObj) {

        //console.log('ContentModel.hideChildren', parentObj);

        var childCount = parentObj.children.length,
            contentItem = null;

        this.rings.closeByRefId(parentObj.id);

        if (parentObj.hasChildren()) {

            for (var i = 0; i < childCount; i++) {

                contentItem = this.content[parentObj.children[i]];

                if (this.active && this.active.id !== contentItem.id) {

                    contentItem.hide();

                }

            }

        }

    };

    ContentModel.prototype.childrenAreVisible = function childrenAreVisible(contentItem) {

        var result = false,
            item = null;

        for (var i = 0; i < contentItem.children.length; i++) {
            if (this.content.hasOwnProperty(contentItem.children[i]) && this.content[contentItem.children[i]].isVisible()) {
                result = true;
            }
        }

        return result;

    };

    ContentModel.prototype.set = function set(contentObj) {

        var content = new ContentItemView(contentObj, this.controller);

        this.content[content.id] = content;
        this.content[content.id].reset().update().attach();

    };

    ContentModel.prototype.get = function get(contentId) {

        //console.log('ContentModel.get', contentId);

        if (!contentId || contentId === "") {
            return null;
        }

        return (contentId in this.content) ? this.content[contentId] : null;

    };

    ContentModel.prototype.dataReady = function dataReady() {
        setTimeout(function() {
            //console.log('AppDataReady: fired');
            var event = new CustomEvent("AppDataReady", {
                "detail": null,
                bubbles: true,
                cancelable: false
            });
            document.dispatchEvent(event);
        }.bind(this), 1);
    };

    return ContentModel;

});
