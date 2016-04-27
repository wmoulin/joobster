"use strict";
const Task = require("./task");
const logger = require("../../logger");
const _ = require("lodash");
const FileHelper = require("../../helpers/file-helper");
const replace = require('gulp-replace');
const webpack = require('webpack-stream');

module.exports = class WebpackageJs extends Task {

  constructor(option) {
    super(option);
    this.taskDepends = [Task.packagePrefixe + this.name];
    this.name = Task.webpackagePrefixe + this.name;
    super.updateWithParameter();

    this.defaultOption.packageFilter = [FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.outdir, this.defaultOption.webpack.entry])];
    this.defaultOption.distFolder = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.outdir, "web"]);
    this.defaultOption.srcFolder = FileHelper.concatDirectory([this.defaultOption.projectDir]);
  }

  task(gulp) {
    return () => {
      logger.info("Web Package JavaScript", FileHelper.concatDirectory([this.defaultOption.base, this.defaultOption.dir]));
      logger.debug("option", this.defaultOption);

      // copie du fichier package.json
      gulp.src(this.defaultOption.packageFilter, {base: this.defaultOption.srcFolder})
      .pipe(webpack())
      .pipe(gulp.dest(this.defaultOption.distFolder))
      .on( 'finish', () => {
        logger.info("finish Package JavaScript");
      });
    };
  }
};
