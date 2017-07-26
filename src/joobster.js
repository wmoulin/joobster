#!/usr/bin/env node
"use strict";

const logger = require("./logger");
const commander = require("commander"); // Gestionnaire de ligne de commandes
const npm = require("npm");
const gulp = require("gulp");
const gulpHelper = require("./helpers/gulp-helper");
const fileHelper = require("./helpers/file-helper");
const tasksLoader = require("./tasks-loader");

commander
    .version(require("../package.json").version)
    .usage("[options] <tasks ...>")
    .option("-l --log <level>", "log level, /^(trace|debug|info|warning|error)$/i", "error")
    .option("-d --dir <directory>", "project directory", process.cwd())
    .option("-f --files <glob files>", "filtre des fichiers pour la tâche à lancer (syntaxe node-glob)", "")
    .parse(process.argv);

logger.setLogLevel(logger.getLogLevelFromString(commander.log))
logger.debug("Démarrage de js-project-builder dans ", commander.dir);

// Ajout des listenners Gulp
gulp.on("task_err", function (e) {
  logger.error("Erreur lors de l'exécution de la tache '" + e.task + "'.");
  logger.debug("Event : ", e);
});

gulp.on("task_not_found", function (e) {
  logger.error("Impossible de trouver la tache '" + e.task + "'.");
  process.exit(1);
});

gulp.on("error", function (e) {
  logger.error("Erreur lors de la tache '" + e.task + "'.");
  logger.debug("Event : ", e);
});

let projectDesc = fileHelper.loadJsonFile(fileHelper.checkFileExist(commander.dir, "package.json", true));
let builderDesc = fileHelper.loadJsonFile(fileHelper.checkFileExist(commander.dir, "joobster.json", false));

logger.trace("Description du projet : ", projectDesc);
logger.trace("Description du builder : ", builderDesc);
gulpHelper.parameters.files = commander.files;
gulpHelper.parameters.dir = commander.dir;
gulpHelper.parameters.task = commander.args;

// chargement des taches, on exécute une fois que tout est chargé
tasksLoader(gulp, builderDesc, projectDesc, function() {

  // vérification de l'existence des tâches à exécuter
  var tasks = (commander.args.length ? commander.args : ["default"]);
  gulpHelper.checkTasksExist(gulp, tasks);

  require("run-sequence").apply(gulp, tasks.concat(
      function (err) {
          if (err) {
            logger.error("Problème d'exécution des taches Gulp : ", err.message);
            logger.debug("Erreur : ", err);
            process.exit(1);
          }
      }
  ));

});
