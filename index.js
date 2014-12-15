// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: './',
	map: {
        '*': {
            text: 'require-text/text',
            less: 'require-less/less',
            json: 'require-json/json',
            css: 'require-css/css'
        }
    },
    paths: {
    	app: 'src',
        'require-less': 'bower_components/require-less',
        'require-text': 'bower_components/requirejs-text',
        'require-json': 'bower_components/requirejs-json',
        'require-css': 'bower_components/require-css'
    },
    packages: [],
    less: {
        logLevel: 1,
        globalVars: {}
    },
    shim: {}
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['app/js/helpers', 'app/js/AppController']);
