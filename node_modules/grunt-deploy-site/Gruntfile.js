/*jslint node: true */
/*
 * grunt-deploy-site
 * https://github.com/lonnygomes/grunt-deploy-site
 *
 * Copyright (c) 2015 Lonny Gomes
 * Licensed under the MIT license.
 */

var fs = require('fs-extra');
var path = require('path');

module.exports = function (grunt) {
    //creates a simulated remote URL for testing
    function createRemotes(remote_path, site_url, cb) {
        grunt.util.spawn({
            cmd: 'git',
            args: [ 'init', '--bare', remote_path]
        }, function (error, result, code) {
            if (code === 0) {
                var hook_path = path.resolve(remote_path, 'hooks/post-receive');

                site_url = path.resolve(site_url);

                //create post-receive hook to push content to site_url
                grunt.file.write(hook_path,
                    '#!/bin/bash\nGIT_WORK_TREE="' + site_url + '" git checkout -f',
                    'utf8');

                fs.chmodSync(hook_path, 0755);
                if (cb) {
                    cb();
                }
            } else {
                if (cb) {
                    cb(error);
                }
            }
        });
    }

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
            repos: ['.staging_site', '.production_site']
        },

        // Configuration to be run (and then tested).
        deploy_site: {
            staging: {
                options: {
                    deploy_url: 'http://google.com'
                },
                base_path: 'test/fixtures/staging',
                remote_url: 'test/fixtures/remotes/staging'
            },
            production: {
                options: {
                    verbose: true
                },
                base_path: 'test/fixtures/production',
                remote_url: 'test/fixtures/remotes/production'
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        },

        // Grunt bump to manage version updates
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                regExp: false
            }
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-bump');

    grunt.registerTask('clean_repos', 'Clear out repositories', function () {
        fs.removeSync('.staging_site');
        fs.removeSync('.production_site');
        fs.removeSync('test/remotes/staging');
        fs.removeSync('test/remotes/production');
        fs.removeSync('test/sites/staging/staging.html');
        fs.removeSync('test/sites/production/index.html');
    });

    grunt.registerTask('prep_tests', 'Prepares folders and test repos', function () {
        var done = this.async();

        createRemotes('test/fixtures/remotes/staging', 'test/sites/staging',
            function (err) {
                if (err) {
                    grunt.fail.fatal('Failed to create test staging repo');
                } else {
                    createRemotes('test/fixtures/remotes/production', 'test/sites/production',
                        function (err) {
                            done();
                        });
                }
            });
    });

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'prep_tests', 'deploy_site', 'nodeunit', 'clean_repos']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
