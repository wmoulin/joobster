"use strict";

const Task = require("./task");
const Logger = require("../../logger");
const watch = require("gulp-watch");
const FileHelper = require("../../helpers/file-helper");

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
      Logger.info("Activation de watch TypeScript pour transpilation");
      Logger.debug("option", this.defaultOption);      

      gulp.watch(this.defaultOption.srcFilter, {
          base: FileHelper.concatDirectory([this.defaultOption.base, this.defaultOption.dir])
      }, this.watchTaskExec)
      .on("change", function(watchEvent) {
        Logger.debug("File ", watchEvent.path, " state ", watchEvent.type || "init");
      });
    };
  }
};
