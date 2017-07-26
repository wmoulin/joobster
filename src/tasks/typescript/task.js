"use strict";

const _ = require("lodash");
const gulpHelper = require("../../helpers/gulp-helper");

module.exports = class Task {

  constructor(option) {
    this.name = "ts";
    Task.cleanPrefixe = "clean:";
    Task.compilePrefixe = "compile:";
    Task.validatePrefixe = "validate:";
    Task.testPrefixe = "test:";
    Task.testRemapPrefixe = "test-remap:";
    Task.prepareTestPrefixe = "prepare-test:";
    Task.watchPrefixe = "watch:";
    Task.packagePrefixe = "package:";
    Task.webpackagePrefixe = "webpackage:";
    Task.docPrefixe = "doc:";
    Task.publishPrefixe = "publish:";

    this.taskDepends = [];

    this.defaultOption = {
      projectDir: "./",
      base : "src",
      tstbase : "tst",
      docbase: "doc",
      dir : "ts",
      fileFilter : "**/*.{ts,tsx}",
      outbase : "dist",
      outdir : "js",
      definitionDir : "definition",
      tmpDir : "tmp",
      outdirMap: "maps",
      compile: {},
      webpack: {}
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
