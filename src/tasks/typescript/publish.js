"use strict";

const Task = require("./task");
const Logger = require("../../logger");
const FileHelper = require("../../helpers/file-helper");
const jsdoc = require("gulp-jsdoc3");
const npm = require("npm");

module.exports = class PublishTs extends Task {

  constructor(option) {
    super(option);
    this.taskDepends = [Task.packagePrefixe + this.name];
    this.name = Task.publishPrefixe + this.name;
    super.updateWithParameter();

    this.defaultOption.outSrcFolder = FileHelper.concatDirectory([this.defaultOption.projectDir,this.defaultOption.outbase]);

  }

  task(gulp) {
    return (done) => {
      Logger.info("Publication du module JavaScript");
      Logger.debug("option", this.defaultOption);

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
