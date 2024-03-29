'use strict';

var fs = require('fs');
var path = require('path');

// Project folders (relative to this Gruntfile)
var project = {
  app: 'app',
  dist: 'dist'
};

/* Load the livereload <script> snippet
 * This gets inject into our HTML in the connect dev server with middleware
 */
var lrSnippet = function(options) {
  options = options || {};
  return function(req, res, next) {
    var snip = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
    var r = req;

    // Fudge request URL to force livereload-snippet injection (used for pushState requests)
    if (options.force) {
      r = { url: '/index.html' };
    }

    snip(r, res, next);
  }
};

// Wrapper around connect.static so we can properly resolve the directory to mount
var mountFolder = function(connect, dir) {
  return connect.static(path.resolve(dir));
};


// This is a custom middleware for connect to serve our index.html for pushState requests
// This should be added after mounting any folders so we can still serve real static files
var serveIndex = function(req, res) {
  var index = path.resolve(project.app + '/index.html');
  var rs = fs.createReadStream(index);

  rs.on('open', function() {
    rs.pipe(res);
  });
};

// Grunt!!!
module.exports = function(grunt) {
  // Look in package.json for grunt devDependencies and load them into grunt
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    // Add the project dirs into the config so we can reference
    // them below using the underscore template syntax
    project: project,

    // Read our package.json file for extra info
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      // Recompile LESS which will then trigger the livereload watcher below
      less: {
        files: ['app/styles/{,*/}*.less', 'app/components/tgm-bootstrap/less/*.less'],
        tasks: ['less:server']
      },

      /* When any main assets in `project.app` change we should reload the browser
       * Globbing now has OR statements, i.e. app/{js,scripts} will search app/js and app/scripts
       * If you omit the first value it works like an optional match so app/{,js}/*.js
       * Will match app/myscript.js and app/js/otherscript.js
       *
       * Any precompiled resources (i.e. compiled CSS, compiled Handlebars templates) live in the .tmp folder
       */
      livereload: {
        files: [
          '<%= project.app %>/index.html',
          '<%= project.app %>/embed.html',
          '{.tmp,<%= project.app %>}/styles/{,/*}*.css',
          '{.tmp,<%= project.app %>}/js/{,/*,**/,*/}*.js',
          '<%= project.app %>/images/{,*/}*.{png,jpg,jpeg,svg,webp}'
        ],
        tasks: ['devcode:server', 'livereload']
      }
    },

    devcode :
    {
      options :
      {
        html: true,        // html files parsing?
        js: false,          // javascript files parsing?
        css: false,         // css files parsing?
        clean: true,       // removes devcode comments even if code was not removed
        block: {
          open: 'devcode', // with this string we open a block of code
          close: 'endcode' // with this string we close a block of code
        },
        dest: 'dist'       // default destination which overwrittes environment variable
      },
      server : {           // settings for task used with 'devcode:server'
        options: {
          source: '<%= project.app %>/',
          dest: '.tmp/',
          env: 'development'
        },
      },
      dist : {             // settings for task used with 'devcode:dist'
        options: {
          source: '<%= project.dist %>/',
          dest: '<%= project.dist %>/',
          env: 'production'
        }
      }
    },

    // develpment server
    connect: {
      options: {
        port: 9040,
        // Use 0.0.0.0 to listen from anywhere
        // Can be changed to localhost to lock it down
        hostname: '0.0.0.0'
      },

      // dev server with livereload snippet injected
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              lrSnippet(),
              // try serving real static files first
              mountFolder(connect, '.tmp'),
              mountFolder(connect, project.app),
              // force livereload snippet because we know we're about to hit serveIndex middleware
              lrSnippet({ force: true }),
              // if we get to here, always resond with index.html instead of a 404
              serveIndex
            ];
          }
        }
      },

      // dev server that ONLY runs the /dist folder, good for checking a build before deployment
      dist: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, 'dist'),
              serveIndex
            ];
          }
        }
      }
    },

    clean: {
      dist: ['.tmp', '<%= project.dist %>/*'],
      server: ['.tmp']
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },

      // have to use with_overrides because the jshint task doesn't automatically merge options with .jshintrc
      with_overrides: {
        options: {
          globals: {
            jQuery: true,
            $: true,
            _: true,
            Backbone: true,
            Modernizr: true
          }
        }
      },

      all: [
        // Yo dawg, I heard you like linting when building
        // So I put a lint task in your build file so you can lint your build file while you build
        'Gruntfile.js',
        '<%= project.app %>/js/{,/*}*.js',

        // ! = Ignore the libs folder which contains dodgy 3rd-party code
        '!<%= project.app %>/js/libs/'
      ]
    },

    // LESS task has two targets so we can run unminified CSS in dev mode
    less: {
      server: {
        files: {
          // compile to our .tmp, this folder is mounted in the dev server
          '.tmp/styles/main.css': '<%= project.app %>/styles/main.less'
        }
      },

      dist: {
        // compress for production :)
        yuicompress: true,
        files: {
          '<%= project.dist %>/styles/main.css': '<%= project.app %>/styles/main.less'
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: "app/js",
          mainConfigFile: "app/js/main.js",
          include: ["main"],
          out: "dist/js/main.js",
          optimize: "none",
          preserveLicenseComments: false,
          useStrict: true,
          wrap: true
        }
      }
    },

    // useminPrepare scans files for <!-- build:(js|css) --> blocks
    // and injects config into the grunt-contrib-concat task
    useminPrepare: {
      html: '<%= project.app %>/{,*/}*.html',
      options: {
        dest: '<%= project.dist %>'
      }
    },

    usemin: {
      html: ['<%= project.dist %>/{,*/}*.html'],
      css: ['<%= project.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= project.dist %>']
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= project.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,svg}',
          dest: '<%= project.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          collapseBolleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true
        },
        files: {
          '<%= project.dist %>/index.html': '<%= project.dist %>/index.html',
          '<%= project.dist %>/embed.html': '<%= project.dist %>/embed.html'
        }
      }
    },

    rev: {
      options: {
        algorithm: 'sha512',
        length: 16
      },
      files: {
        src: ['<%= project.dist %>/js/*.js', '<%= project.dist %>/styles/*.css'],
      }
    },

    // A whitelist of extra files to copy
    // Processed assets like JS, CSS, Images, etc are all copied over
    // by their respective tasks.
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= project.app %>',
          dest: '<%= project.dist %>',
          src: [
            'index.html',
            'embed.html',
            'sample.html',
            'embed-sizes.html',
            'story.html',
            'live-sample.html',
            'user-embed.html',
            'images/*.svg',
            '*.{ico,txt}',
            '.htaccess'
          ]
        }]
      }
    },

    bower: {
        options: {
            exclude: ['modernizr']
        },
        all: {
            rjsConfig: '<%= yeoman.app %>/js/main.js'
        }
    },

    cdn: {
      dist: {
        src: ['<%= project.dist %>/{index,embed}.html'],
        cdn: 'http://detention-incidents-assets.theglobalmail.org'
      },

      staging: {
        src: ['<%= cdn.dist.src %>'],
        cdn: 'http://detention-incidents-staging-assets.theglobalmail.org'
      },

      embed: {
        src: ['<%= cdn.dist.src %>'],
        cdn: 'http://detention-incidents-embed.herokuapp.com'
      }
    },

    cloudfiles: {
      staging: {
        user: 'theglobalmail',
        key: process.env.RACKSPACE_API_KEY,
        upload: [{
          container: 'detention-incidents-staging',
          src: '<%= project.dist %>/**/*',
          dist: '',
          stripcomponents: 1
        }]
      },

      dist: {
        user: 'theglobalmail',
        key: process.env.RACKSPACE_API_KEY,
        upload: [{
          container: 'detention-incidents',
          src: '<%= project.dist %>/**/*',
          dist: '',
          stripcomponents: 1
        }]
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'devcode:server',
      'jshint:with_overrides',
      'less:server',
      'livereload-start',
      'connect:livereload',
      'watch'
    ]);
  });

  // builds the project in /dist
  // target can be dev, staging, production
  // these targets change which CDN URL to use, or none for dev
  grunt.registerTask('build', function(target) {
    var targets = [
      'jshint:with_overrides',
      'clean:dist',
      'less:dist',
      'requirejs',
      'useminPrepare',
      'imagemin',
      'concat', // concat configuration is generated by the useminPrepare task
      'copy:dist',
      'uglify',
      'rev',
      'usemin',
      'devcode:dist'
    ];

    // allow building with different CDN URLs
    if (target === 'staging') {
      targets.push('cdn:staging');
    } else if (target !== 'dev') {
      targets.push('cdn:dist');
    }

    targets.concat([
      'htmlmin'
    ]);

    grunt.task.run(targets);
  });

  // TODO: Testing
  grunt.registerTask('test');

  // default is run if you invoke grunt without a target
  grunt.registerTask('default', 'build');
};
