# [Barèmes IPP](http://baremes-ipp.pagnoux.eu/)

Application web permettant de générer des tables de paramètres à partir d'[OpenFisca-France](https://github.com/openfisca/openfisca-france).

# Configuration des tables

À l'exception de la page d'accueil, qui est définie dans le fichier [`pages/index.js`](./pages/index.js), toutes les pages sont générées à partir des fichiers de configuration au format YAML situés dans le dossier [`tables`](./tables/).

Chaque fichier représente une section des paramètres (qui correspond à un fichier Excel dans la version actuelle des paramètres).

# Génération de l'app

L'application est générée sous forme de site HTML statique à partir de la configuration YAML.

Cette phase de génération utilise `Node.js` et `Next.js`

Une fois l'app générée, elle peut être servie directement par un serveur HTTP simple (sans `Node.js`).

## Prérequis

- `node`
- `yarn` (ou `npm`)
- Web-API d'OpenFisca servie sur `localhost:2000`

## Build

```sh
yarn && yarn build && yarn export
```

génère un repertoire `out` qui contient le site statique à servir.

