"use strict";

const Task = require("./task");
const logger = require("../../logger");
const del = require("del");
const FileHelper = require("../../helpers/file-helper");
const jsdoc = require("gulp-jsdoc3");

module.exports = class DocJs extends Task {

  constructor(option) {
    super(option);
    this.taskDepends = [Task.compilePrefixe + this.name];
    this.name = Task.docPrefixe + this.name;
    super.updateWithParameter();

    this.defaultOption.srcFilter = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.base, this.defaultOption.dir, this.defaultOption.fileFilter]);
    this.defaultOption.docFilter = FileHelper.concatDirectory([this.defaultOption.projectDir,this.defaultOption.docbase, "**", "*.*"]);
    this.defaultOption.docFolder = FileHelper.concatDirectory([this.defaultOption.projectDir,this.defaultOption.docbase]);

  }

  task(gulp) {
    return (done) => {
      logger.info("génération de la documentation JavaScript");
      logger.debug("option", this.defaultOption);

      del([this.defaultOption.docbase], {force: true}).then(() => {
        gulp.src(this.defaultOption.srcFilter)
        .pipe(jsdoc({opts: { destination: this.defaultOption.docFolder}}, () => {}))
        .on("finish", () => {
          done();
        });
      })
    };
  }
};
