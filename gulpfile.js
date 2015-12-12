/**
 *	Required node modules for FlowKit
 */

var gulp = require('gulp'),
		rename = require('gulp-rename'),
		uglify = require('gulp-uglify'),
		minifyCss = require('gulp-minify-css'),
		imagemin = require('gulp-imagemin'),
		concat = require('gulp-concat-css'),
		prefix = require('gulp-autoprefixer'),
		browserSync = require('browser-sync');

/**
 *	This function print errors on console without terminating gulp 
 */

function errorLog(error){
	console.error.bind(error);
	this.emit('end');
}

// Gulp tasks starts from here

/**
 * Compress all images
 */

gulp.task('images', function(){
	gulp.src('img/**/*')
	.pipe(imagemin())
	.pipe(gulp.dest('build/img'));
});


/**
 * Compress all javascripts files
 */

gulp.task('scripts', function(){
		gulp.src('js/main.js')
		.pipe(uglify())
		.on('error', errorLog)
		.pipe(rename({
     extname: '.min.js'
   	}))
   	.pipe(gulp.dest('build/js'))
   	.pipe(browserSync.stream());
});

/**
 * Concat all css files into one file
 */

gulp.task('concat-css', function(){
	gulp.src('css/style.css')
	.pipe(concat('style.css'))
	.on('error', errorLog)
	.pipe(gulp.dest('temp'));
})


/**
 * Compress and add autoprefixes to all css files
 */

gulp.task('styles', function(){
		gulp.src('temp/style.css')
		.pipe(prefix('last 5 versions'))
		.pipe(minifyCss({compatibility: 'ie9'}))
		.on('error', errorLog)
		.pipe(rename({
     extname: '.min.css'
   	}))
		.pipe(gulp.dest('build/css'))
		.pipe(browserSync.stream());

});


/**
 * Live reload server with css and js injection 
 */

gulp.task('serve', function() {

 browserSync.init({
    server: {
      baseDir: './'
    },
    port: 8000,
    notify: false,
    ui: false
  });

	gulp.watch('img/*', ['images']);
	gulp.watch('js/main.js', ['scripts']);
	gulp.watch('css/*.css', ['concat-css']);
	gulp.watch('temp/style.css', ['styles']);
	gulp.watch('*.html').on('change', browserSync.reload);

});


gulp.task('default', ['images', 'scripts', 'concat-css', 'styles', 'serve']);


