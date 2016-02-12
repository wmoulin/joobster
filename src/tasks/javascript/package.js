"use strict";
const Task = require("./task");
const logger = require("../../logger");
const _ = require("lodash");
const FileHelper = require("../../helpers/file-helper");
const replace = require('gulp-replace');

module.exports = class TestJs extends Task {

  constructor(option) {
    super(option);
    this.taskDepends = [Task.compilePrefixe + this.name]; // compilation Babel des tests
    this.name = Task.packagePrefixe + this.name;

    this.defaultOption.packageFilter = [FileHelper.concatDirectory([this.defaultOption.projectDir, "*.*"]),
                                        "!" + FileHelper.concatDirectory([this.defaultOption.projectDir, "*.gitignore"]),
                                         "!" + FileHelper.concatDirectory([this.defaultOption.projectDir, "joobster.json"])];
    this.defaultOption.distFolder = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.outdir]);
    this.defaultOption.srcFolder = FileHelper.concatDirectory([this.defaultOption.projectDir]);
  }

  task(gulp) {
    return () => {
      logger.info("Package JavaScript", FileHelper.concatDirectory([this.defaultOption.base, this.defaultOption.dir]));
      logger.debug(this.defaultOption.distFolder);

      // copie du fichier package.json
      gulp.src(this.defaultOption.packageFilter, {base: this.defaultOption.srcFolder})
      .pipe(replace(new RegExp("(\"|\')([\.\/]+)\/" + this.defaultOption.base + "\/([^\"\']+[\"\'])", "g"), "$1$2/$3"))
      .pipe(gulp.dest(this.defaultOption.distFolder))
      .on( 'finish', () => {
        logger.info("finish Package JavaScript");
      });
    };
  }
};
