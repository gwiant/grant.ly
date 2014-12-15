define(function(require) {

    'use strict';

    var View = require('src/js/PulseView');

    function PulseModel(controller) {

        this.controller = controller;
        this.instance = this;
        this.data = {};

    }

    PulseModel.prototype.add = function add(data) {

        //console.log('PulseModel.add', data);

        var pulseView = new View(data, this.controller);

        this.data[pulseView.id] = pulseView;

        setTimeout(function() {
            pulseView.detach();
            this.remove(pulseView.id);
        }.bind(this), 1100);

    };

    PulseModel.prototype.remove = function(pulseId) {

        //console.log('PulseModel.remove', this);

        if (this.data.hasOwnProperty(pulseId)) {

            delete this.data[pulseId];

        }

    };

    return PulseModel;

});
