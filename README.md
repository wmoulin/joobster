# README
Wilfried Moulin
v1.0, 2015-12-15

## Description

**joobster** est un booster de projet JavaScript (EcmaScript pour les puristes) et permet de masquer la complexité des différentes tâches nécessaires aux différentes phases de développement, en se rapprochant de la philosophie `maven`.

## Installation

### Depuis NPM, si je le publie un jour

```shell
$ npm install -g boo-js-ter
```

### Depuis les sources

Installer **joobster** de manière globale:
 - Se placer dans le dossier de *boo-js-ter**
 - Lancer la commande

```shell
$ npm install -g
```
 
### Commandes

Après l'installation, les commandes *joobster* et *jsr* (alias de la première) sont accessibles en globale dans la console nodeJs.

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


## Configurer un projet pour utiliser joobster

## Les tâches fournies par joobster
### Les tâches de gestion des dépendances

Il va fournir des tâches se rapprochant de la philosophie `maven` pour simplifier et pérenniser la gestion des dépendances en les fixant (sans ^, ~ ou *) afin de pérenniser les versions.

| Tâche         | Rôle                                                          | Dépendances |
| ------------- | ------------------------------------------------------------- | ----------- |

== Les tâches de test

== Les tâches de compilation

== Les tâches de qualimétrie

== Lancement de l'application sous node

== Construction des livrables
