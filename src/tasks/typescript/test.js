"use strict";

const Task = require("./task");
const Logger = require("../../logger");
const FileHelper = require("../../helpers/file-helper");
const GulpHelper = require("../../helpers/gulp-helper");
const mocha = require("gulp-mocha");
const istanbul = require("gulp-istanbul");
const gulpTypescript = require("gulp-typescript");
const replace = require("gulp-replace");
const fs = require("fs");

module.exports = class TestJs extends Task {

  constructor(option) {
    super(option);
    this.taskDepends = [Task.compilePrefixe + this.name]; // transpilation
    this.name = Task.testPrefixe + this.name;

    this.defaultOption.tmpFolder = FileHelper.concatDirectory([this.defaultOption.projectDir,this.defaultOption.tmpDir]);
    this.defaultOption.distFolder = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.outbase, this.defaultOption.outdir]);

    super.updateWithParameter();
    this.defaultOption.tstFilter = FileHelper.concatDirectory([this.defaultOption.tstbase, this.defaultOption.dir, this.defaultOption.fileFilter]);
    this.defaultOption.tstOtherFilter = [FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.tstbase, this.defaultOption.dir, "**/*"]), "!" + this.defaultOption.fileFilter];
    this.defaultOption.distTsFilter = FileHelper.concatDirectory([this.defaultOption.outbase, this.defaultOption.outdir, "**/*.js",]);
    this.defaultOption.tmpJsFilter = FileHelper.concatDirectory([this.defaultOption.tmpDir, "**/*.js",]);
  }

  task(gulp) {
    return (done) => {

      Logger.info("Test TypeScript");
      Logger.debug("option", this.defaultOption);

      gulp.src(this.defaultOption.distTsFilter, {
          base: this.defaultOption.distFolder
      })
      // Instrumentation du code
      .pipe(istanbul({includeUntested: true}))
      .pipe(istanbul.hookRequire())
      .on( "finish", () => {

        // copie des fichiers de dépendances de test (json...)
        gulp.src( this.defaultOption.tstOtherFilter , {base: this.defaultOption.tstFolder})
        .pipe(gulp.dest(this.defaultOption.tmpFolder))
        .on( "finish", () => {
          let tsProject = gulpTypescript.createProject(FileHelper.concatDirectory([GulpHelper.parameters.dir, "tsconfig.json"]), {
              traceResolution: true,
              typescript: require((this.defaultOption.typescript && this.defaultOption.typescript.bin) || "typescript") // permet de forcer la version de typescript déclarée dans le builder plutôt que celle du plugin gulp-typescript
          });

          let tsResult = gulp.src(this.defaultOption.tstFilter, {
            base: this.defaultOption.tstbase
          });

          // Activation de la génératsProjecttion typeScript
          tsResult = tsResult.pipe(tsProject(gulpTypescript.reporter.defaultReporter()));
          tsResult.on("error", function (err) {
            Logger.error("Erreur '", err.name, "' cause '", err.diagnostic.messageText, "' dans le fichier '", err.relativeFilename, "' ligne <", (err.startPosition && err.startPosition.line) || "unknow"  , "> colonne <", (err.startPosition && err.startPosition.character) || "unknow" , ">.");
          });

          let jsStream = tsResult.js
          // remplacement des require("src/...") par require("dist/...")
          .pipe(replace(/(require\()(\"|\')([\.\/]+)\/src\/ts\/([^\"\']*[\"\']\))/, "$1$2$3/" + this.defaultOption.outbase + "/" + this.defaultOption.outdir + "/$4"))
          .pipe(replace(new RegExp("( *import.*(?! from ).* +from +)(\"|\')([\.\/]+)\/" + this.defaultOption.base + "\/" + this.defaultOption.dir + "\/([^\"\']+[\"\'])", "g"), "$1$2$3/"+ this.defaultOption.outbase + "/" + this.defaultOption.outdir +"/$4"))
          .pipe(gulp.dest(this.defaultOption.tmpFolder))
          // Lancement des tests
          .pipe(mocha({reporter: "spec"}))
          .pipe(istanbul.writeReports(
            {
              dir: FileHelper.concatDirectory([this.defaultOption.tmpDir, "coverage"]),
              reporters: ["text", "json"]
            }
          )).on("finish", () => {
            let timeout = setInterval(() => {
              if(fs.existsSync(FileHelper.concatDirectory([GulpHelper.parameters.dir, this.defaultOption.tmpDir, "coverage", "coverage-final.json"]))) {
                clearInterval(timeout)
                done();
              }
            }, 1000);
          });
        } );
      } );
    };
  }
};
