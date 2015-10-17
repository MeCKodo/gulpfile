var gulp = require('gulp'),
	ugjs = require('gulp-uglify'),
	minicss = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	rev = require('gulp-rev-append'),
	browserSync = require('browser-sync').create();
	
var path = './src/main/webapp/public';
var disPath = './src/main/webapp/';

gulp.task('css',function() {
	gulp.src('src/css/*.css')
		.pipe(minicss())
		.pipe(gulp.dest('Public/css'));
}); 
gulp.task('images', function () {
    gulp.src('src/images/*.*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('Public/images'))
});
gulp.task('ugjs',function() {
	gulp.src('src/js/*.js')
		.pipe(ugjs())
		.pipe(gulp.dest('Public/js'));
});
gulp.task('view',function() {
	gulp.src('src/views/**/*.html')
		.pipe(gulp.dest('Application/Home/View'));
}); 

gulp.task('testRev', function () {
    gulp.src('src/views/*.html')
        .pipe(rev())
        .pipe(gulp.dest('Application/Home/View'));
});

gulp.task('build',['ugjs','css','view','testRev']);

gulp.task('reload',function() {
	browserSync.init({
		startPath : "src/views/Home",
		server: true
    });
});

browserSync.watch(["src/css/*.css","src/js/*.js","src/views/**/*.html"], function (event, file) {
    if (event === "change") {
        browserSync.reload(file);
    }
});

