/* globals require */
require.config({
    map: {
        '*': {
            text: 'require-text/text',
            less: 'require-less/less',
            json: 'require-json/json',
            css: 'require-css/css'
        }
    },
    paths: {
        'require-less': 'bower_components/require-less',
        'require-text': 'bower_components/requirejs-text',
        'require-json': 'bower_components/requirejs-json',
        'require-css': 'bower_components/require-css'
    },
    packages: [],
    less: {
        logLevel: 1,
        globalVars: {
            root: "\"../../\""
        }
    },
    shim: {}
});