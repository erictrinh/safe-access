var gulp = require('gulp'),
  gutil = require('gulp-util'),
  notifier = require('node-notifier'),
  mocha = require('gulp-mocha');

gulp.task('test', function() {
  gulp.src('test.js')
    .pipe(mocha({ reporter: 'spec' }))
    .on('error', errorHandler.bind(this, 'test'));
});

gulp.task('default', function() {
  var changed = function(e) {
    console.log('File ' + e.path + ' was ' + e.type + ', running tasks...');
  };
  gulp.watch('*.js', ['test']).on('change', changed);
});

function errorHandler(taskName) {
  gutil.log.call(gutil.log, arguments);

  notifier.notify({
    title: taskName + ' error',
    message: 'An error occured while processing'
  });
}
