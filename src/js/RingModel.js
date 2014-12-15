define(function(require) {

    'use strict';

    var View = require('src/js/RingView');

    function RingModel(controller) {

        this.controller = controller;
        this.instance = this;
        this.data = {};

    }

    RingModel.prototype.add = function add(data) {

        //console.log('RingModel.add', data);

        var ringView = new View(data, this.controller);

        this.data[ringView.id] = ringView;

        this.data[ringView.id].init();

    };

    RingModel.prototype.closeRingsByRefId = function closeRingsByRefId(refId) {

        //console.log('RingModel.closeRingsByRefId', refId);

        var rings = this.getByRefId(refId);

        for (var i = 0; i < rings.length; i++) {
            rings[i].shrink();
        }

    };

    RingModel.prototype.getByRefId = function getByRefId(refId) {

        //console.log('RingModel.getByRefId', refId);

        var rings = [];

        for (var ring in this.data) {
            if (this.data.hasOwnProperty(ring) && this.data[ring].refId === refId) {
                rings.push(this.data[ring]);
            }
        }

        return rings;

    };

    RingModel.prototype.expandById = function expandById(id) {

        //console.log('RingModel.expandById', id, this.data);

        if (this.data.hasOwnProperty(id)) {
            this.data[id].expand();
        }

    };

    RingModel.prototype.resize = function resize() {

        //console.log('RingModel.resize');

        var ring = null;

        for (ring in this.data) {
            this.data[ring].calculateTargetScale().setTargetScale().update();
        }

    };


    RingModel.prototype.remove = function(ringId) {

        //console.log('RingModel.remove', this);

        if (ringId in this.data) {

            delete this.data[ringId];

        }

    };

    return RingModel;

});
