"use strict";

const Task = require("./task");
const Logger = require("../../logger");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const watch = require('gulp-watch');
const FileHelper = require("../../helpers/file-helper");
const foreach = require('gulp-foreach');


module.exports = class WatchJs extends Task {

  constructor(option) {
    super(option);
    this.name = Task.watchPrefixe + this.name;
    this.taskDepends = [];
    super.updateWithParameter();

    this.defaultOption.srcFilter = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.base, this.defaultOption.dir, this.defaultOption.fileFilter]);
    this.defaultOption.mapSrcFolder = this.defaultOption.outdirMap;

  }

  task(gulp) {
    return () => {
      Logger.info("Activation de watch JavaScript pour transpilation avec Babel");
      Logger.debug(this.defaultOption.srcFilter);
      Logger.debug(this.defaultOption.base);

      gulp.src(this.defaultOption.srcFilter, {
            base: this.defaultOption.base
      })
      .pipe(watch(this.defaultOption.srcFilter, {base: this.defaultOption.base},
        (watchEvent) => {
          Logger.info("File ", watchEvent.path, " state ", watchEvent.event || "init");
          Logger.debug("watchEvent ", watchEvent.path);

          compile.bind(this)(gulp, gulp.src(watchEvent.path, {
                base: watchEvent.base
          }));

        }))
      .pipe(foreach((stream, file) => {
        return compile.bind(this)(gulp, stream);
      })).on("error", function (err) {
        Logger.error("Erreur '", err.name, "' dans le fichier '", err.fileName, "' ligne <", (err.loc && err.loc.line) || "unknow"  , "> colonne <", (err.loc && err.loc.column) || "unknow" , ">.");
        Logger.debug("Erreur : ", err);
      });

    };
  }
};

var compile = function(gulp, stream) {
  // Activation de la génération des sources maps
  let streamWatch = stream.pipe(sourcemaps.init())
  // Activation de la transpilation JavaScript
  .pipe(babel(this.defaultOption.compile));
  streamWatch.on("error", function (err) {
    Logger.error("Erreur '", err.name, "' dans le fichier '", err.fileName, "' ligne <", (err.loc && err.loc.line) || "unknow"  , "> colonne <", (err.loc && err.loc.column) || "unknow" , ">.");
    Logger.debug("Erreur : ", err);
  });
  streamWatch = streamWatch.pipe(sourcemaps.write(this.defaultOption.mapSrcFolder))
  .pipe(gulp.dest(this.defaultOption.outdir));
  return streamWatch;
}
