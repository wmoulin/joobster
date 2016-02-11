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
    this.defaultOption.srcOtherFilter = [FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.base, this.defaultOption.dir, "**/*"]), "!" + this.defaultOption.fileFilter];
    this.defaultOption.srcFolder = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.base]);
    this.defaultOption.mapSrcFolder = FileHelper.concatDirectory([this.defaultOption.projectDir,this.defaultOption.outdir,this.defaultOption.outdirMap]);
    this.defaultOption.outSrcFolder = FileHelper.concatDirectory([this.defaultOption.projectDir,this.defaultOption.outdir]);

    logger.debug("option", this.defaultOption);

  }

  task(gulp) {
    return (done) => {
      logger.info("Lancement de la tache " + this.name + " (Transpilation JavaScript avec Babel).");

      // copie des autres fichiers (html, json...)
      let streamOther = gulp.src(this.defaultOption.srcOtherFilter , { base: this.defaultOption.srcFolder })
      .pipe(gulp.dest(this.defaultOption.outSrcFolder));
      streamOther.on( 'finish', () => {

        let stream = gulp.src(this.defaultOption.srcFilter, { base: this.defaultOption.srcFolder });
        if (this.defaultOption.actineMap) {
          // Activation de la génération des sources maps
          stream = stream.pipe(sourcemaps.init());
        }
        // Activation de la génération typeScript
        stream = stream.pipe(babel(this.defaultOption.compile));
        stream.on("error", function (err) {
          logger.error("Erreur '", err.name, "' dans le fichier '", err.fileName, "' ligne <", (err.loc && err.loc.line) || "unknow"  , "> colonne <", (err.loc && err.loc.column) || "unknow" , ">.");
          logger.debug("Erreur : ", err);
          process.exit(1);
        });
        if (this.defaultOption.actineMap) {
          stream = stream.pipe(sourcemaps.write(this.defaultOption.mapSrcFolder, {
            sourceMappingURL: (file) => {
              // this is how you get the relative path from a vinyl file instance
              let test = path.relative(path.dirname(file.path), file.base);

              return path.join(path.relative(path.dirname(file.path), file.base), this.defaultOption.outdirMap, file.relative) + '.map';
            }}))
        }
        stream = stream.pipe(gulp.dest(this.defaultOption.outSrcFolder));
        stream.on( 'finish', () => {
          done();
        });
      });
    }
  }

};
