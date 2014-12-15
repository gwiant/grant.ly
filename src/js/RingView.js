define(function(require) {

    'use strict';

    var BaseView = require('src/js/BaseView');

    function RingView(data, controller) {

        this.targetScale = 0;
        this.refId = data.hasOwnProperty('id') ? data.id : null;
        this.transitionTime = 0.9;
        this.controller = controller;
        this.instance = this;
        this.image = data.image;
        this.container = document.getElementById(data.cid);
        this.id = 'ring' + Math.floor((Math.random() * 9000000) + 1000000);
        this.el = null;
        this.x = -502;
        this.y = -502;
        this.top = 0;
        this.left = 0;
        this.a = 0;
        this.s = 0;
        this.o = 0;
        this.d = 0;
        this.targetOpacity = data.hasOwnProperty('targetOpacity') ? data.targetOpacity : 1;
        this.transitionDelay = data.hasOwnProperty('d') ? data.d : 0;
        this.sAdd = data.hasOwnProperty('sAdd') ? data.sAdd : 0;

    }

    RingView.prototype = new BaseView();

    RingView.prototype.init = function init() {

        //console.log('RingView.init', this);

        this.calculateTargetScale().generate().clear().update().attach();

    };

    RingView.prototype.setTargetScale = function setTargetScale() {

        this.s = this.targetScale * this.sAdd;

        return this;

    };

    RingView.prototype.expand = function expand() {

        //console.log('RingView.expand', this);

        setTimeout(function() {
            this.setTargetScale();
            this.t = this.transitionTime;
            this.o = this.targetOpacity;
            this.d = this.transitionDelay;
            this.update();
            this.playSound(4, 500);
            this.playSound(3, 800);
        }.bind(this), 400);

        return this;

    };

    RingView.prototype.clear = function clear() {

        //console.log('RingView.clear', this.refId, this.id);

        this.s = 0;
        this.t = 0;
        this.o = 0;
        this.a = 0;

        return this;

    };

    RingView.prototype.calculateTargetScale = function calculateTargetScale() {

        //console.log('RingView.calculateTargetScale', this.s, this.targetScale);

        this.targetScale = (Math.min(window.innerHeight, window.innerWidth) / 1150);

        return this;

    };

    RingView.prototype.update = function update() {

        //console.log('RingView.update', this);

        this.el.style[this.controller.vendorPrefix + 'Transform'] = 'translate3d(' + this.x + 'px, ' + this.y + 'px, 0px) scale(' + this.s + ',' + this.s + ') rotate(' + this.a + 'deg)';
        this.el.style.transform = 'translate3d(' + this.x + 'px, ' + this.y + 'px, 0px) scale(' + this.s + ',' + this.s + ') rotate(' + this.a + 'deg)';

        this.el.style[this.controller.vendorPrefix + 'TransitionDuration'] = this.t + 's';
        this.el.style.transitionDuration = this.t + 's';

        this.el.style[this.controller.vendorPrefix + 'TransitionDelay'] = this.d + 's';
        this.el.style.transitionDelay = this.d + 's';

        this.el.style.opacity = this.o;

        return this;

    };

    RingView.prototype.generate = function generate() {

        //console.log('RingView.generate', this);

        var boundTransitionEndHandler = this.handleTransitionEnd.bind(this);

        this.el = document.createElement('div');
        this.el.id = this.id;
        this.el.dataset.ref = this.refId;
        this.el.classList.add('ring');
        this.el.style.backgroundImage = 'url(' + this.image + ')';
        this.el.addEventListener('transitionend', boundTransitionEndHandler, false);
        this.el.addEventListener(this.controller.vendorPrefix + 'transitionend', boundTransitionEndHandler, false);

        return this;

    };

    RingView.prototype.shrink = function shrink() {

        //console.log('RingView.shrink', this.id, this.refId);

        this.o = 0;
        this.s = 0;
        this.update();
        this.playSound(5, 600);

        setTimeout(function() {
            this.detach();
            this.controller.model.remove(this.id);
        }.bind(this), 1000);

    };

    RingView.prototype.handleTransitionEnd = function handleTransitionEnd(e) {

        //console.log('RingView.handleTransitionEnd', e.target.id, e.target.style.opacity);

        if (e.propertyName === 'opacity' && this.getStyle('opacity') === '0') {

            setTimeout(function() {

                this.detach();

                this.controller.model.remove(this.id);

            }.bind(this), 100);

        }

    };

    return RingView;

});
