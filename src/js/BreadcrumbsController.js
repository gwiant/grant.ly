define(function(require) {

    'use strict';

    var Model = require('src/js/BreadcrumbsModel'),
        View = require('src/js/BreadcrumbView');

    function BreadcrumbsController() {

        this.model = new Model(this);

        this.setupEvents();

    }

    BreadcrumbsController.prototype.setupEvents = function setupEvents() {

        var boundHashChangeHandler = this.handleHashChange.bind(this);

        document.addEventListener('AppHashChange', boundHashChangeHandler, false);

    };

    BreadcrumbsController.prototype.handleHashChange = function handleHashChange(e) {

        this.model.update(e.detail.newHash);

    };

    BreadcrumbsController.prototype.handleInteractStart = function handleInteractStart(e) {

        if (e.target && e.target.classList.contains('crumb')) {

            location.hash = e.target.dataset.pathname;

        }

        e.preventDefault();

    };

    return BreadcrumbsController;

});
