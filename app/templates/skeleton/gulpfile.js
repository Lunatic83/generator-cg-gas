//'use strict';
// generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

var appConfig = require('./package.json');
var config = require('./build/build.config.js');
var karmaConfig = require('./build/karma.config.js');
var protractorConfig = require('./build/protractor.config.js');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var pkg = require('./package');
var karma = require('karma').server;
var del = require('del');
var _ = require('lodash');
/* jshint camelcase:false*/
var webdriverStandalone = require('gulp-protractor').webdriver_standalone;
var webdriverUpdate = require('gulp-protractor').webdriver_update;
var modRewrite = require('connect-modrewrite');

//update webdriver if necessary, this task will be used by e2e task
gulp.task('webdriver:update', webdriverUpdate);

// run unit tests and watch files
gulp.task('tdd', function(cb) {
  karma.start(_.assign({}, karmaConfig, {
    singleRun: false,
    action: 'watch',
    browsers: ['PhantomJS']
  }), cb);
});

// run unit tests with travis CI
gulp.task('travis', ['build'], function(cb) {
  karma.start(_.assign({}, karmaConfig, {
    singleRun: true,
    browsers: ['PhantomJS']
  }), cb);
});

// optimize images and put them in the dist folder
gulp.task('images', function() {
  console.log(config.images);
  return gulp.src(config.images)
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(config.dist + '/assets/images'))
    .pipe($.size({
      title: 'images'
    }));
});

//generate angular templates using html2js
gulp.task('templates', function() {
  return gulp.src(config.tpl)
  .pipe($.changed(config.tmpDist))
  .pipe($.html2js({
    outputModuleName: 'templates',
    base: 'app',
    useStrict: true
  }))
  .pipe($.concat('templates.js'))
  .pipe($.uglify({
    mangle: false,
  }))
  .pipe(gulp.dest(config.tmpDist))
  .pipe($.size({
    title: 'templates'
  }));
});

//generate css files from scss sources
gulp.task('sass', function() {
  return gulp.src(config.mainScss)
    .pipe($.rubySass())
    .on('error', function(err) {
      console.log(err.message);
    })
    .pipe(gulp.dest(config.sassDist))
    .pipe($.size({
      title: 'sass'
    }));
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;
/*  gulp.src('app/*.scss')
    .pipe(wiredep())
    .pipe(gulp.dest('app'));
*/
  gulp.src('app/*.html')
    .pipe(wiredep({exclude: ['bootstrap-sass-official']}))
    .pipe(gulp.dest('app'));
});

//build files for creating a dist release
gulp.task('build:dist', ['clean'], function(cb) {
  runSequence(['jshint', 'build', 'copy', 'copy:assets', 'images', 'test:unit'], 'html', cb);
});

//build files for development
gulp.task('build', ['clean'], function(cb) {
  runSequence(['sass', 'templates','wiredep'], cb);
});

//generate a minified css files, 2 js file, change theirs name to be unique, and generate sourcemaps
gulp.task('html', function() {
  var assets = $.useref.assets(
  { searchPath: '{build,app}'});
  // 'build/tmp/templates.js'
  return gulp.src(config.index)
  .pipe($.replace('<!-- template-holder -->','<script src="scripts/templates.js"></script>'))
  .pipe(assets)
  .pipe($.sourcemaps.init())
  .pipe($.if('**/*app.js',$.replace(new RegExp(appConfig.name+'\\u0027\\s*,\\s*\\u005b','i'),appConfig.name+'\', ["templates",')))
  .pipe($.if('**/*.js', $.ngAnnotate()))
  .pipe($.if('**/*.js', $.uglify({
    mangle: false,
  })))
  .pipe($.if('*.css', $.csso()))
  .pipe($.if(['**/*app.js', '**/*app.css'], $.header(config.banner, {
    pkg: pkg
  })))
  .pipe($.rev())
  .pipe(assets.restore())
  .pipe($.useref())
  .pipe($.revReplace())
  .pipe($.if('*.html', $.minifyHtml({
    empty: true
  })))
  //.pipe($.debug({verbose: true}))
  .pipe($.sourcemaps.write())
  .pipe(gulp.dest(config.dist))
  .pipe($.size({
    title: 'html'
  }));
});

//copy assets in dist folder
gulp.task('copy:assets', function() {
  return gulp.src(config.assets, {
      dot: true
    }).pipe(gulp.dest(config.dist + '/assets'))
    .pipe($.size({
      title: 'copy:assets'
    }));
});

//copy assets in dist folder
gulp.task('copy', function() {
  return gulp.src([
      config.base + '/*',
      '!' + config.base + '/*.html',
      '!' + config.base + '/app*',
      '!' + config.base + '/modules',
      '!' + config.base + '/vendor',
      '!' + config.base + '/test'
    ]).pipe(gulp.dest(config.dist))
    .pipe($.size({
      title: 'copy'
    }));
});

//copy html templates in dist folder
gulp.task('copy:templates', function() {
  return gulp.src([
      config.base + '/modules/**/*.html',
    ]).pipe(gulp.dest(config.dist+'/modules'))
    .pipe($.size({
      title: 'copy modules'
    }));
});


//clean temporary directories
gulp.task('clean', del.bind(null, [config.dist, config.tmpDist,config.sassDist]));

//lint files
gulp.task('jshint', function() {
  return gulp.src(config.js)
    .pipe(reload({
      stream: true,
      once: true
    }))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

/* tasks supposed to be public */


//default task
gulp.task('default', ['serve']); //

//run unit tests and exit
gulp.task('test:unit', ['build'], function(cb) {
  karma.start(_.assign({}, karmaConfig, {
    singleRun: true
  }), cb());
});

// Run e2e tests using protractor, make sure serve task is running.
gulp.task('test:e2e', ['webdriver:update'], function() {
  return gulp.src(protractorConfig.config.specs)
    .pipe($.protractor.protractor({
      configFile: 'build/protractor.config.js'
    }))
    .on('error', function(e) {
      throw e;
    });
});

//run the server,  watch for file changes and redo tests.
gulp.task('serve:tdd', function(cb) {
  runSequence(['serve', 'tdd']);
});

//run the server after having built generated files, and watch for changes
gulp.task('serve', ['build'], function() {
  browserSync({
    notify: false,
    logPrefix: pkg.name,
    //server: ['build', 'app']
    server: {
      baseDir:  ['build', 'app'],
      middleware: [
        modRewrite([
          '!\\.\\w+$ /index.html [L]'
        ])
      ]
    }
  });

  gulp.watch(config.html, reload);
  gulp.watch(config.scss, ['sass', reload]);
  gulp.watch(config.js, ['jshint']);
  gulp.watch(config.js, reload);
  gulp.watch(config.assets, reload);
});

//run the app packed in the dist folder
gulp.task('serve:dist', [], function() {
  browserSync({
    notify: false,
    server: {
      baseDir:  [config.dist],
      middleware: [
        modRewrite([
          '!\\.\\w+$ /index.html [L]'
        ])
      ]
    }
  });
});
