"use strict";
var logger = require("../logger");

class GulpHelper {

  /**
  * Test si les taches existent dans Gulp
  * @param {Gulp} gulp l'instance de Gulp
  * @param {Array<String>} tasks listes des taches à vérifier
  */
  static checkTasksExist(gulp, tasks) {
    logger.info("tasks : ", tasks);
    tasks.forEach(function(task) {
      if (!gulp.hasTask(task)) {
        logger.error("La tâche Gulp '" + task + "' n'existe pas !");
        logger.debug("Gulp : ", gulp);
        
        process.exit(1);
      }
    });
  }
  
  static loadTask(gulp, taskInst) {
    logger.debug("Chargement de la tache : " + taskInst.name);
    logger.info("Tache : ", taskInst);
    
    if (!taskInst.name) {
      logger.error("Cette tâche Gulp ne posséde aucun nom !");
      process.exit(1);
    }
    
    if (gulp.hasTask(taskInst.name)) {
      logger.warning("La tâche Gulp '" + taskInst.name + "' existe déjà !");
    }

    if (taskInst.task) {
      gulp.task(taskInst.name, taskInst.taskDepends || [], taskInst.task(gulp));
    }
    
  };

};

GulpHelper.parameters = {};
module.exports = GulpHelper;



