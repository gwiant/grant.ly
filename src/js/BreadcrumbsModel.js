define(function(require) {

    'use strict';

    var View = require('src/js/BreadcrumbView');

    function BreadcrumbsModel(controller) {

        this.controller = controller;

        this.crumbs = {};

        this.init();

    }

    BreadcrumbsModel.prototype.init = function init() {

        //console.log('BreadcrumbsModel.init', location.hash.substr(1));

        this.update(location.hash.substr(1));

    };

    BreadcrumbsModel.prototype.update = function(newPath) {

        //console.log('BreadcrumbsModel.update', newPath);

        if (!newPath) {
            this.clear();
        }

        var crumb = null,
            pathArray = newPath.split('/').filter(function(n) {
                return n !== "";
            }),
            itemPathArray = [];

        for (var i = 0; i < pathArray.length; i++) {
            itemPathArray.push(pathArray[i]);
            this.set(itemPathArray);
        }

        for (crumb in this.crumbs) {
            if (newPath.indexOf(this.crumbs[crumb].path) < 0) {
                this.crumbs[crumb].detach();
                delete this.crumbs[crumb];
            }
        }

    };

    BreadcrumbsModel.prototype.clear = function clear() {

        //console.log('BreadcrumbsModel.clear');

        for (var crumb in this.crumbs) {
            this.crumbs[crumb].detach();
            delete this.crumbs[crumb];
        }

    };

    BreadcrumbsModel.prototype.set = function set(crumbPathArray) {

        //console.log('BreadcrumbsModel.set', crumbPathArray);

        var id = crumbPathArray.join('');

        if (!(id in this.crumbs)) {
            this.crumbs[id] = new View(crumbPathArray, this.controller);
        }

    };

    return BreadcrumbsModel;

});
