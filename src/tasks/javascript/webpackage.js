"use strict";
const Task = require("./task");
const logger = require("../../logger");
const _ = require("lodash");
const FileHelper = require("../../helpers/file-helper");
const replace = require('gulp-replace');
const webpack = require('webpack-stream');

module.exports = class WebpackageJs extends Task {

  constructor(option, moduleDesc) {
    super(option);
    this.taskDepends = [Task.packagePrefixe + this.name];
    this.name = Task.webpackagePrefixe + this.name;
    super.updateWithParameter();

    if (!this.defaultOption.webpack || !this.defaultOption.webpack.entry){
      this.defaultOption.webpack = {
        entry: FileHelper.extractFileName(moduleDesc.main) || "main.js"
      };
    }

    this.defaultOption.packageFilter = [FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.outdir, this.defaultOption.dir, this.defaultOption.webpack.entry])];
    this.defaultOption.distFolder = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.outdir, "web"]);
    this.defaultOption.srcFolder = FileHelper.concatDirectory([this.defaultOption.projectDir]);
    this.defaultOption.nodeModulesFolder = FileHelper.concatDirectory([this.defaultOption.projectDir, "node_modules"]);
  }

  task(gulp) {
    return () => {
      logger.info("Web Package JavaScript", FileHelper.concatDirectory([this.defaultOption.base, this.defaultOption.dir]));
      logger.debug("option", this.defaultOption);

      // copie du fichier package.json
      gulp.src(this.defaultOption.packageFilter, {base: this.defaultOption.srcFolder})
      .pipe(webpack({resolveLoader: { root: this.defaultOption.nodeModulesFolder }, output: { filename: "bundle.js"}}))
      .pipe(gulp.dest(this.defaultOption.distFolder))
      .on( 'finish', () => {
        logger.info("finish Web Package JavaScript");
      });
    };
  }
};
