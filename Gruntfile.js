module.exports = function ( grunt ) {
    require( 'load-grunt-tasks' )( grunt );
    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),
        jshint: {
            files: [ 'Gruntfile.js', 'wayback-restore/**/*.js', 'test/spec/**/*.js' ]
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: [ 'jshint' ]
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['wayback-restore/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        browserify: {
            dist: {
                files: {
                    // destination for transpiled js : source js
                    'dist/<%= pkg.name %>.js': '<%= pkg.main %>'
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': [ 'dist/<%= pkg.name %>.js' ]
                }
            }
        }
    } );

    //grunt.registerTask( 'build', [ 'browserify:dist', 'uglify:dist' ] );
    grunt.registerTask( 'build', [ 'browserify:dist' ] );
    grunt.registerTask( 'default', [ 'watch' ] );
};
