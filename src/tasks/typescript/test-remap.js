"use strict";

const Task = require("./task");
const Logger = require("../../logger");
const FileHelper = require("../../helpers/file-helper");
const GulpHelper = require("../../helpers/gulp-helper");
const mocha = require("gulp-mocha");
const istanbul = require("gulp-istanbul");
const gulpTypescript = require("gulp-typescript");
const replace = require("gulp-replace");
const remapIstanbul = require("remap-istanbul/lib/gulpRemapIstanbul");
const fs = require("fs");

module.exports = class TestRemapJs extends Task {

  constructor(option) {
    super(option);
    this.taskDepends = [Task.testPrefixe + this.name];
    this.name = Task.testRemapPrefixe + this.name;

    super.updateWithParameter();

  }

  task(gulp) {
    return () => {

      Logger.info("Remap Test TypeScript");
      Logger.debug("option", this.defaultOption);

      return gulp.src(FileHelper.concatDirectory([this.defaultOption.tmpDir, "coverage", "coverage-final.json"]))
      .pipe(remapIstanbul({
        fail: true,
        reports: {
          'json': FileHelper.concatDirectory([this.defaultOption.tmpDir, "coverage", "coverage_remap.json"]),
          'text': FileHelper.concatDirectory([this.defaultOption.tmpDir, "coverage", "coverage_remap.txt"]),
        }
      })).on('finish', () => {
        var coverageReport = fs.readFileSync(FileHelper.concatDirectory([this.defaultOption.tmpDir, "coverage", "coverage_remap.txt"]), "utf8");
        console.log('\x1b[33m%s\x1b[0m', "Calculate with typescript source :"); 
        process.stdout.write(coverageReport);
      });
    };
  }
};
