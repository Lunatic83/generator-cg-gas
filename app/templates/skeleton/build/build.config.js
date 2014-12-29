'use strict';

//basic configuration object used by gulp tasks
module.exports = {
  port: 3000,
  html: 'app/**/*.html',
  tmpDist: 'build/dist/scripts',
  sassDist: 'build/tmp',
  dist: 'build/dist',
  base: 'app',
  tpl: ['!app/index.html',
  '!app/vendor/**/*.html',
  '!app/test/**/*.html',
  'app/**/*.html'],
  mainScss: 'app/app.scss',
  scss: 'app/**/*.scss',
  js: [
    '!app/vendor/**/*.js',
    '!app/test/unit-results/**/*.js',
    'app/**/*.js',   //unit
  ],
  index: 'app/index.html',
  assets: 'app/assets/**',
  images: 'app/assets/images/**/*',
  banner: ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
  ].join('\n')
};
