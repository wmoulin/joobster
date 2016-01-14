"use strict";
const Task = require("./task");
const logger = require("../../logger");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const _ = require("lodash");
const FileHelper = require("../../helpers/file-helper");
const path = require('path');

module.exports = class CompileJs extends Task {

  constructor(option) {
    super(option);
    this.taskDepends = [Task.cleanPrefixe + this.name];  
    this.name = Task.compilePrefixe + this.name;
    
    this.defaultOption.srcFilter = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.base, this.defaultOption.dir, this.defaultOption.fileFilter]);
    this.defaultOption.mapSrcFolder = FileHelper.concatDirectory([this.defaultOption.projectDir,this.defaultOption.outdir,this.defaultOption.outdirMap]);
    this.defaultOption.outSrcFolder = FileHelper.concatDirectory([this.defaultOption.projectDir,this.defaultOption.outdir]);
  }

  task(gulp) {
    return () => {
      logger.info("Lancement de la tache " + this.name + " (Transpilation JavaScript avec Babel).");

      let stream = gulp.src(this.defaultOption.srcFilter, {
          base: FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.base])
      })
      // Activation de la génération des sources maps
      .pipe(sourcemaps.init())
      // Activation de la génération typeScript
      .pipe(babel(this.defaultOption.compile));
      stream.on("error", function (err) {
        logger.error("Erreur '", err.name, "' dans le fichier '", err.fileName, "' ligne <", (err.loc && err.loc.line) || "unknow"  , "> colonne <", (err.loc && err.loc.column) || "unknow" , ">.");
        logger.debug("Erreur : ", err);
        process.exit(1);
      });
      stream = stream.pipe(sourcemaps.write(this.defaultOption.mapSrcFolder, {
        sourceMappingURL: (file) => {
          // this is how you get the relative path from a vinyl file instance
          let test = path.relative(path.dirname(file.path), file.base);

          return path.join(path.relative(path.dirname(file.path), file.base), this.defaultOption.outdirMap, file.relative) + '.map';
        }}))
      .pipe(gulp.dest(this.defaultOption.outSrcFolder));
      
      return stream;
    };

  }

};
