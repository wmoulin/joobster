"use strict";

const Task = require("./task");
const Logger = require("../../logger");
const FileHelper = require("../../helpers/file-helper");
const replace = require("gulp-replace");
const del = require("del");

module.exports = class PackageTs extends Task {

  constructor(option) {
    super(option);
    this.taskDepends = [Task.cleanPrefixe + this.name, Task.compilePrefixe + this.name];
    this.name = Task.packagePrefixe + this.name;
    super.updateWithParameter();

    this.defaultOption.packageFilter = [FileHelper.concatDirectory([this.defaultOption.projectDir, "*.*"]),
                                        "!" + FileHelper.concatDirectory([this.defaultOption.projectDir, "*.gitignore"]),
                                        "!" + FileHelper.concatDirectory([this.defaultOption.projectDir, "joobster.json"]),
                                        "!" + FileHelper.concatDirectory([this.defaultOption.projectDir, "tsconfig.json"]),
                                        "!" + FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.base, this.defaultOption.fileFilter])];
    option.packageIncludeFilters.forEach((includeFilter) => {
      this.defaultOption.packageFilter.unshift(FileHelper.concatDirectory([this.defaultOption.projectDir, includeFilter]));
    });
    this.defaultOption.distFolder = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.outdir]);
    this.defaultOption.srcFolder = FileHelper.concatDirectory([this.defaultOption.projectDir]);
  }

  task(gulp) {
    return (done) => {
      Logger.info("Package JavaScript");
      Logger.debug("option", this.defaultOption);

      // copie des fichiers
      gulp.src(this.defaultOption.packageFilter)
      .pipe(replace(new RegExp("([\.\/]+)\/" + this.defaultOption.base + "\/" + this.defaultOption.dir + "\/(.*)", "g"), "$1/" + this.defaultOption.outdir + "/$2"))
      .pipe(gulp.dest(this.defaultOption.outbase))
      .on( "finish", () => {
        del([FileHelper.concatDirectory([this.defaultOption.outbase, this.defaultOption.outdirMap])], {force: true})
      });
    };
  }
};
