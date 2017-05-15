module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

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
              'dist/PublicLab.Map.js': ['src/location_tags.js', 'src/locationForm.js', 'main.js']
            }
          }
        },
    });

    /* Default (development): Watch files and build on change. */
    grunt.registerTask('default', ['watch']);

    grunt.registerTask('build', [
        'browserify:dist'
    ]);
};
