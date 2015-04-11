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
          dirTasks: 'filerev',
          prefix: 'public/'
        },
        files: [
          {
            src: 'views/admin/layout.jade',
            dest: 'dist/admin/layout.jade'
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
        files: ['public/style/{,*/}*.{scss,sass}'],
        tasks: ['compass:dev']
      }
    },
    compass: {
      options: {
        sassDir: 'public/style',
        cssDir: 'public/style',
        relativeAssets: false
      },
      production: {
        options: {
          environment: 'production'
        }
      },
      dev: {}
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
    'compass:production'
  ]);
  grunt.registerTask('test', ['jshint', 'mochaTest']);
};
