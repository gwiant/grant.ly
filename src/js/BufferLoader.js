define(function(require) {

    'use strict';

    function BufferLoader(context, urlList, callback) {

        //console.log('new BufferLoader');

        this.context = context;
        this.urlList = urlList;
        this.onload = callback;
        this.bufferList = [];
        this.loadCount = 0;

    }

    BufferLoader.prototype.loadBuffer = function loadBuffer(url, index) {

        //console.log('BufferLoader.loadBuffer', url, index);

        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        var loader = this;

        request.onload = function() {
            if (loader.context) {
                loader.context.decodeAudioData(
                    request.response,
                    function(buffer) {
                        if (!buffer) {
                            console.error('error decoding file data: ' + url);
                            return;
                        }
                        loader.bufferList[index] = buffer;
                        if (++loader.loadCount == loader.urlList.length) {
                            loader.onload(loader.bufferList);
                        }
                    }
                );
            }
        };

        request.onerror = function() {
            console.error('BufferLoader: XHR error');
        };

        request.send();
    };

    BufferLoader.prototype.load = function load() {

        //console.log('BufferLoader.load');

        for (var i = 0; i < this.urlList.length; ++i) {
            this.loadBuffer(this.urlList[i], i);
        }
    };

    return BufferLoader;

});
