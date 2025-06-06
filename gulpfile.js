const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const zip = require('gulp-zip');

// Chemins
const paths = {
  css: {
    src: 'assets/css/*.css',
    dest: 'assets/built/'
  },
  js: {
    src: 'assets/js/*.js',
    dest: 'assets/built/'
  }
};

// Compilation CSS
function styles() {
  return gulp.src(paths.css.src)
    .pipe(concat('main.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.css.dest));
}

function scripts() {
 return gulp.src(paths.js.src)
   .pipe(concat('main.min.js'))
   .pipe(uglify())
   .pipe(gulp.dest(paths.js.dest));
}

// Watch files
function watch() {
 gulp.watch(paths.css.src, styles);
 gulp.watch(paths.js.src, scripts);
}

// Build for production
function build() {
 return gulp.parallel(styles, scripts);
}

// Create zip for theme upload
function zipTheme() {
 return gulp.src([
   '**/*',
   '!node_modules/**',
   '!gulpfile.js',
   '!package-lock.json',
   '!*.md'
 ])
 .pipe(zip('royaume-theme.zip'))
 .pipe(gulp.dest('./'));
}

// Export tasks
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build();
exports.zip = zipTheme;
exports.default = gulp.series(build(), watch);