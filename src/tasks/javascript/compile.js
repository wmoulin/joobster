"use strict";

const Task = require("./task");
const Logger = require("../../logger");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const _ = require("lodash");
const FileHelper = require("../../helpers/file-helper");
const path = require('path');


const presetsObject = {
  es2015: require("babel-preset-es2015"),
  "stage-0": require("babel-preset-stage-0"),
  "stage-1": require("babel-preset-stage-1"),
  "react": require("babel-preset-react")
};

const pluginsObject = {
  "transform-es2015-modules-commonjs": require("babel-plugin-transform-es2015-modules-commonjs"),
  "transform-decorators": require("babel-plugin-transform-decorators"),
  "transform-decorators-legacy": require("babel-plugin-transform-decorators-legacy").default,
  "transform-es2015-modules-systemjs": require("babel-plugin-transform-es2015-modules-systemjs"),
  "transform-class-properties": require("babel-plugin-transform-class-properties")
}

module.exports = class CompileJs extends Task {

  constructor(option) {

    super(option);
    this.taskDepends = [Task.cleanPrefixe + this.name];
    this.name = Task.compilePrefixe + this.name;

    this.defaultOption .compile = {
      presets: [presetsObject["es2015"]],
    };

    if (option.compile) {
      _.assignInWith(this.defaultOption.compile, option.compile, (defaultValue, newValue, key, object, source) => {
        if (key && (key === "presets" || key === "plugins")) {
          return undefined;
        } else {
          return newValue || defaultValue;
        }

      });

      if (option.compile.plugins) {
        this.defaultOption.compile.plugins = mapOption(option.compile.plugins, pluginsObject) || this.defaultOption.compile.plugins;
      }
      if (option.compile.presets) {
        this.defaultOption.compile.presets = mapOption(option.compile.presets, presetsObject) || this.defaultOption.compile.presets;
      }
    }


    super.updateWithParameter();

    this.defaultOption.srcFilter = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.base, this.defaultOption.dir, this.defaultOption.fileFilter]);
    this.defaultOption.srcOtherFilter = [FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.base, this.defaultOption.dir, "**/*"]), "!" + this.defaultOption.fileFilter];
    this.defaultOption.srcFolder = FileHelper.concatDirectory([this.defaultOption.projectDir, this.defaultOption.base]);
    this.defaultOption.mapSrcFolder = FileHelper.concatDirectory([this.defaultOption.projectDir,this.defaultOption.outdir,this.defaultOption.outdirMap]);
    this.defaultOption.outSrcFolder = FileHelper.concatDirectory([this.defaultOption.projectDir,this.defaultOption.outdir]);


  }
  
  task(gulp) {
    return (done) => {
      Logger.info("Lancement de la tache " + this.name + ".");
      Logger.debug("option", this.defaultOption);

      // copie des autres fichiers (html, json...)
      let streamOther = gulp.src(this.defaultOption.srcOtherFilter , { base: this.defaultOption.srcFolder })
      .pipe(gulp.dest(this.defaultOption.outSrcFolder));
      streamOther.on( 'finish', () => {

        let stream = gulp.src(this.defaultOption.srcFilter, { base: this.defaultOption.srcFolder });
        if (this.defaultOption.compile.activeMap) {
          // Activation de la génération des sources maps
          stream = stream.pipe(sourcemaps.init());
        }
        // Activation de la génération typeScript
        stream = stream.pipe(babel(this.defaultOption.compile));
        stream.on("error", function (err) {
          Logger.error("Erreur '", err.name, "' dans le fichier '", err.fileName, "' ligne <", (err.loc && err.loc.line) || "unknow"  , "> colonne <", (err.loc && err.loc.column) || "unknow" , ">.");
          Logger.debug("Erreur : ", err);
          process.exit(1);
        });
        if (this.defaultOption.compile.activeMap) {
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


var mapOption = function(options, mapOptionsObject) {
  if (_.isArray(options)) {
    let presetsTmp = [];
    options.forEach((plugin) => {
      if (mapOptionsObject[plugin]) {
        presetsTmp.push(mapOptionsObject[plugin]);
      }
    });
    return presetsTmp;
  }
}
