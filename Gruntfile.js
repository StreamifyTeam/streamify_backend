'use strict';

module.exports = function(grunt) {
  var srcFiles = ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'];

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
        },
        src: ['test/**/*.js']
      }
    }, //end mochaTest

    jshint: {
      all: {
        src: srcFiles
      },
      options: {
        jshintrc: '.jshintrc'
      }
    }, //end jshint

    watch: {
      files: srcFiles,
      tasks: ['test']
    }, //end watch

    jscs: {
      src: srcFiles,
      options: {
        config: '.jscsrc'
      }
    } //end jscs
  });//end grunt.initConfig

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch'); //run with 'grunt watch'
  grunt.loadNpmTasks('grunt-jscs'); //run with 'grunt jscs'

  grunt.registerTask('test', ['jshint:all', 'mochaTest', 'jscs']);
  grunt.registerTask('default', ['test']);
};
