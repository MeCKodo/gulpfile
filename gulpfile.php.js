var gulp = require('gulp'),
	ugjs = require('gulp-uglify'),
	minicss = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	replace = require('gulp-replace'),
	rev = require('gulp-rev-append'),
	browserSync = require('browser-sync').create(),
	bsReload = browserSync.reload;

var path = './src/',
	csspath = './src/css/**/*.css',
	jspath = './src/js/**/*.js',
	htmlpath = './src/views/**/*.html';

var disPath = './Public/',
	disCssPath = './public/css',
	disJsPath = './Public/js',
	disHtmlPath = './Application/Home/View';


gulp.task('css',function() {
	gulp.src(csspath)
		.pipe(minicss())
		.pipe(gulp.dest(disCssPath));
});
gulp.task('images', function () {
	return gulp.src('src/images/*.*')
		.pipe(imagemin({
			progressive: true
		}))
		.pipe(gulp.dest('Public/images'))
});
gulp.task('ugjs',function() {
	return gulp.src(jspath)
		.pipe(ugjs())
		.pipe(gulp.dest(disJsPath));
});

gulp.task('view',function() {
	return gulp.src(htmlpath)
		.pipe(rev())
		.pipe(replace('..\/..\/','__PUBLIC__/'))
		.pipe(replace('<a href="..\/','<a href="__APP__/'))
		.pipe(gulp.dest(disHtmlPath));
});

gulp.task('clean',function() {
	return gulp.src(disHtmlPath, {read: true})
		.pipe(clean());
});
gulp.task('build',['clean'],function() {
	gulp.start('view','ugjs','css');
});

gulp.task('auto',function() {
	gulp.watch([csspath],['css']);
	gulp.watch([jspath],['ugjs']);
	gulp.watch([htmlpath],['view']);
});
gulp.task('reload',function() {

	var htmlFiles = htmlpath;

	browserSync.init(htmlFiles,{
		startPath : "views/Index",
		server: path
	});
	gulp.watch([csspath, jspath]).on('change',bsReload);
});

gulp.task('myreload',function() {

	var htmlFiles = htmlpath;

	browserSync.init(htmlFiles,{
		startPath : "views/Index",
		server: path,
		proxy : "192.163.31.106"
	});
	gulp.watch([csspath, jspath]).on('change', bsReload);
});
