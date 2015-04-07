'use strict';
module.exports = function (grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    nodemon: {
      dev: {
        script: 'bin/www',
        options: {
          ignore: ['node_modules/**', 'dist', 'public', 'tests',
          'Gruntfile.js', 'flightplan.js'],
          ext: 'js'
        }
      }
    },
    clean: {
      build: {
        files: [{
          dot: true,
          src: 'dist'
        }]
      }
    },
    jadeUsemin: {
      main: {
        options: {
          tasks: {
            js: ['concat', 'uglify', 'filerev'],
            css: ['concat',  'cssmin', 'filerev']
          },
          dirTasks: 'filerev'
        },
        files: [
          {
            src: 'views/index.jade',
            dest: 'dist/index.jade'
          },
          {
            src: 'views/layout.jade',
            dest: 'dist/layout.jade'
          }
        ]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['public/vendor/**/*']
      },
      all: ['{,*/}*.js', 'bin/www', 'public/**/*js', 'tests/**/*js']
    },
    watch: {
      scripts: {
        files: ['public/**/*', 'views/**/*'],
        options: {
          livereload: true
        }
      },
      test: {
        files: ['{,*/}*.js', 'bin/www'],
        tasks: ['test']
      },
      compass: {
        files: ['public/style/sass/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
      }
    },
    compass: {
      options: {
        sassDir: 'public/style/sass',
        cssDir: 'public/styles',
        importPath: 'public/vendor/bower_components',
        relativeAssets: false
      },
      dist: {},
      server: {}
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['tests/**/*.js']
      }
    }
  });
  grunt.registerTask('build', [
    'clean',
    'jadeUsemin'
  ]);
  grunt.registerTask('test', ['jshint', 'mochaTest']);
};
