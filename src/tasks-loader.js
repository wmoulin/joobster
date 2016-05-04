"use strict";
const logger = require("./logger");
const path = require("path");
const gulpHelper = require("./helpers/gulp-helper");

module.exports = function (gulp, builderDesc, projectDesc, done) {

  logger.info("Chargement des tâches.");

  loadAllTasks(gulp, builderDesc, projectDesc, "./tasks/javascript", "javascript");
  loadAllTasks(gulp, builderDesc, projectDesc, "./tasks/typescript", "typescript");

  done();

};

function loadAllTasks(gulp, builderDesc, projectDesc, tasksDirPath, keyConfig) {
  let relativeTasksDirPath = path.join(__dirname, tasksDirPath);
  require("fs").readdirSync(relativeTasksDirPath).forEach(function(file) {
    if(path.extname(file) === ".js") {
       //do something
      let Task = require(path.join(relativeTasksDirPath, file));
      let task = new Task(builderDesc && builderDesc[keyConfig] ? builderDesc[keyConfig] : undefined, projectDesc);
      gulpHelper.loadTask(gulp, task);
    }
  });
}
