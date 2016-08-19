/*jslint node: true */
'use strict';

var grunt = require('grunt');
var fs = require('fs-extra');
var path = require('path');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.deploy_site = {
    setUp: function (done) {
        // setup here if necessary
        done();
    },
    tearDown: function (done) {
        done();
    },
    staging: function (test) {

        test.expect(2);

        test.equal(grunt.file.exists('.staging_site'),
                   true, 'the local staging repo should be created.');

        test.equal(grunt.file.exists('test/sites/staging/staging.html'),
                   true, 'the staging.html file should be pushed to the remote.');

        test.done();
    },
    production: function (test) {
        test.expect(2);

        test.equal(grunt.file.exists('.production_site'),
                   true, 'the local production repo should be created.');

        test.equal(grunt.file.exists('test/sites/production/index.html'),
                   true, 'the production.html file should be pushed to the remote.');

        test.done();
    }
};
