define(function(require) {

    'use strict';

    var BaseView = require('src/js/BaseView');

    function BreadcrumbView(crumbPathArray, controller) {

        //console.log('new BreadcrumbView', crumbPathArray, controller);

        this.controller = controller;
        this.container = document.getElementById('breadcrumbs');
        this.pathArray = crumbPathArray;
        this.path = crumbPathArray.join('/');
        this.id = crumbPathArray.join('');
        this.label = this.pathArray[this.pathArray.length - 1];

        this.init();

    }

    BreadcrumbView.prototype = new BaseView();

    BreadcrumbView.prototype.init = function init() {

        //console.log('BreadcrumbView.init', this);

        this.generate().attach().show();

    };

    BreadcrumbView.prototype.show = function show() {

        setTimeout(function() {
            this.el.classList.add('show');
        }.bind(this), 30);

        return this;

    };

    BreadcrumbView.prototype.generate = function generate() {

        //console.log('BreadcrumbView.generate', this);

        var boundInteractStartHandler = this.controller.handleInteractStart.bind(this.controller);

        this.el = document.createElement('a');
        this.el.id = this.id;
        this.el.classList.add('crumb');
        this.el.href = '#' + this.path;
        this.el.dataset.pathname = this.path;
        this.el.appendChild(document.createTextNode(this.label));
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

        return this;

    };

    return BreadcrumbView;

});
