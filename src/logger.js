"use strict";
var gutil = require("gulp-util");
var chalk = require("chalk");
var _ = require("lodash");
var os = require("os");


const LEVELS = {
  trace   : { id: "trace", label : "<trace>", value : 10, style: chalk.white},
  debug   : { id: "debug", label : "<debug>", value : 20, style: chalk.green},
  info    : { id: "info", label : "<info>", value : 30, style: chalk.cyan},
  warning : { id: "warning", label : "<warning>", value : 40, style: chalk.yellow},
  error   : { id: "error", label : "<error>", value : 50, style: chalk.bold.red}
};
  
class Logger {

  /**
  * Définie le niveau de log global
  */
  static setLogLevel(level) {
    if (level && level.label && level.value && level.style) {
      Logger.level = level;
    } else {
      Logger.level = LEVELS.error;
    }
  }
  
  /**
  * retourn le LEVELS suivant un id
  */
  static getLogLevelFromString(levelString) {
    let loggerLevel;
  
    if (levelString) {
      loggerLevel = _.filter(LEVELS, { 'id': levelString })[0];
    } 
    
    return loggerLevel;
  }

  /**
  * Log un message en trace
  */
  static trace() {
    if (Logger.level.value <= LEVELS.trace.value) {
      gutil.log(LEVELS.trace.style(LEVELS.trace.label), LEVELS.trace.style(parseLogArgs.apply(null, arguments)));
    }
  }

  /**
  * Log un message en debug
  */
  static debug() {
    if (Logger.level.value <= LEVELS.debug.value) {
      gutil.log(LEVELS.debug.style(LEVELS.debug.label), LEVELS.debug.style(parseLogArgs.apply(null, arguments)));
    }
  }

  /**
  * Log un message en info
  */
  static info() {
    if (Logger.level.value <= LEVELS.info.value) {
      gutil.log(LEVELS.info.style(LEVELS.info.label), LEVELS.info.style(parseLogArgs.apply(null, arguments)));
    }
  }

  /**
  * Log un message en avertissement
  */
  static warning() {
    if (Logger.level.value <= LEVELS.warning.value) {
      gutil.log(LEVELS.warning.style(LEVELS.warning.label), LEVELS.warning.style(parseLogArgs.apply(null, arguments)));
    }
  }

  /**
  * Log un message en erreur
  */
  static error() {
    if (Logger.level.value <= LEVELS.error.value) {
      gutil.log(LEVELS.error.style(LEVELS.error.label), LEVELS.error.style(parseLogArgs.apply(null, arguments)));
    }
  }

}

/**
* Met à plat les arguments du logging
*/
var parseLogArgs = function() {
  var messagesTmp = [];
  var tmpArgs = Array.from(arguments);
  var msg = "";
  
  if (tmpArgs && _.isArray(tmpArgs)) {
    tmpArgs.forEach(message => {
      messagesTmp = messagesTmp.concat(stringifyObject(message));
    });
  } else if (tmpArgs){
    messagesTmp = messagesTmp.concat(stringifyObject(tmpArgs));
  }
  
  messagesTmp.forEach((massagePart) => {msg = msg + massagePart});
  
  return msg;

};

/**
* Stringifie un objet si besoin
*/
var stringifyObject = function(object) {

  if (_.isObject(object)) {
    return [os.EOL, JSON.stringify(object, null, 2)];
  } else if (_.isArray(object)) {
    return object;
  } else {
    return [object];
  }
};

Logger.level = LEVELS.error;

module.exports = Logger;
module.exports.LEVELS = LEVELS;