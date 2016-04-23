"use strict";
const Task = require("./task");
const logger = require("../../logger");
const FileHelper = require("../../helpers/file-helper");
const tsLint = require('gulp-tslint');
const tsLintConf = require('./conf/tslint.json');
const _ = require("lodash");

module.exports = class TestJs extends Task {

  constructor(option) {
    super(option);
    this.name = Task.validatePrefixe + this.name;

    this.defaultOption.srcFilter = FileHelper.concatDirectory([this.defaultOption.base, this.defaultOption.dir, this.defaultOption.fileFilter]);
    if (option && option.validate) {
      _.merge(esLintConf, option.validate);
    }
  }

  task(gulp) {
    return () => {
      logger.debug("Validation TypeScript");

      gulp.src(this.defaultOption.srcFilter)
      .pipe(tsLint(tsLintConf))
      .pipe(tsLint.report("prose", {emitError: false}));
    };
  }
};
