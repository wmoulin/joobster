"use strict";
const Task = require("./task");
const logger = require("../../logger");
const FileHelper = require("../../helpers/file-helper");
const esLint = require('gulp-eslint');
const esLintConf = require('./conf/eslint.json');
const _ = require("lodash");

module.exports = class TestJs extends Task {

  constructor(option) {
    super(option);
    this.name = Task.validatePrefixe + this.name;
    super.updateWithParameter();
    
    this.defaultOption.srcFilter = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.base, this.defaultOption.dir, this.defaultOption.fileFilter]);
    if (option && option.validate) {
      _.merge(esLintConf, option.validate);
    }
  }

  task(gulp) {
    return () => {
      logger.info("Validation JavaScript");

      let gulpResult = gulp.src(this.defaultOption.srcFilter);
      gulpResult = gulpResult.pipe(esLint(esLintConf));
      gulpResult = gulpResult.pipe(esLint.format());
    };
  }
};
