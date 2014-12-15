/* globals require */
require.config({
    map: {
        '*': {
            text: 'requirejs-text',
            less: 'require-less/less'
        }
    },
    paths: {
        'require-less': 'bower_components/require-less',
        'require-text': 'bower_components/requirejs-text'
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