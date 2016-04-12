var gulp = require('gulp'),
    ugjs = require('gulp-uglify'),
    //minicss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean'),
    replace = require('gulp-replace'),
    rev = require('gulp-rev-append'),
    ifElse = require('gulp-if-else'),
    htmlreplace = require('gulp-html-replace'),
    browserSync = require('browser-sync').create(),
    base64 = require('gulp-base64'),
    runSequence = require('run-sequence'),
    bsReload = browserSync.reload;

var postcss = require('gulp-postcss'); //postcss本身
var autoprefixer = require('autoprefixer');
var precss = require('precss'); //提供像scss一样的语法
var cssnano = require('cssnano');  //更好用的css压缩!
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var path = './src/',
    csspath = './src/css/**/*.css',
    sasspath = './src/sass/**/*.scss',
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
        .pipe(gulp.dest(disJsPath));
});
gulp.task('css',function() {
    var processes = [cssnano];

	gulp.src(csspath)
		.pipe(ifElse(NODE_ENV === 'public',function() {
            return postcss(processes)
        }))
        .pipe(base64({
            extensions: ['png', /\.jpg#datauri$/i],
            maxImageSize: 10*1024 // bytes,
        }))
	.pipe(gulp.dest(disCssPath));
});
gulp.task('sass',function() {
    var processes = [
        autoprefixer({browsers: ['last 2 version', 'safari 5', 'opera 12.1', 'ios 6', 'android 4','> 10%']}),
        precss // background: color($blue blackness(20%));  precss为了用这样的语法
    ];
    return gulp.src(sasspath)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processes))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('images', function () {
    return gulp.src('src/images/**/*.*')
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest('Public/images'));
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
	gulp.start('view','ugjs','sass','css','component','iconfont','images');
});
//gulp.task('auto',function() {
    //gulp.watch([csspath],['css']);
    //gulp.watch([sasspath],['sass']);
    //gulp.watch([jspath],['ugjs']);
    //gulp.watch([htmlpath],['view']);
    //gulp.watch('./src/component/*.html',['component']);
//});

gulp.task('collegereload',function() {

    browserSync.init(chtmlpath,{
        startPath : "/views/",
        server: cpath,
        notify:false
    });
    //gulp.watch([csasspath],['collegesass']);
    gulp.watch([csasspath]).on('change',function() {
        runSequence('collegesass', 'collegecss',function() {
            bsReload();
        });
    });
    gulp.watch([cjspath],['collegejs']).on('change',bsReload);
    gulp.watch([chtmlpath],['collegeview']).on('change',bsReload);

});

