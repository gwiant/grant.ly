define(function(require) {

    'use strict';

    var BaseView = require('src/js/BaseView');

    function PulseView(data, controller) {

        this.controller = controller;
        this.instance = this;
        this.container = document.getElementById('pulses');
        this.id = 'pulse' + Math.floor((Math.random() * 9000000) + 1000000);
        this.el = null;
        this.x = data.x - 1.5;
        this.y = data.y - 1.5;
        this.s = data.s;
        this.o = 1;

        this.init();

    }

    PulseView.prototype = new BaseView();

    PulseView.prototype.init = function init() {

        //console.log('PulseView.init', this);

        this.generate().update().attach();

        setTimeout(function() {
            this.s = (this.s * 3);
            this.o = 0;
            this.update();
            this.playSound(2);
        }.bind(this), 30);

    };

    PulseView.prototype.update = function update() {

        //console.log('PulseView.update', this);

        if (this.el) {

            this.el.style[this.controller.vendorPrefix + 'Transform'] = 'translate3d(' + (this.x - 1) + 'px, ' + (this.y - 1) + 'px, 0px) scale(' + this.s + ',' + this.s + ')';
            this.el.style.transform = 'translate3d(' + (this.x - 1) + 'px, ' + (this.y - 1) + 'px, 0px) scale(' + this.s + ',' + this.s + ')';

            this.el.style[this.controller.vendorPrefix + 'TransformStyle'] = 'preserve-3d';
            this.el.style.transformStyle = 'preserve-3d';

            this.el.style[this.controller.vendorPrefix + 'BackfaceVisibility'] = 'hidden';
            this.el.style.backfaceVisibility = 'hidden';

            this.el.style.display = 'block';

            this.el.style.opacity = this.o;

        }

        return this;

    };

    PulseView.prototype.generate = function generate() {

        //console.log('PulseView.generate', this);

        var borderElement = document.createElement('div'),
            boundTransitionEndHandler = this.handleTransitionEnd.bind(this);

        borderElement.classList.add('border');

        this.el = document.createElement('div');
        this.el.id = this.id;
        this.el.classList.add('pulse');
        this.el.addEventListener('transitionend', boundTransitionEndHandler, false);
        this.el.addEventListener(this.controller.vendorPrefix + 'transitionend', boundTransitionEndHandler, false);

        this.el.appendChild(borderElement);

        return this;

    };

    PulseView.prototype.handleTransitionEnd = function handleTransitionEnd(e) {

        //console.log('PulseView.handleTransitionEnd', e.propertyName);

        if (this.getStyle('opacity') === '0') {

            var boundTransitionEndHandler = this.handleTransitionEnd.bind(this);

            this.el.removeEventListener('transitionend', boundTransitionEndHandler);
            this.el.removeEventListener(this.controller.vendorPrefix + 'transitionend', boundTransitionEndHandler);

            this.detach();

            setTimeout(function() {
                this.controller.model.remove(this.id);
            }.bind(this), 30);

        }

    };

    return PulseView;

});
