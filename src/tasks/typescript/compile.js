"use strict";
const Task = require("./task");
const logger = require("../../logger");
const gulpTypescript = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const _ = require("lodash");
const FileHelper = require("../../helpers/file-helper");

module.exports = class CompileJs extends Task {

  constructor(option) {
    super(option);
    this.taskDepends = [Task.cleanPrefixe + this.name];  
    this.name = Task.compilePrefixe + this.name;
    
    this.defaultOption.srcFilter = FileHelper.concatDirectory([this.defaultOption.base, this.defaultOption.dir, this.defaultOption.fileFilter]);
    this.defaultOption.mapSrcFolder = this.defaultOption.outdirMap;
  }

  task(gulp) {
    return () => {
      logger.debug("Lancement de la tache " + this.name + " (Transpilation JavaScript avec TypeScript).");

      let stream = gulp.src(this.defaultOption.srcFilter, {
          base: this.defaultOption.base
      })
      // Activation de la génération des sources maps
      .pipe(sourcemaps.init())
      // Activation de la génération typeScript
      .pipe(gulpTypescript(this.defaultOption.compile, undefined, gulpTypescript.reporter.defaultReporter()))
      stream.on("error", function (err) {
        logger.error("Erreur '", err.name, "' cause '", err.diagnostic.messageText, "' dans le fichier '", err.relativeFilename, "' ligne <", (err.startPosition && err.startPosition.line) || "unknow"  , "> colonne <", (err.startPosition && err.startPosition.character) || "unknow" , ">.");
      });
      return stream.js
      .pipe(sourcemaps.write(this.defaultOption.mapSrcFolder))
      .pipe(gulp.dest(this.defaultOption.outdir));
    };

  }

};
