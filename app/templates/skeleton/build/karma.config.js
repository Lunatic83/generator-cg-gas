//'use strict';

var baseDir = 'app';

module.exports = {

  //This is the list of file patterns to load into the browser during testing.
  //TODO if you install a new vendor component with bower you have to write the new dependency below
  files: [
    baseDir + '/vendor/jquery/**/*min.js',
    baseDir + '/vendor/underscore/underscore.js',
    baseDir + '/vendor/bootstrap/**/*min.js',
    baseDir + '/vendor/angular/angular.js',
    baseDir + '/vendor/angular-mocks/angular-mocks.js',
    baseDir + '/vendor/angular-ui-router/release/angular-ui-router.js',
    baseDir + '/vendor/angular-animate/angular-animate.js',
    baseDir + '/vendor/angular-resource/angular-resource.js',
    baseDir + '/vendor/angular-cookies/angular-cookies.js',
    baseDir + '/vendor/angular-ui-utils/ui-utils.js',
    baseDir + '/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
    baseDir + '/vendor/moment/moment.js',
    baseDir + '/vendor/**/*min.js',
    baseDir + '/app.js',
    baseDir + '/modules/**/*.js',
    baseDir + '/service/**/*.js',
    baseDir + '/partial/**/*.js',
    'build/tmp/*.js',
  ],

  //used framework
  frameworks: ['jasmine'],

  plugins: [
    'karma-chrome-launcher',
    'karma-phantomjs-launcher',
    'karma-jasmine',
    'karma-coverage',
    'karma-html-reporter',
    'karma-mocha-reporter'
  ],

  preprocessors: {
    'app/**/*.js': 'coverage'
  },

  reporters: ['mocha', 'html', 'coverage'],

  coverageReporter: {
    type: 'html',
    dir: baseDir + '/test/unit-results/coverage',
    file: 'coverage.html'
  },

  htmlReporter: {
    outputDir: baseDir + '//test/unit-results/html'
  },

  logLevel: 'info',

  urlRoot: '/__test/',

  //used browsers (overriddeng in some gulp task)
  browsers: ['Chrome'],

};
