"use strict";
const _ = require("lodash");
const logger = require("../../logger");
const gulpHelper = require("../../helpers/gulp-helper");
const FileHelper = require("../../helpers/file-helper");

const presetsObject = {
  es2015: require("babel-preset-es2015"),
  "stage-0": require("babel-preset-stage-0")
};

const pluginsObject = {
  "transform-decorators": require("babel-plugin-transform-decorators")
}
  
module.exports = class Task {


  constructor(option) {
    this.name = "js";
    Task.cleanPrefixe = "clean:";
    Task.compilePrefixe = "compile:";
    Task.validatePrefixe = "validate:";
    Task.testPrefixe = "test:";
    Task.watchPrefixe = "watch:";
    
    this.taskDepends = [];
    
    this.defaultOption = { 
      projectDir : "./",
      base : "src",
      baseTst : "tst",
      dir : "js",
      fileFilter : "**/*.js",
      outdir : "dist",
      tmpDir : "tmp",
      outdirMap: "maps",
      compile : {
          presets: [presetsObject["es2015"]],
      }
    };
    
    if (option && option.compile) {
      _.assign(this.defaultOption.compile, option.compile, (defaultValue, newValue, key, object, source) => {
        if (key && (key === "presets"|| key === "plugins")) {
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

    if (gulpHelper.parameters.files) {
      this.defaultOption.fileFilter = gulpHelper.parameters.files;
    }
    
    if (gulpHelper.parameters.dir) {
      this.defaultOption.projectDir = gulpHelper.parameters.dir;
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
