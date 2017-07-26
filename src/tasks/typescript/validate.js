"use strict";
const Task = require("./task");
const Logger = require("../../logger");
const FileHelper = require("../../helpers/file-helper");
const GulpHelper = require("../../helpers/gulp-helper");
const tsLint = require("gulp-tslint");

module.exports = class TestJs extends Task {

  constructor(option) {
    super(option);
    this.name = Task.validatePrefixe + this.name;

    this.defaultOption.srcFilter = FileHelper.concatDirectory([this.defaultOption.base, this.defaultOption.dir, this.defaultOption.fileFilter]);
    this.defaultOption.tsLintConf = FileHelper.loadJsonFile(FileHelper.concatDirectory([GulpHelper.parameters.dir, "tslint.json"])) || require("./conf/tslint.json");
  }

  task(gulp) {
    return () => {
      Logger.info("Validation TypeScript");
      Logger.debug("option", this.defaultOption);

      gulp.src(this.defaultOption.srcFilter)
      .pipe(tsLint(this.defaultOption.tsLintConf))
      .pipe(tsLint.report("prose", {emitError: false}));
    };
  }
};
