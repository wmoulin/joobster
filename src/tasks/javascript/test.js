"use strict";
const Task = require("./task");
const logger = require("../../logger");
const _ = require("lodash");
const FileHelper = require("../../helpers/file-helper");
const mocha = require('gulp-mocha');
const inject = require('gulp-inject-string');
const istanbul = require('gulp-istanbul');
const replace = require('gulp-replace');
const babel = require("gulp-babel");

module.exports = class TestJs extends Task {

  constructor(option) {
    super(option);
    this.taskDepends = [Task.compilePrefixe + this.name]; // compilation Babel des tests
    this.name = Task.testPrefixe + this.name;

    this.defaultOption.tstFilter = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.baseTst, this.defaultOption.dir, this.defaultOption.fileFilter]);
    this.defaultOption.tstFolder = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.baseTst]);
    this.defaultOption.distJsFilter = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.outdir, this.defaultOption.dir, this.defaultOption.fileFilter]);
    this.defaultOption.distFolder = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.outdir]);
    this.defaultOption.tmpFolder = FileHelper.concatDirectory([this.defaultOption.projectDir,this.defaultOption.tmpDir]);
  }

  task(gulp) {
    return () => {
      logger.info("Test JavaScript");
      logger.debug(this.defaultOption.tstFilter);
      logger.debug(this.defaultOption.distJsFilter);
      
/*      gulp.src(this.defaultOption.tstFilter);
      .pipe(changeRequired);
      .pipe(gulp.dest("tmp/js"));
      .pipe(mocha({reporter: "spec"}));*/
      
      gulp.src(this.defaultOption.distJsFilter, {base: this.defaultOption.distFolder})
      // Instrumentation du code
      .pipe(istanbul({includeUntested: true}))
      .pipe(istanbul.hookRequire())
      .on( 'finish', () => {
        let stream = gulp.src( this.defaultOption.tstFilter , {base: this.defaultOption.tstFolder})
          // remplacement des require("src/...") par require("dist/...")
          .pipe(replace(/( *require\()(\"|\')([\.\/]+)\/src\/([^\"\']+[\"\']\))/g, "$1$2$3/"+ this.defaultOption.outdir +"/$4"))
          .pipe(replace(/( *import.*(?! from ).* +from +)(\"|\')([\.\/]+)\/src\/([^\"\']+[\"\'])/g, "$1$2$3/"+ this.defaultOption.outdir +"/$4"))
          .pipe(babel(this.defaultOption.compile));
        stream.on("error", function (err) {
          logger.error("Erreur '", err.name, "' dans le fichier '", err.fileName, "' ligne <", (err.loc && err.loc.line) || "unknow"  , "> colonne <", (err.loc && err.loc.column) || "unknow" , ">.");
          logger.debug("Erreur : ", err);
        });
        stream.pipe(gulp.dest(this.defaultOption.tmpFolder))
        .pipe(mocha({reporter: 'spec'}));
        stream.on("error", function (err) {
          logger.error("Erreur '", err.name, "' lors du plugin '", err.plugin, "' message '", err.message, "'");
          logger.debug("Erreur : ", err);
        });
        stream.pipe( istanbul.writeReports(
          {
            dir: FileHelper.concatDirectory([this.defaultOption.tmpFolder,"coverage"]),
            reporters: ["lcov", "text", "text-summary", "cobertura"],
            reportOpts: {dir: FileHelper.concatDirectory([this.defaultOption.tmpFolder,"coverage"])}
          }
        ) );
      } );
    };
  }
};


