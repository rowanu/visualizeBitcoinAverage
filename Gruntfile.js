'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    'gh-pages': {
      options: {
        base: '.'
      },
      src: ['**']
    }
  });

  grunt.loadNpmTasks('grunt-gh-pages');
};
