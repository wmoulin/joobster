"use strict";
const Task = require("./task");
const logger = require("../../logger");
const gulpTypescript = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const _ = require("lodash");
const watch = require('gulp-watch');
const FileHelper = require("../../helpers/file-helper");
const foreach = require('gulp-foreach');


module.exports = class WatchJs extends Task {

  constructor(option) {
    super(option);
    this.watchTaskExec = [Task.compilePrefixe + this.name];
    this.name = Task.watchPrefixe + this.name;
    this.taskDepends = [];
    
    this.defaultOption.srcFilter = FileHelper.concatDirectory([this.defaultOption.base, this.defaultOption.dir, this.defaultOption.fileFilter]);
    this.defaultOption.mapSrcFolder = this.defaultOption.outdirMap;

  }

  task(gulp) {
    return () => {
      logger.debug("Activation de watch TypeScript pour transpilation");

      gulp.watch(this.defaultOption.srcFilter, {
            base: this.defaultOption.base
      }, this.watchTaskExec)
      .on('change', function(watchEvent) {
        logger.debug("File ", watchEvent.path, " state ", watchEvent.type || "init");
      });
    };
  }
};
