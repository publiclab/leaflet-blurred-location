/* jshint node: true */
module.exports = function(grunt) {

    "use strict";
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            options : {
                livereload: true
            },
            source: {
                files: [
                    'src/*.js',
                    'src/*/*.js',
                    'Gruntfile.js'
                ],
                tasks: [ 'build:js' ]
            }
        },

        browserify: {
            dist: {
                src: [
                    'src/PublicLab.Map.js'
                ],
                dest: 'dist/PublicLab.Map.js'
            }
        },

        uglify: {
          my_target: {
            files: {
              'dist/dist/Leaflet.BlurredLocation.js': ['src/location_tags.js', 'src/locationForm.js', 'main.js']
            }
          }
        },

        jasmine: {
          src: "src/client/js/*.js",
          options: {
            specs: "spec/javascripts/*spec.js",
            vendor: ['node_modules/jquery/dist/jquery.js','node_modules/leaflet/dist/leaflet-src.js','src/*.js',],
          }
        },

        jshint: {
        all: [
            "Gruntfile.js",
            "dsit/*.js",
            "spec/**/*.js",
        ],
        options: {
          jshintrc: '.jshintrc'
        },
}

    });

    /* Default (development): Watch files and build on change. */
    grunt.registerTask('build', [
        'browserify:dist'
    ]);
    grunt.registerTask('test', ['jshint', 'jasmine']);
};


//
//
// module.exports = function(grunt) {
//   grunt.initConfig({
//     pkg: grunt.file.readJSON("package.json"),
//     watch: {
//       grunt: {
//         files: ["Gruntfile.js", "package.json"],
//         tasks: "default"
//       },
//       javascript: {
//         files: ["src/client/**/*.js", "specs/**/*Spec.js"],
//         tasks: "test"
//       }
//     },
//     jasmine: {
//       src: "src/client/js/*.js",
//       options: {
//         specs: "specs/client/*Spec.js"
//       }
//     },
//     jshint: {
//       all: [
//         "Gruntfile.js",
//         "src/**/*.js",
//         "spec/**/*.js"
//       ],
//       options: {
//         jshintrc: ".jshintrc"
//       }
//     }
//   });
//   grunt.loadNpmTasks("grunt-contrib-watch");
//   grunt.loadNpmTasks("grunt-contrib-jshint");
//   grunt.loadNpmTasks("grunt-contrib-jasmine");
//   grunt.registerTask("test", ["jshint", "jasmine"]);
//   grunt.registerTask("default", ["test"]);
// };
