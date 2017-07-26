"use strict";

const CompileJs = require("./compile");
const Task = require("./task");
const Logger = require("../../logger");
const FileHelper = require("../../helpers/file-helper");
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const replace = require('gulp-replace');
const babel = require("gulp-babel");

module.exports = class TestJs extends CompileJs {

  constructor(option) {
    super(option);
    this.taskDepends = [Task.compilePrefixe + Task.suffixe]; // compilation Babel des tests
    this.name = Task.testPrefixe + Task.suffixe;

    this.defaultOption.distJsFilter = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.outdir, this.defaultOption.dir, this.defaultOption.fileFilter]);
    this.defaultOption.distFolder = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.outdir]);
    this.defaultOption.tmpFolder = FileHelper.concatDirectory([this.defaultOption.projectDir,this.defaultOption.tmpDir]);

    super.updateWithParameter();

    this.defaultOption.tstFilter = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.baseTst, this.defaultOption.dir, this.defaultOption.fileFilter]);
    this.defaultOption.tstOtherFilter = [FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.baseTst, this.defaultOption.dir, "**/*"]), "!" + this.defaultOption.fileFilter];
    this.defaultOption.tstFolder = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.baseTst]);
  }

  task(gulp) {
    return () => {
      Logger.info("Test JavaScript");
      Logger.debug("option", this.defaultOption);

      gulp.src(this.defaultOption.distJsFilter, {base: this.defaultOption.distFolder})
      // Instrumentation du code
      .pipe(istanbul({includeUntested: true}))
      .pipe(istanbul.hookRequire())
      .on( 'finish', () => {

        // copie des fichiers de dépendances de test (json...)
        gulp.src( this.defaultOption.tstOtherFilter , {base: this.defaultOption.tstFolder})
        .pipe(gulp.dest(this.defaultOption.tmpFolder))
        .on( 'finish', () => {
          let stream = gulp.src( this.defaultOption.tstFilter , {base: this.defaultOption.tstFolder})
            // remplacement des require("src/...") par require("dist/...")
            .pipe(replace(/( *require\()(\"|\')([\.\/]+)\/src\/([^\"\']+[\"\']\))/g, "$1$2$3/"+ this.defaultOption.outdir +"/$4"))
            .pipe(replace(new RegExp("( *import.*(?! from ).* +from +)(\"|\')([\.\/]+)\/" + this.defaultOption.base + "\/([^\"\']+[\"\'])", "g"), "$1$2$3/"+ this.defaultOption.outdir +"/$4"))
            .pipe(babel(this.defaultOption.compile));
          stream.on("error", function (err) {
            Logger.error("Erreur '", err.name, "' dans le fichier '", err.fileName, "' ligne <", (err.loc && err.loc.line) || "unknow"  , "> colonne <", (err.loc && err.loc.column) || "unknow" , ">.");
            Logger.debug("Erreur : ", err);
          });
          stream = stream.pipe(gulp.dest(this.defaultOption.tmpFolder))
          .pipe(mocha({reporter: 'spec'}));
          stream.on("error", function (err) {
            Logger.error("Erreur '", err.name, "' lors du plugin '", err.plugin, "' message '", err.message, "'");
            Logger.debug("Erreur : ", err);
          });
          stream.pipe( istanbul.writeReports(
            {
              dir: FileHelper.concatDirectory([this.defaultOption.tmpFolder,"coverage"]),
              reporters: ["lcov", "text", "text-summary", "cobertura"],
              reportOpts: {dir: FileHelper.concatDirectory([this.defaultOption.tmpFolder,"coverage"])}
            }
          ) );
        } );
      } );
    };
  }
};
