"use strict";
const Task = require("./task");
const Logger = require("../../logger");
const del = require("del");
const FileHelper = require("../../helpers/file-helper");

module.exports = class CompileTs extends Task {

  constructor(option) {
    super(option);
    this.name = Task.cleanPrefixe + this.name;

    this.defaultOption.distCleanFilters = [this.defaultOption.outbase, this.defaultOption.tmpDir, this.defaultOption.docbase];
  }

  task(gulp) {
    return () => {
      Logger.info("Suppression de la transpilation TypeScript");
      Logger.debug("option", this.defaultOption);
      
      return del(this.defaultOption.distCleanFilters);
    };
  }
};
