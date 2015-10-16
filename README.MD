```javascript
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
	gulp.src('public/css/*.css')
		.pipe(minicss())
		.pipe(gulp.dest('dist/css'));
}); 
gulp.task('images', function () {
    gulp.src('public/img/*.*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/images'))
});
gulp.task('ugjs',function() {
	gulp.src('public/js/*.js')
		.pipe(ugjs())
		.pipe(gulp.dest('dist/js'));
});
gulp.task('view',function() {
	gulp.src('public/views/*.html')
		.pipe(gulp.dest('dist/views'));
}); 

gulp.task('testRev', function () {
    gulp.src('public/views/*.html')
        .pipe(rev())
        .pipe(gulp.dest('dist/views'));
});

gulp.task('build',['ugjs','css','view','images','testRev'],function() { 
	//压缩输出线上版本css、js
	console.log('done');	
});

gulp.task('reload',function() {
	browserSync.init({
        server: {
        		//配置静态服务器，启动路径
            baseDir: "./public/views/"
        }
    });
});
```



