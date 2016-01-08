"use strict";
const Task = require("./task");
const logger = require("../../logger");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const _ = require("lodash");
const FileHelper = require("../../helpers/file-helper");

module.exports = class CompileJs extends Task {

  constructor(option) {
    super(option);
    this.taskDepends = [Task.cleanPrefixe + this.name];  
    this.name = Task.compilePrefixe + this.name;
    
    this.defaultOption.srcFilter = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.base, this.defaultOption.dir, this.defaultOption.fileFilter]);
    this.defaultOption.mapSrcFolder = this.defaultOption.outdirMap;
  }

  task(gulp) {
    return () => {
      logger.debug("Lancement de la tache " + this.name + " (Transpilation JavaScript avec Babel).");

      let gulpStream = gulp.src(this.defaultOption.srcFilter, {
          base: this.defaultOption.base
      })
      // Activation de la génération des sources maps
      .pipe(sourcemaps.init());
      // Activation de la génération typeScript
      .pipe(babel(this.defaultOption.compile));
      gulpStream.on("error", function (err) {
        logger.error("Erreur '", err.name, "' dans le fichier '", err.fileName, "' ligne <", (err.loc && err.loc.line) || "unknow"  , "> colonne <", (err.loc && err.loc.column) || "unknow" , ">.");
        logger.debug("Erreur : ", err);
      });
      return gulpStream.pipe(sourcemaps.write(this.defaultOption.mapSrcFolder))
      .pipe(gulp.dest(this.defaultOption.outdir));

    };

  }

};
