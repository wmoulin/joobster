"use strict";

const Task = require("./task");
const Logger = require("../../logger");
const gulpTypescript = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const merge = require("merge2");
const FileHelper = require("../../helpers/file-helper");
const GulpHelper = require("../../helpers/gulp-helper");

module.exports = class CompileJs extends Task {

  constructor(option) {
    super(option);
    this.taskDepends = [Task.cleanPrefixe + this.name];  
    this.name = Task.compilePrefixe + this.name;
    
    this.defaultOption.srcFilter = FileHelper.concatDirectory([this.defaultOption.base, this.defaultOption.dir, this.defaultOption.fileFilter]);
    this.defaultOption.mapSrcFolder = this.defaultOption.outdirMap;
    this.defaultOption.outDefFolder = FileHelper.concatDirectory([this.defaultOption.outbase, this.defaultOption.definitionDir]);
  }

  task(gulp) {

    let tsProject = gulpTypescript.createProject(FileHelper.concatDirectory([GulpHelper.parameters.dir, "tsconfig.json"]), {
        traceResolution: true,
        typescript: require((this.defaultOption.typescript && this.defaultOption.typescript.bin) || "typescript") // permet de forcer la version de typescript déclarée dans le builder plutôt que celle du plugin gulp-typescript
    });


    return () => {
      Logger.info("Lancement de la tache " + this.name + " (Transpilation JavaScript avec TypeScript).");
      Logger.debug("option", this.defaultOption);

      let tsResult = gulp.src(this.defaultOption.srcFilter, {
          base: FileHelper.concatDirectory([this.defaultOption.base, this.defaultOption.dir])
      });
      // Activation de la génération des sources maps
      if (this.defaultOption.compile && this.defaultOption.compile.activeMap) {
        tsResult = tsResult.pipe(sourcemaps.init());
      }
      // Activation de la génération typeScript
      tsResult = tsResult.pipe(tsProject(gulpTypescript.reporter.defaultReporter()));
      tsResult.on("error", function (err) {
        Logger.error("Erreur '", err.name, "' cause '", err.diagnostic.messageText, "' dans le fichier '", err.relativeFilename, "' ligne <", (err.startPosition && err.startPosition.line) || "unknow"  , "> colonne <", (err.startPosition && err.startPosition.character) || "unknow" , ">.");
      });

      let jsStream = tsResult.js;
      if (this.defaultOption.compile && this.defaultOption.compile.activeMap) {
        jsStream = jsStream
            .pipe(sourcemaps.write(FileHelper.concatDirectory(["..", this.defaultOption.mapSrcFolder]), {sourceRoot: FileHelper.concatDirectory(["../../",this.defaultOption.base, this.defaultOption.dir])}));
      }
      return merge([
        jsStream
          .pipe(gulp.dest(FileHelper.concatDirectory([this.defaultOption.outbase, this.defaultOption.outdir]))),
        tsResult.dts.pipe(gulp.dest(this.defaultOption.outDefFolder))
      ]);
    };

  }

};
