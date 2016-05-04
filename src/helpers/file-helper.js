"use strict";
const logger = require("../logger");
const path = require("path");
const fs = require('fs');
const _ = require("lodash");

module.exports = class FileHelper {

  /**
  * Test si un fichier existe
  * @param {String} dir repertoire dans lequel doit se trouver le fichier
  * @param {String} fileName nom du fichier
  * @param {Boolean} mandatory le fichier est obligatoire (stop le processus)
  */
  static checkFileExist(dir, fileName, mandatory) {
    logger.trace("dir : ", dir, " fileName : ", fileName);
    var completFilePath = path.join(dir, fileName);
    if (!fs.existsSync(completFilePath)) {
      if (!mandatory) return undefined;
      logger.error("Le projet doit avoir un fichier " + fileName + " (dir=" + dir + ")");
      process.exit(1);
    }
    return completFilePath;

  }

  /**
  * Concatene deux repertoire en ajoutant le séparateur
  * @param {Array<String>} dirs les répertoires
  * @return {String} tous les répertoires concaténé avec le séparateur
  */
  static concatDirectory(dirs) {
    logger.trace("dirs : ", dirs);
    if (!_.isArray(dirs)) {
      logger.error("Le paramàtre doit être un tableau de string (dirs=" + dirs + ")");
      process.exit(1);
    }

    let pathDir = "";
    dirs.forEach(dir => {pathDir = path.join(pathDir, dir)});
    return pathDir;
  }

  /**
  * Charge un fichier JSON
  * @param {String} chemin du fichier
  * @return {Object} l'objet Json dans le fichier
  */
  static loadJsonFile(jsonFile) {
    logger.trace("load jsonFile : ", jsonFile);
    if (fs.existsSync(jsonFile)) {
      return require(jsonFile);
    }
  }

  /**
  * extraction du nom de fichier
  * @param {String} chemin du fichier
  * @return {String} nom du fichier
  */
  static extractFileName(filePath) {
    logger.trace("extract file name : ", filePath );
    return path.basename(filePath);
  }
};
