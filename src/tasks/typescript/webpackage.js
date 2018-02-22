"use strict";

const Task = require("./task");
const Logger = require("../../logger");
const FileHelper = require("../../helpers/file-helper");
const webpack = require("webpack-stream");
const merge = require("webpack-merge");

module.exports = class WebpackageTs extends Task {

  constructor(option, moduleDesc) {
    super(option);
    this.taskDepends = [Task.packagePrefixe + this.name];
    this.name = Task.webpackagePrefixe + this.name;
    super.updateWithParameter();

    if (!this.defaultOption.webpack.entry){
      this.defaultOption.webpack.entry = FileHelper.extractFileName(moduleDesc.main) || "main.js";
    }

    this.defaultOption.packageFilter = [FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.outbase, this.defaultOption.outdir, this.defaultOption.webpack.entry])];
    this.defaultOption.distFolder = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.outbase, "web"]);
    this.defaultOption.srcFolder = FileHelper.concatDirectory([this.defaultOption.projectDir]);
    this.defaultOption.nodeModulesFolder = FileHelper.concatDirectory([this.defaultOption.projectDir, "node_modules"]);
  }

  task(gulp) {
    return () => {
      Logger.info("Web Package JavaScript", FileHelper.concatDirectory([this.defaultOption.base, this.defaultOption.dir]));
      Logger.debug("option", this.defaultOption);

      // copie du fichier package.json
      gulp.src(this.defaultOption.packageFilter, {base: this.defaultOption.srcFolder})
      .pipe(webpack(merge(this.defaultOption.webpack, {resolveLoader: { root: this.defaultOption.nodeModulesFolder }, output: { filename: "bundle.js"}})))
      .pipe(gulp.dest(this.defaultOption.distFolder))
      .on( "finish", () => {
        Logger.info("finish Web Package JavaScript");
      });
    };
  }
};
