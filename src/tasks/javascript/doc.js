"use strict";
const Task = require("./task");
const logger = require("../../logger");
const del = require('del');
const FileHelper = require("../../helpers/file-helper");
const jsdoc = require("gulp-jsdoc3");

module.exports = class CompileJs extends Task {

  constructor(option) {
    super(option);
    this.name = Task.docPrefixe + this.name;
    super.updateWithParameter();

    this.defaultOption.srcFilter = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.base, this.defaultOption.dir, this.defaultOption.fileFilter]);
    this.defaultOption.docFilter = FileHelper.concatDirectory([this.defaultOption.projectDir,this.defaultOption.docDir, "**"]);
    this.defaultOption.docFolder = FileHelper.concatDirectory([this.defaultOption.projectDir,this.defaultOption.docDir]);

  }

  task(gulp) {
    return () => {
      logger.info("génération de la documentation JavaScript");
      logger.debug(this.defaultOption);

      del([this.defaultOption.docFilter], {force: true})
      .on( 'finish', () => {
        return gulp.src(this.defaultOption.srcFilter)
        .pipe(jsdoc({opts: { destination: this.defaultOption.docFolder}}));
      });
    };
  }
};
