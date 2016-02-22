"use strict";
const _ = require("lodash");
const logger = require("../../logger");
const gulpHelper = require("../../helpers/gulp-helper");

module.exports = class Task {

  constructor(option) {
    this.name = "ts";
    Task.cleanPrefixe = "clean:";
    Task.compilePrefixe = "compile:";
    Task.validatePrefixe = "validate:";
    Task.testPrefixe = "test:";
    Task.watchPrefixe = "watch:";

    this.taskDepends = [];

    this.defaultOption = {
      base : "src",
      baseTst : "tst",
      dir : "ts",
      fileFilter : "**/*.ts",
      outdir : "dist",
      tmpDir : "tmp",
      outdirMap: "maps",
      compile : {
        target: "ES5",
        module: "commonjs",
        declaration: true,
        sortOutput: true,
        noExternalResolve: true,
        jsx: 'react',
        moduleResolution: 'classic',
        experimentalDecorators: true
      }
    };

    if (option && option.compile) {
      _.assign(this.defaultOption.compile, option.compile);
    }
  }

  updateWithParameter() {
    if (gulpHelper.parameters.task.indexOf(this.name) > -1  && gulpHelper.parameters.files) {
      this.defaultOption.fileFilter = gulpHelper.parameters.files;
    }
  }

};
