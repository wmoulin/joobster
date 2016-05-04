"use strict";
const _ = require("lodash");
const logger = require("../../logger");
const gulpHelper = require("../../helpers/gulp-helper");
const FileHelper = require("../../helpers/file-helper");

module.exports = class Task {


  constructor(option) {
    Task.suffixe = "js";
    Task.cleanPrefixe = "clean:";
    Task.compilePrefixe = "compile:";
    Task.validatePrefixe = "validate:";
    Task.testPrefixe = "test:";
    Task.prepareTestPrefixe = "prepare-test:";
    Task.watchPrefixe = "watch:";
    Task.packagePrefixe = "package:";
    Task.webpackagePrefixe = "webpackage:";
    Task.docPrefixe = "doc:";
    Task.publishPrefixe = "publish:";

    this.name = Task.suffixe;

    this.taskDepends = [];

    this.defaultOption = {
      projectDir: "./",
      base: "src",
      baseTst: "tst",
      dir: "js",
      fileFilter: "**/*.js",
      outdir: "dist",
      docDir: "doc",
      tmpDir: "tmp",
      activeMap: true,
      outdirMap: "maps",
      compile: {},
      webpack: {}
    };

    if (option) {
      _.assignInWith(this.defaultOption, option, (defaultValue, newValue, key, object, source) => {
        if (key && (key === "compile")) {
          return defaultValue;
        } else {
          return typeof(newValue) != "undefined" ? newValue : defaultValue;
        }
      });

    }

    if (gulpHelper.parameters.dir) {
      this.defaultOption.projectDir = FileHelper.concatDirectory([gulpHelper.parameters.dir, this.defaultOption.projectDir]);
    }

  }


  updateWithParameter() {
    if (gulpHelper.parameters.task.indexOf(this.name) > -1 && gulpHelper.parameters.files) {
      this.defaultOption.fileFilter = gulpHelper.parameters.files;
    }
  }
};
