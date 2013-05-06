var fs = require('fs'),
    path = require('path'),
    tasks = JSON.parse(fs.readFileSync(__dirname + path.sep + 'package.json')).devDependencies;

module.exports = function (grunt) {

    'use strict';

    grunt.initConfig({

        files: {
            src: ['index.js', 'lib/**/*.js'],
            test: ['test/**/*.js'],
            all: ['index.js', 'lib/**/*.js', 'test/**/*.js']
        },

        jshint: {
            files: '<%= files.all %>',
            options: {
                jshintrc: '.jshintrc'
            }
        },

        clean: {
            docs: ['docs'],
            coverage: ['coverage']
        },

        docco: {
            purgatory: {
                files: { 'docs/': '<%= files.src %>' },
                options: {
                    layout: 'parallel'
                }
            }
        },

        coverage: {
            test: {
                files: { 'coverage': 'lib' }
            }
        },

        cafemocha: {
            unit: {
                src: '<%= files.test %>',
                options: {
                    ui: 'exports',
                    reporter: 'spec'
                }
            },
            coverage: {
                files: { 'coverage/index.html': '<%= cafemocha.unit.src %>'},
                options: {
                    ui: 'exports',
                    reporter: 'html-cov',
                    env: 'PURGATORY_COVERAGE'
                }
            }
        }

    });

    grunt.registerMultiTask('docco', 'Create docco documentation', function () {

        var docco = require('docco'),
            done = this.async(),
            opts = this.options();

        this.files.forEach(function (files, idx, arr) {
            opts.args = files.src;
            opts.output = files.dest;

            docco.document(opts, function () {
                if (idx === arr.length - 1) { done(); }
            });
        });

    });

    grunt.registerMultiTask('coverage', 'Create code coverage', function () {

        var spawn = require('child_process').spawn,
            done = this.async(),
            coverage = spawn('jscoverage', [this.files[0].src, this.files[0].dest]),
            error;

        coverage.stdout.on('data', function (data) {
            console.log(data.toString());
        });

        coverage.stderr.on('data', function (data) {
            error = new Error(data.toString());
        });

        coverage.on('close', function (code) { done(error); });

    });

    // Load Grunt Tasks
    Object.keys(tasks).forEach(function (key) {
        return (/^grunt-/).test(key) && grunt.loadNpmTasks(key);
    });

    grunt.registerTask('default', ['jshint', 'cafemocha:unit']);
    grunt.registerTask('cov', ['clean:coverage', 'coverage:test', 'cafemocha:coverage']);
    grunt.registerTask('docs', ['clean:docs', 'docco:purgatory']);
};
