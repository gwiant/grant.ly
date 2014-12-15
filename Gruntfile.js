var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

    var gruntConfig = {
        pkg: grunt.file.readJSON('package.json'),
        bwr: grunt.file.readJSON('bower.json')
    };

    // postinstall
    grunt.loadNpmTasks('grunt-shell');
    gruntConfig.shell = {};
    gruntConfig.shell.bowerUpdate = {
        command: 'node node_modules/bower/bin/bower update'
    };
    grunt.registerTask('bowerUpdate', ['shell:bowerUpdate']);

    // fontello
    grunt.loadNpmTasks('grunt-fontello');
    gruntConfig.fontello = {
        dist: {
            options: {
                config: 'fontello.config.json',
                fonts: 'src/font',
                styles: 'src/css',
                scss: false,
                less: true,
                force: true
            }
        }
    };

    grunt.loadNpmTasks('grunt-contrib-connect');
    gruntConfig.connect = {
        options: {
            port: 3001,
            host: "test.grantly",
            base: './'
        },
        livereload: {
            options: {
                middleware: function(connect) {
                    return [
                        require('connect-livereload')(),
                        mountFolder(connect, './')
                    ];
                }
            }
        }
    };

    // watch
    grunt.loadNpmTasks('grunt-contrib-watch');
    gruntConfig.watch = {
        src: {
            files: [
                'Gruntfile.js',
                'fontello.config.json',
                'src/js/*.js',
                'src/less/*.less',
                'src/tmpl/*.tmpl',
                'test/**/*'
            ],
            tasks: ['all'],
            options: {
                atBegin: true,
                livereload: true
            }
        }
    };

    // lint
    grunt.loadNpmTasks('grunt-contrib-jshint');
    gruntConfig.jshint = {
        options: {
            "eqnull": true
        },
        all: [
            'Gruntfile.js',
            'src/**/*.js',
            '!dist/**/*.js',
            '!test/**/*.js'
        ]
    };
    grunt.registerTask('lint', 'jshint');

    // jsbeautify
    grunt.loadNpmTasks('grunt-jsbeautifier');
    gruntConfig.jsbeautifier = {
        files: [
            'Gruntfile.js',
            'src/**/*.js',
            '!dist/**/*.js',
            '!test/**/*.js'
        ],
        options: {}
    };
    grunt.registerTask('jsbeautify', ['jsbeautifier']);

    // coverage
    grunt.loadNpmTasks('grunt-karma');
    gruntConfig.karma = {
        options: {
            basePath: '.',
            frameworks: ['mocha', 'requirejs'],
            files: [ // Note: avoid pattern: '**/*' as recursively iterating over all of node_modules will slow karma down considerably
                'test/karma-test-main.js', {
                    pattern: 'src/**/*',
                    included: false
                }, {
                    pattern: 'config/**/*',
                    included: false
                }, {
                    pattern: 'package.json',
                    included: false
                }, {
                    pattern: 'test/**/*',
                    included: false
                }, {
                    pattern: 'bower_components/**/*',
                    included: false
                }, {
                    pattern: 'node_modules/chai/*',
                    included: false
                }
            ],
            exclude: [],
            junitReporter: {
                outputFile: 'dist/test/test-results.xml'
            },
            coverageReporter: {
                reporters: [{
                    type: 'lcov'
                }, {
                    type: 'html'
                }, {
                    type: 'cobertura'
                }, {
                    type: 'text-summary'
                }],
                dir: 'dist/coverage'
            },
            port: 9876, // Note: web server port
            colors: true, // Note: enable / disable colors in the output (reporters and logs)
            logLevel: grunt.option('verbose') ? 'DEBUG' : 'INFO',
            autoWatch: false,
            captureTimeout: 60000, // Note: If browser does not capture in given timeout [ms], kill it
            singleRun: false
        },
        test: {
            reporters: ['progress', 'junit'],
            browsers: ['PhantomJS'],
            singleRun: true
        },
        cover: {
            preprocessors: {
                'src/js/**/*.js': ['coverage']
            },
            reporters: ['progress', 'coverage'],
            browsers: ['PhantomJS'],
            singleRun: true
        },
        chrome: {
            reporters: ['progress'],
            browsers: ['Chrome'],
            autoWatch: true
        },
        firefox: {
            reporters: ['progress'],
            browsers: ['Firefox'],
            autoWatch: true
        },
        safari: {
            reporters: ['progress'],
            browsers: ['Safari'],
            autoWatch: true
        }
    };
    grunt.registerTask('test', ['karma:test']);
    grunt.registerTask('cover', ['karma:cover']);

    // convenience
    grunt.registerTask('all', [
        'lint',
        'jsbeautify',
        'test',
        'cover'
    ]);
    grunt.registerTask('default', ['all', 'connect:livereload', 'watch']);

    // grunt
    grunt.initConfig(gruntConfig);

};
