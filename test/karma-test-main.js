/*global window,require*/
var deps = [];

for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/^\/base\/test\/.*\.test\.js$/.test(file)) {
            // console.log(deps);
            deps.push(file);
        }
    }
}

require.config({
    baseUrl: '/base',
    paths: {
        'chai': 'node_modules/chai/chai',
        'sinon': 'node_modules/sinon/pkg/sinon',
        'requirejs-text': 'bower_components/requirejs-text/text'
    },
    shim: {
        sinon: { exports: 'sinon'},
        'requirejs-text': { exports: 'text' },
        json: { exports: 'json' }
    }
});

deps.unshift('test/phantom.polyfills');

require(['config/require.conf'], function () {
    require.config({
        // ask Require.js to load these files (all our tests)
        deps: deps,

        // start test run, once Require.js is done
        callback: window.__karma__.start
    });
});