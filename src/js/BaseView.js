define(function(require) {

    'use strict';

    function BaseView() {

        this.container = null; /* get by id */
        this.instance = this;
        this.id = null;
        this.el = null;

    }

    BaseView.prototype.generate = function generate() {

        this.el = document.createElement('div');

        return this;

    };

    BaseView.prototype.update = function update() {

        return this;

    };

    BaseView.prototype.playSound = function playSound(index, delay) {

        //console.log('BaseView.playSound', index);

        this.fireEvent('AppAudioPlay', {
            index: index,
            delay: delay || 0
        });

        return this;

    };

    BaseView.prototype.fireEvent = function fireEvent(type, detail) {

        //console.log('BaseView.fireEvent', type, detail);

        var event = new CustomEvent(type, {
            "detail": detail || {},
            bubbles: true,
            cancelable: false
        });

        document.dispatchEvent(event);

    };

    BaseView.prototype.getStyle = function getStyle(style) {

        //console.log('BaseView.getStyle', style);

        return window.getComputedStyle(this.el, null).getPropertyValue(style);

    };

    BaseView.prototype.attach = function attach() {

        //console.log('BaseView.attach', this);

        if (this.container && this.container.nodeType === 1 && !this.el.parentNode) {

            this.el = this.container.appendChild(this.el);

        }

        return this;

    };

    BaseView.prototype.detach = function detach() {

        if (this.el && this.el.parentNode) {
            this.el = this.el.parentNode.removeChild(this.el);
        }

        return this;

    };

    return BaseView;

});
