// Load plugins
var
  gulp           = require('gulp'),
  del            = require('del'),
  autoprefixer   = require('gulp-autoprefixer'),
  concat         = require('gulp-concat'),
  urlAdjuster    = require('gulp-css-url-adjuster'),
  googleWebFonts = require('gulp-google-webfonts'),
  htmlmin        = require('gulp-htmlmin'),
  imagemin       = require('gulp-imagemin'),
  jshint         = require('gulp-jshint'),
  cssnano        = require('gulp-cssnano'),
  rename         = require('gulp-rename'),
  sass           = require('gulp-sass'),
  uglify         = require('gulp-uglify'),
  sourcemaps     = require('gulp-sourcemaps'),
  browserSync    = require('browser-sync').create(),
  useref         = require('gulp-useref'),
  gulpIf         = require('gulp-if')
;

/** Define Environment */
var 
  prodDir = './production',
  devDir  = './development',
  assetDir = prodDir+'/assets'
;

/** MAIN TASKS */
// Default Tasks
gulp.task('serve', ['clean', 'fonts'], function() {
  return gulp.start('htaccess', 'plugins', 'media', 'pages', 'js', 'json', 'sass', 'browserSync', 'watch');
});

gulp.task('build', ['clean', 'fonts'], function() {
  return gulp.start('htaccess', 'plugins', 'media', 'pages', 'js', 'json', 'sass');
});

// Watch - Keep eye for any changes in main dev folder
gulp.task('watch', function() {
  gulp.watch(devDir+'/pages/**', ['pages', browserSync.reload]);
  gulp.watch(devDir+'/sass/**', ['sass']);
  gulp.watch(devDir+'/js/**', ['js', browserSync.reload]);
  gulp.watch(devDir+'/json/**', ['json', browserSync.reload]);
  gulp.watch(devDir+'/media/**', ['media', browserSync.reload]);
});

gulp.task('htaccess', function() {
  gulp.src(devDir+'/.htaccess')
    .pipe(gulp.dest(prodDir))
  ;
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: "./production"
    }
  })
});

gulp.task('useref', function(){
  return gulp.src(prodDir+'/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest(prodDir))
  ;
});


/** individual tasks */
// Clean Everything - remove everything production
gulp.task('clean', function(done) {
  return del(prodDir, done);
});

// downloadFonts - get the fonts and change the fonts.css to google-fonts.scss
gulp.task('downloadFonts', function(done){
  // Download Google Fonts to Dev Fonts folder
  return gulp.src(devDir+'/google-fonts.txt')
    .pipe(googleWebFonts())
    .pipe(gulp.dest(assetDir+'/fonts'))
  ;
});

// Fonts - get the fonts and change the fonts.css to google-fonts.scss
gulp.task('fonts', function(){
  return  gulp.src(devDir+'/google-fonts.txt')
    .pipe(googleWebFonts())
    .pipe(gulp.dest(assetDir+'/fonts'))
    .on('end', function(){
      return gulp.src(assetDir+'/fonts/fonts.css')
        .pipe(urlAdjuster({replace: ['','fonts/']}))
        .pipe(rename({prefix: '_', basename: 'google-fonts', extname: '.scss'}))
        .pipe(gulp.dest(devDir+'/sass'))
      ;
    })
  ;
});

// HTML - Copy the html from development to production
gulp.task('pages', function() {
  return gulp.src(devDir+'/pages/**')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      removeCommentsFromCDATA: true,
    }))
    .pipe(gulp.dest(prodDir))
  ;
});

// JSON - Copy the JSON from development to production
gulp.task('json', function() {
  return gulp.src(devDir+'/json/**')
    .pipe(gulp.dest(assetDir))
  ;
});

// Plugin - Copy static assets from development to production
gulp.task('plugins', function() {
  var sources = [
    'node_modules/jquery/dist/jquery.min.*',
    devDir+'/assets/*.js'
  ];

  return gulp.src(sources)
    .pipe(gulp.dest(assetDir+'/plugins'))
  ;
});

// media - Copy the media from development to production
gulp.task('media', function() {
  return gulp.src(devDir+'/media/**')
    .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
    .pipe(gulp.dest(assetDir+'/media'))
  ;
});

// JavaScript - Copy the scripts from development to production
gulp.task('js', function() {
  return gulp.src(devDir+'/js/**')
    .pipe(sourcemaps.init())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.min.js'))
    .pipe(uglify({preserveComments: 'license'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(assetDir))
  ;
});

// SASS - Copy the styles from development to production
gulp.task('sass', function() {
  return gulp.src(devDir+'/sass/**')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer('last 5 version'))
    .pipe(concat('main.min.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(assetDir))
    .pipe(browserSync.stream())
  ;
});