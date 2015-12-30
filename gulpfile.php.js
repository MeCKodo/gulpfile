var gulp = require('gulp'),
    ugjs = require('gulp-uglify'),
    minicss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    replace = require('gulp-replace'),
    rev = require('gulp-rev-append'),
    ifElse = require('gulp-if-else'),
    htmlreplace = require('gulp-html-replace'),
    browserSync = require('browser-sync').create(),
    base64 = require('gulp-base64'),
    bsReload = browserSync.reload;

var path = './src/',
    csspath = './src/css/**/*.css',
    jspath = './src/js/**/*.js',
    htmlpath = './src/views/**/*.html',
    ifonpath = './src/webfont/**';

var disPath = './Public/',
    disCssPath = './public/css',
    disJsPath = './Public/js',
    disHtmlPath = './Application/Home/View',
    disifonpath = './Public/webfont';

var urlTag = '';
var NODE_ENV = '';

gulp.task('ugjs',function() {
    return gulp.src(jspath)
        .pipe(replace('__target__',urlTag))
        .pipe(replace('../../','../../Public/'))
        .pipe(ifElse(NODE_ENV === 'public',ugjs))
        .pipe(gulp.dest(disJsPath))
        .pipe(gulp.dest('.'+disJsPath));
});
gulp.task('css',function() {
	gulp.src(csspath)
		.pipe(ifElse(NODE_ENV === 'public',minicss))
        .pipe(base64({
            extensions: ['png', /\.jpg#datauri$/i],
            maxImageSize: 10*1024 // bytes,
        }))
		.pipe(gulp.dest(disCssPath))
        .pipe(gulp.dest('.'+disCssPath));
});
gulp.task('images', function () {
    return gulp.src('src/images/**/*.*')
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest('Public/images'))
            .pipe(gulp.dest('../Public/images'));
});
gulp.task('component',function() {
   return gulp.src('./src/component/*.html')
            .pipe(replace('__target__',urlTag))
            .pipe(gulp.dest('Public/component'))
            .pipe(gulp.dest('../Public/component'));
});
gulp.task('iconfont', function () {
    return gulp.src(ifonpath)
        .pipe(gulp.dest(disifonpath));
});
gulp.task('view',['clean'],function() {
    return gulp.src(htmlpath)
            .pipe(rev())
            .pipe(replace('__target__',urlTag))
            .pipe(replace('..\/..\/','__PUBLIC__/'))
            .pipe(replace('<a href="..\/','<a href="__APP__/'))
            .pipe(htmlreplace({
                js : {
                    src : '',
                    tpl : ''
                }
            }))
            .pipe(gulp.dest(disHtmlPath));
});

gulp.task('clean',function() {
    return gulp.src(disHtmlPath, {read: true})
        .pipe(clean());
});

gulp.task('build',function() {
    NODE_ENV = 'public';
	gulp.start('view','ugjs','css','component','iconfont','images');
});
gulp.task('auto',function() {
    gulp.watch([csspath],['css']);
    gulp.watch([jspath],['ugjs']);
    gulp.watch([htmlpath],['view']);
    gulp.watch('./src/component/*.html',['component']);
});

gulp.task('reload',function() {

	var htmlFiles = htmlpath;

	browserSync.init(htmlFiles,{
		startPath : "views/Index",
		server: path,
        notify:false
	});
    gulp.watch([csspath, jspath]).on('change',bsReload);
});

