"use strict";
const Task = require("./task");
const logger = require("../../logger");
const _ = require("lodash");
const FileHelper = require("../../helpers/file-helper");
const mocha = require('gulp-mocha');
const inject = require('gulp-inject-string');
const istanbul = require('gulp-istanbul');
const gulpTypescript = require("gulp-typescript");
const replace = require('gulp-replace');

module.exports = class TestJs extends Task {

  constructor(option) {
    super(option);
    this.taskDepends = [Task.compilePrefixe + this.name]; // compilation Babel
    this.name = Task.testPrefixe + this.name;

    this.defaultOption.tstFilter = FileHelper.concatDirectory([this.defaultOption.baseTst, this.defaultOption.dir, this.defaultOption.fileFilter]);
    this.defaultOption.distTsFilter = FileHelper.concatDirectory([this.defaultOption.outdir, this.defaultOption.dir, this.defaultOption.fileFilter]);
  }

  task(gulp) {
    return () => {
      logger.debug("Test TypeScript");
      
      let stream = gulp.src(this.defaultOption.distTsFilter, {base: this.defaultOption.outdir})
      // Instrumentation du code
      .pipe(istanbul({includeUntested: true}))
      .pipe(istanbul.hookRequire());
      stream.on( 'finish', () => {
        gulp.src(this.defaultOption.tstFilter , {base: this.defaultOption.baseTst})
        // transpilation des TU's
        .pipe(gulpTypescript(this.defaultOption.compile, undefined, gulpTypescript.reporter.nullReporter()))
        // remplacement des require("src/...") par require("dist/...")
        .pipe(replace(/(require\()(\"|\')([\.\/]+)\/src\/([^\"\']*[\"\']\))/, '$1$2$3/dist/$4'))
        .pipe(gulp.dest(this.defaultOption.tmpDir))
        // Lancement des tests
        .pipe(mocha({reporter: 'spec'}))
        .pipe(istanbul.writeReports(
          {
            dir: FileHelper.concatDirectory([this.defaultOption.tmpDir,"coverage"]),
            reporters: ["lcov", "text", "text-summary", "cobertura"],
            reportOpts: {dir: FileHelper.concatDirectory([this.defaultOption.tmpDir,"coverage"])}
          }
        ) );
      } );
    };
  }
};


