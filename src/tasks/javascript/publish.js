"use strict";
const Task = require("./task");
const logger = require("../../logger");
const del = require('del');
const FileHelper = require("../../helpers/file-helper");
const jsdoc = require("gulp-jsdoc3");
const npm = require("npm");

module.exports = class PublishJs extends Task {

  constructor(option) {
    super(option);
    this.taskDepends = [Task.packagePrefixe + this.name];
    this.name = Task.publishPrefixe + this.name;
    super.updateWithParameter();

    this.defaultOption.outSrcFolder = FileHelper.concatDirectory([this.defaultOption.projectDir,this.defaultOption.outdir]);

  }

  task(gulp) {
    return (done) => {
      logger.info("Publication du module JavaScript");
      logger.debug("option", this.defaultOption);

      npm.load({}, (error) => {
        if (error) done(error);
        npm.config.set("force", "true");
        npm.config.set("access", "public");
        npm.commands.publish([this.defaultOption.outSrcFolder], (error) => {
          done(error);
        });

      });
    };
  }
};
