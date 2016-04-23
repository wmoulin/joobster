# README
Wilfried Moulin
v1.0, 2015-12-15

## Description

**joobster** est un booster de projet JavaScript (EcmaScript pour les puristes) et permet de masquer la complexité des différentes tâches nécessaires aux différentes phases de développement, en se rapprochant de la philosophie `maven`.

## Installation

Il faut au préalable installer NodeJs.

### Depuis NPM, si je le publie un jour

```shell
$ npm install -g joobster
```

### Depuis les sources

Installer **joobster** de manière globale:
 - Se placer dans le dossier de *joobster*
 - Lancer la commande

```shell
$ npm install -g
```

Installer **joobster** de manière locale:
 - Se placer dans le dossier de *joobster*
 - Lancer la commande

```shell
$ npm install
```
### Commandes

Après l'installation, les commandes `joobster` et `jsr` (alias de la première) sont accessibles en globale dans la console nodeJs.

Une aide est fournie en tapant la commande, donne la description de toutes les taches possibles.

```shell
$ jsr --help
```

 Les options suivantes sont alors proposées:

| Option        | Rôle                                                          |
| ------------- | ------------------------------------------------------------- |
| -h, --help    | Affiche l'aide                                                |
| -V, --version | Affiche la version du builder                                 |
| -l, --log     | Initialise le niveau des logs (error)                         |
| -d, --dir     | Permet d'indiquer le répertoire du projet des tâches à lancer |
| -f, --files   | Permet de lancer les tâches sur un filter donné               |


Pour lancer **joobster** depuis une install locale, une fois placé dans le répertoire de **joobster**, voici un exemple de commande :
```shell
$ node ./src/bosster <tache> -l debug -d 'path/to/project/dir'
```

## Configurer un projet pour utiliser joobster

Soit on utilise la configuration par défaut et le projet doit avoir une arboresence pârticulière, soit on paramètre **joobster** en ajoutant le fichier *joobster.json* à la racine du projet afin de modifier les valeurs par défaut.

L'objet de configuration par défaut :

```json
	{ 
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
    }
```

```
project
| + src
| |	+ js
| + tst
| |	+ js
```

## Les tâches fournies par joobster

### Les tâches de gestion des dépendances

Il va fournir des tâches se rapprochant de la philosophie `maven` pour simplifier et pérenniser la gestion des dépendances en les fixant (sans ^, ~ ou *) afin de pérenniser les versions.

| Tâche         | Rôle                                                               | Dépendances |
| ------------- | ------------------------------------------------------------------ | ----------- |

### Les tâches de JavaScript (suffixe :js)

| Tâche         | Rôle                                                                           | Dépendances |
| ------------- | ------------------------------------------------------------------------------ | ----------- |
| clean:js      | Suppression des fichiers de transpilation (dist/js et dist/maps/js) avec Babel |             |
| compile:js    | Transpilation JavaScript -> dist/js et dist/maps/js                            | clean:js    |
| validate:js   | Lancement de l'analyse EsLint                                                  |             |
| test:js       | Lancement des tests unitaires (test/js) basé sur Mocha                         |             |
| watch:js      | Lancement d'un watcher sur les fichiers js pour transpilation                  |             |

### Les tâches de TypeScript (suffixe :ts)

| Tâche         | Rôle                                                               | Dépendances |
| ------------- | ------------------------------------------------------------------ | ----------- |
| clean:ts      | Suppression des fichiers de transpilation (dist/ts et dist/maps/ts |             |
| compile:ts    | Transpilation JavaScript -> dist/ts et dist/maps/ts                | clean:js    |
| validate:ts   | Lancement de l'analyse TsLint                                      |             |
| test:ts       | Lancement des tests unitaires (test/ts) basé sur Mocha             |             |
| watch:ts      | Lancement d'un watcher sur les fichiers js pour transpilation      |             |

### Lancement de l'application sous node

| Tâche         | Rôle                                                               | Dépendances |
| ------------- | ------------------------------------------------------------------ | ----------- |

### Construction des livrables

| Tâche         | Rôle                                                               | Dépendances |
| ------------- | ------------------------------------------------------------------ | ----------- |
