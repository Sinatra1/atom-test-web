// BOOTSTRAP TEMPLATE GULPFILE
// -------------------------------------
// This file processes all of the assets in the "client" folder, combines them with the Foundation for Apps assets, and outputs the finished files in the "build" folder as a finished app.

// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var $ = require('gulp-load-plugins')();
var argv = require('yargs').argv;
var gulp = require('gulp');
var rimraf = require('rimraf');
var router = require('front-router');
var sequence = require('run-sequence');

// Check for --production flag
var isProduction = argv.production;

// 2. FILE PATHS
// - - - - - - - - - - - - - - -

var paths = {
    assets: [
        './client/**/*.*',
        '!./client/assets/{scss,js}/**/*.*'
    ],
    // Sass will check these folders for files when you use @import.
    sass: [
        'client/assets/scss',
        'node_modules/bootstrap-sass/assets/stylesheets'
    ],
    css: [
        'client/assets/scss/app.scss',
        'node_modules/mobile-drag-drop/default.css',
    ],
    // These files include Bootstrap for Apps and its dependencies
    librariesJS: [
        'node_modules/angular/angular.js',
        'node_modules/angular-route/angular-route.js',
        'node_modules/angular-cookies/angular-cookies.js',
        'node_modules/angular-ui-mask/src/mask.js',
        'node_modules/angular-ui-bootstrap/src/isClass/isClass.js',
        'node_modules/angular-ui-bootstrap/src/dateparser/dateparser.js',
        'node_modules/angular-ui-bootstrap/src/multiMap/multiMap.js',
        'node_modules/angular-ui-bootstrap/src/stackedMap/stackedMap.js',
        'node_modules/angular-ui-bootstrap/src/position/position.js',
        'node_modules/angular-ui-bootstrap/src/debounce/debounce.js',
        'node_modules/angular-ui-bootstrap/src/modal/modal.js',
        'node_modules/angular-ui-bootstrap/src/dropdown/dropdown.js',
        'bower_components/angular-isbn/src/angular-isbn.js'
    ],
    // These files are for your app's JavaScript
    appJS: [
        'client/assets/js/app.js',
        'client/assets/js/routes.js',
        'client/modules/common/models/*.js',
        'client/modules/auths/services/*.js',
        'client/modules/books/models/*.js',
        'client/modules/books/services/*.js',
        'client/modules/common/services/*.js',
        'client/modules/images/services/*.js',
        'client/modules/common/controllers/*.js',
        'client/modules/auths/controllers/*.js',
        'client/modules/users/models/*.js',
        'client/modules/users/services/*.js',
        'client/modules/reg/services/*.js',
        'client/modules/reg/controllers/*.js',
        'client/modules/books/controllers/*.js',
    ],
    images: [
        'client/modules/common/images/*.*',
    ],
    fonts: [
        'node_modules/bootstrap-sass/assets/fonts/bootstrap/*'
    ],
    uib: [
        'node_modules/angular-ui-bootstrap/template/**/*.*'
    ]
}

// 3. TASKS
// - - - - - - - - - - - - - - -

// Cleans the build directory
gulp.task('clean', function (cb) {
    rimraf('./build', cb);
});

// Copies everything in the client folder except templates, Sass, and JS
gulp.task('copy', function () {
    return gulp.src(paths.assets, {
        base: './client/'
    })
            .pipe(gulp.dest('./build'))
            ;
});

// Compiles Sass
gulp.task('sass', function () {
    var minifyCss = $.if(isProduction, $.minifyCss());

    return gulp.src(paths.css)
            .pipe($.sass({
                includePaths: paths.sass,
                outputStyle: (isProduction ? 'compressed' : 'nested'),
                errLogToConsole: true
            }))
            .pipe($.autoprefixer({
                browsers: ['last 2 versions', 'ie 10']
            }))
            .pipe(minifyCss)
            .pipe(gulp.dest('./build/assets/css/'))
            ;
});

// Compiles and copies the Foundation for Apps JavaScript, as well as your app's custom JS
gulp.task('uglify', ['uglify:libraries', 'uglify:app'])

gulp.task('uglify:libraries', function (cb) {
    var uglify = $.if(isProduction, $.uglify()
            .on('error', function (e) {
                console.log(e);
            }));

    return gulp.src(paths.librariesJS)
            .pipe(uglify)
            .pipe($.concat('libraries.js'))
            .pipe(gulp.dest('./build/assets/js/'))
            ;
});

gulp.task('uglify:app', function () {
    var uglify = $.if(isProduction, $.uglify()
            .on('error', function (e) {
                console.log(e);
            }));

    return gulp.src(paths.appJS)
            .pipe(uglify)
            .pipe($.concat('app.js'))
            .pipe(gulp.dest('./build/assets/js/'))
            ;
});

gulp.task('images', function () {
    return gulp.src(paths.images, {
        base: './client/modules/'
    })
            .pipe(gulp.dest('./build/assets/images/'))
            ;
});

gulp.task('fonts', function () {
    return gulp.src(paths.fonts)
            .pipe(gulp.dest('./build/assets/fonts/'))
            ;
});

gulp.task('uib', function () {
    return gulp.src(paths.uib)
            .pipe(gulp.dest('./build/uib/template/'))
            ;
});

// Starts a test server, which you can view at http://localhost:8079
gulp.task('server', ['build'], function () {
    gulp.src('./build')
            .pipe($.webserver({
                port: 8078,
                host: 'localhost',
                fallback: 'index.html',
                livereload: true,
                open: true
            }))
            ;
});

// Builds your entire app once, without starting a server
gulp.task('build', function (cb) {
    sequence('clean', ['copy', 'uglify:libraries', 'sass', 'images', 'fonts', 'uib', 'uglify'], cb);
});

// Default task: builds your app, starts a server, and recompiles assets when they change
gulp.task('default', ['server'], function () {
    // Watch Sass
    gulp.watch(paths.sass, ['sass']);

    // Watch JavaScript
    gulp.watch([paths.appJS], ['uglify:app']);

    gulp.watch([paths.assets], ['copy']);
});
