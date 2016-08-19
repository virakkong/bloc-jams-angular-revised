/*jslint node: true */
/*
 * grunt-deploy-site
 * https://github.com/lonnygomes/grunt-deploy-site
 *
 * Copyright (c) 2015 Lonny Gomes
 * Licensed under the MIT license.
 */

'use strict';

var Q = require('q'),
    path = require('path'),
    open = require('open');

module.exports = function (grunt) {

    function willSpawn(cmd, args, opts, cmd_msg) {
        return function (d) {
            var defer = Q.defer(),
                msg = ['Running', cmd],
                is_verbose = false,
                spawned_cmd;

            //set verbose flag
            if (opts && opts.verbose) {
                is_verbose = opts.verbose;
            }

            if (args) {
                msg = msg.concat(args);
            }

            //print out command if --verbose is supplied
            grunt.verbose.ok(msg.join(' '));

            if (cmd_msg) {
                grunt.log.writeln(cmd_msg);
            }

            //execute command
            spawned_cmd = grunt.util.spawn({
                cmd: cmd,
                args: args,
                opts: opts
            }, function (error, result, code) {
                if (code !== 0) {
                    defer.reject({
                        msg: error,
                        code: code
                    });
                } else {
                    defer.resolve(d);
                }
            });

            if (is_verbose) {
                spawned_cmd.stdout.on('data', function (data) {
                    grunt.log.write(data.toString('utf8').grey.bold);
                });

                spawned_cmd.stderr.on('data', function (data) {
                    grunt.log.write(data.toString('utf8').grey);
                });
            }
            return defer.promise;
        };
    }

    function willInitRepo(repoPath, opts) {
        return function (d) {
            var defer = Q.defer(),
                relRepoPath,
                msg;

            if (!grunt.file.isDir(repoPath)) {
                relRepoPath = path.basename(repoPath);
                msg = "Initializing repository at ".cyan + relRepoPath.white;

                grunt.log.writeln(msg);
                willSpawn('git', ['init', repoPath], opts)()
                    .then(function () {
                        defer.resolve(d);
                    }, function (err) {
                        defer.reject(err);
                    });
            } else {
                //repo is already initialized
                process.nextTick(function () {
                    defer.resolve(d);
                });
            }

            return defer.promise;
        };
    }

    function willCommit(repoPath, commit_msg, opts) {
        return function (d) {
            var defer = Q.defer(),
                options = opts || {};

            //set current working dir option to path of repo
            options.cwd = repoPath;

            willSpawn('git',
                      ['commit', '--allow-empty', '-m', commit_msg],
                      options,
                      'Committing changes '.cyan + '...'.white)()
                .then(function () {
                    defer.resolve(d);
                }, function (err) {
                    defer.reject({msg: err});
                });

            return defer.promise;
        };
    }

    function openURL(opts) {
        return function () {
            var defer = Q.defer();

            if (opts.deploy_url) {
                open(opts.deploy_url, null, function (err) {
                    if (err) {
                        defer.reject({msg: err});
                    } else {
                        defer.resolve(opts.deploy_url);
                    }
                });
            } else {
                //if no url was supplied, resolve promise w/o a fuss
                process.nextTick(function () {
                    defer.resolve(true);
                });
            }

            return defer.promise;
        };
    }

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('deploy_site', 'Grunt plugin that leverages git to deploy a web site', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
                branch: 'master',
                commit_msg: 'deployment',
                verbose: false
            }),
            config = [this.name, this.target].join('.'),
            requiredParams = [
                'base_path',
                'remote_url'
            ],
            localRepoPath = path.resolve('.' + this.target + '_site'),
            remoteRepoPath,
            workTree,
            done;

        //first check that all required fields are supplied
        requiredParams.forEach(function (curParam) {
            grunt.config.requires([this.name, this.target, curParam].join('.'));
        }.bind(this));

        //confirm base_path is correct
        if (!grunt.file.isDir(this.data.base_path)) {
            grunt.fail.fatal('Invalid path supplied for `base_path` value!');
        }

        //save the working tree for repo as the base path from the grunt config
        workTree = path.resolve(this.data.base_path);

        //set remote git url variable
        if (grunt.file.exists(path.resolve(this.data.remote_url))) {
            //must be a local reference so resolve to absolute path
            remoteRepoPath = path.resolve(this.data.remote_url);
        } else {
            remoteRepoPath = this.data.remote_url;
        }

        done = this.async();

        //execute commands
        return [
            willInitRepo(localRepoPath, {verbose: options.verbose}),
            willSpawn('git',
                      ['config', 'core.worktree', workTree],
                      {cwd: localRepoPath, verbose: options.verbose}),
            willSpawn('git',
                      ['add', '-A'],
                      {cwd: localRepoPath, verbose: options.verbose},
                      'Adding files to deployment repo '.cyan + '...'.white),
            willCommit(localRepoPath,
                       options.commit_msg,
                      {verbose: options.verbose}),
            willSpawn('git',
                      ['push', '--force', remoteRepoPath, 'master:' + options.branch],
                      {cwd: localRepoPath, verbose: options.verbose},
                      'Pushing changes to the remote deployment repository '.cyan + '...'.white),
            openURL(options)
        ].reduce(function (prev, curFunc) {
            return prev.then(curFunc);
        }, new Q())
            .then(function (d) {
                var success_msg = 'Successfully deployed ' + this.target + ' site';
                grunt.log.writeln(success_msg.white.bold.underline);
                done();
            }.bind(this), function (err) {
                var errMsg = (err) ? err.msg : 'An undefined error occured!';

                grunt.fail.fatal(errMsg);
            }).done();

    });

};
