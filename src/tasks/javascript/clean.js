"use strict";
const Task = require("./task");
const logger = require("../../logger");
const _ = require("lodash");
const del = require('del');
const watch = require('gulp-watch');
const FileHelper = require("../../helpers/file-helper");

module.exports = class CompileJs extends Task {

  constructor(option) {
    super(option);
    this.name = Task.cleanPrefixe + this.name;

    this.defaultOption.distCleanFilters = [FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.outdir, this.defaultOption.dir]), FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.outdir, this.defaultOption.outdirMap, this.defaultOption.dir])];
  }

  task(gulp) {
    return () => {
      logger.debug("Suppression de la transpilation JavaScript");
      logger.info(this.defaultOption.distCleanFilters);
      
      return del(this.defaultOption.distCleanFilters);
    };
  }
};
