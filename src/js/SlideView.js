define(function(require) {

    'use strict';

    var BaseView = require('src/js/BaseView');

    function SlideView(slide, place, controller) {

        this.instance = this;
        this.place = place;
        this.title = slide.hasOwnProperty('title') ? slide.title : 'title';
        this.controller = controller;
        this.container = document.getElementById('slides');
        this.closeButton = document.getElementById('slidesCloseButton');
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.el = null;
        this.imageElement = null;
        this.id = 'slide' + slide.id;
        this.image = slide.image;

        this.x = this.windowWidth * this.place;
        this.y = 0;

        this.generate();

    }

    SlideView.prototype = new BaseView();

    SlideView.prototype.attach = function attach() {

        this.container.insertBefore(this.el, this.closeButton);

    };

    SlideView.prototype.removeImage = function removeImage() {

        //console.log('SlideView.removeImage', this.id);

        this.el.removeChild(this.imageElement);

    };

    SlideView.prototype.update = function update() {

        console.log('SlideView.update', this.id);

        this.el.style[this.controller.vendorPrefix + 'Transform'] = 'translate3d(' + this.x + 'px, ' + this.y + 'px, 0px)';
        this.el.style.transform = 'translate3d(' + this.x + 'px, ' + this.y + 'px, 0px)';

        this.el.style[this.controller.vendorPrefix + 'TransformStyle'] = 'preserve-3d';
        this.el.style.transformStyle = 'preserve-3d';

        this.el.style[this.controller.vendorPrefix + 'BackfaceVisibility'] = 'hidden';
        this.el.style.backfaceVisibility = 'hidden';

        return this;

    };

    SlideView.prototype.generate = function generate() {

        //console.log('SlideView.generate', this.id);

        var image = document.createElement('img'),
            titleElement = document.createElement('div'),
            boundImageLoadHandler = this.controller.handleImageLoad.bind(this.controller);

        image.addEventListener('load', boundImageLoadHandler, false);
        image.src = this.image;

        titleElement.classList.add('title');
        titleElement.appendChild(document.createTextNode(this.title));

        this.el = document.createElement('div');
        this.el.id = this.id;
        this.el.style.backgroundImage = 'url(/' + this.image + ')';
        this.el.classList.add('slide');
        this.el.appendChild(titleElement);
        this.imageElement = this.el.appendChild(image);

        this.update().attach();

    };

    return SlideView;

});
