define(function(require) {

    'use strict';

    var BaseView = require('src/js/BaseView');

    function ContentItemView(contentItemObj, controller) {

        //console.log("New ContentItemView", contentItemObj);

        var value = null;

        this.instance = this;
        this.controller = controller;
        this.el = null;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.o = 0; // opacity
        this.s = 0; // scale
        this.showX = 0;
        this.showY = 0;
        this.angle = 0;
        this.width = 200;
        this.height = 200;

        this.defaults = {};
        this.defaults.transitionTime = 0.681;
        this.defaults.transitionDelay = 0;

        this.transitionTime = this.defaults.transitionTime;
        this.transitionDelay = 0;

        this.active = false;
        this.inTransition = false;

        this.container = document.getElementById('main');

        for (value in contentItemObj) {
            if (contentItemObj.hasOwnProperty(value)) {
                this[value] = contentItemObj[value];
            }
        }

        this.init();

    }

    ContentItemView.prototype = new BaseView();

    ContentItemView.prototype.init = function init() {

        this.generate();

    };

    ContentItemView.prototype.activate = function activate() {

        //console.log('ContentItemView.activate', this.id);

        this.active = true;
        this.el.classList.add('active');
        this.playSound(7);

    };

    ContentItemView.prototype.hide = function hide() {

        //console.log('ContentItemView.hide', this.id);

        this.reset().update();

    };

    ContentItemView.prototype.deactivate = function deactivate() {

        //console.log('ContentItemView.deactivate', this.id);

        this.active = false;
        this.el.classList.remove('active');
        //this.playSound(8);

    };

    ContentItemView.prototype.setPosition = function setPosition(x, y, s, o, td, callback, callbackdelay) {

        //console.log('ContentItemView.setPosition', this.id, x, y, s, o, td);

        this.x = (x || this.x);
        this.y = (y || this.y);
        this.s = (s || this.s);
        this.o = (o || this.o);
        this.transitionDuration = (td || this.transitionDuration);
        this.update();

        this.handleCallbackWithDelay(callback, callbackdelay);

    };

    ContentItemView.prototype.show = function show() {

        //console.log('ContentItemView.show', this.id);

        this.setPosition(0, 0, 0, 0, 0, function() {
            this.reset();
            this.setPosition(0, 0, (this.controller.model.childRadius / 200), 1, 0.681);
        }.bind(this), 30);

    };

    ContentItemView.prototype.insert = function() {

        //console.log('ContentItemView.insert', this.id);

        this.reset();

        if (this.el.parentNode) {
            this.update();
        } else {
            this.update().attach();
        }

    };

    ContentItemView.prototype.attach = function attach() {

        //console.log('ContentItemView.attach');

        //console.log('attaching', this.el.style.transform, this.el.style.opacity);

        if (this.container && 'lastChild' in this.container) {
            this.container.insertBefore(this.el, this.container.lastChild);
        } else if (this.container) {
            this.container.appendChild(this.el);
        }

        return this;

    };

    ContentItemView.prototype.handleCallbackWithDelay = function handleCallbackWithDelay(callback, delay) {

        //console.log('ContentModel.handleCallbackWithDelay', callback, delay);

        if (callback) {
            setTimeout(function() {
                callback.apply(callback.instance);
            }, delay || this.transitionTime * 1000);
        }

    };

    ContentItemView.prototype.update = function update() {

        //console.log('ContentItemView.update', this.id, this.x, this.y, this.z, this.s, this.o);

        this.inTransition = true;

        this.el.style.display = 'block';

        this.el.style[this.controller.vendorPrefix + 'Transform'] = 'translate3d(' + (this.x - 1) + 'px, ' + (this.y - 1) + 'px, ' + this.z + 'px) scale(' + this.s + ',' + this.s + ')';
        this.el.style.transform = 'translate3d(' + (this.x - 1) + 'px, ' + (this.y - 1) + 'px, ' + this.z + 'px) scale(' + this.s + ',' + this.s + ')';

        this.el.children[0].style[this.controller.vendorPrefix + 'Transform'] = 'translate3d(0px, 0px, 0px) rotate(' + (this.angle + 90) + 'deg)';
        this.el.children[0].style.transform = 'translate3d(0px, 0px, 0px) rotate(' + (this.angle + 90) + 'deg)';

        this.el.style[this.controller.vendorPrefix + 'TransitionDuration'] = this.transitionDuration + 's';
        this.el.style.transitionDuration = this.transitionDuration + 's';

        this.el.style[this.controller.vendorPrefix + 'TransitionDelay'] = this.transitionDelay + 's';
        this.el.style.transitionDelay = this.transitionDelay + 's';

        this.el.style[this.controller.vendorPrefix + 'TransformStyle'] = 'preserve-3d';
        this.el.style.transformStyle = 'preserve-3d';

        this.el.style[this.controller.vendorPrefix + 'BackfaceVisibility'] = 'hidden';
        this.el.style.backfaceVisibility = 'hidden';

        this.el.style.opacity = this.o;

        return this;

    };

    ContentItemView.prototype.generate = function() {

        var borderElement = document.createElement('div'),
            iconElement = document.createElement('div'),
            connectorElement = document.createElement('div'),
            boundInteractStartHandler = this.controller.handleInteractStart.bind(this.controller),
            boundTransitionEndHandler = this.handleTransitionEnd.bind(this);

        borderElement.classList.add('border');
        iconElement.classList.add('icon');
        connectorElement.classList.add('connector');

        if (this.icon) {
            iconElement.classList.add(this.icon);
        } else {
            iconElement.appendChild(document.createTextNode(this.label));
        }

        this.el = document.createElement('a');
        this.el.href = '#' + this.path;
        this.el.id = 'content-' + this.id;
        this.el.appendChild(connectorElement);
        this.el.appendChild(iconElement);
        this.el.appendChild(borderElement);
        this.el.classList.add('item');
        this.el.classList.add('no-connector');
        this.el.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, false);

        if (this.controller.isTouchDevice) {
            this.el.addEventListener('touchstart', boundInteractStartHandler, false);
        } else {
            this.el.addEventListener('mousedown', boundInteractStartHandler, false);
        }

        this.el.addEventListener('transitionend', boundTransitionEndHandler, false);
        this.el.addEventListener(this.controller.vendorPrefix + 'transitionend', boundTransitionEndHandler, false);

    };

    ContentItemView.prototype.isVisible = function isVisible() {

        return (this.el && this.el.parentNode && this.s > 0 && this.o > 0) ? true : false;

    };

    ContentItemView.prototype.isCentered = function isCentered() {

        return (this.x === 0 && this.y === 0) ? true : false;

    };

    ContentItemView.prototype.hasChildren = function hasChildren() {

        return (this.children && this.children.length > 0) ? true : false;

    };

    ContentItemView.prototype.isSlide = function isSlide() {

        return (this.hasOwnProperty('image')) ? true : false;

    };

    ContentItemView.prototype.reset = function reset() {

        //console.log('ContentItemView.reset', this.id);

        this.transitionTime = this.defaults.transitionTime;
        this.transitionDelay = 0;
        this.x = 0;
        this.y = 0;
        this.s = 0;
        this.o = 0;
        this.el.classList.add('no-connector');

        return this;

    };

    ContentItemView.prototype.showAsChild = function showAsChild() {

        //console.log('ContentItemView.showAsChild', this.id);

        this.transitionTime = this.defaults.transitionTime;
        this.transitionDelay = this.defaults.transitionDelay;
        this.x = this.showX;
        this.y = this.showY;
        this.s = (this.childRadius / 400);
        this.o = 1;
        this.el.classList.add('no-connector');
        this.update();

        setTimeout(function() {
            this.playSound(0);
        }.bind(this), (this.transitionTime + this.transitionDelay) * 1000);

        return this;

    };

    ContentItemView.prototype.handleTransitionEnd = function handleTransitionEnd(e) {

        //console.log('ContentItemView.handleTransitionEnd', e.target.id, e.propertyName);

        var contentId = null,
            contentItem = null;

        contentId = e.target.id || e.target.parentNode.id;
        contentId = contentId.replace('content-', '');
        contentItem = this.controller.model.content[contentId];

        if (contentItem) {

            if (Math.abs(contentItem.x) > 0 && Math.abs(contentItem.y) > 0) {
                contentItem.el.classList.remove('no-connector');
            }

            contentItem.inTransition = false;

        }

    };

    return ContentItemView;

});
