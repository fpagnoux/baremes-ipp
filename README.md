# [Barèmes IPP](http://baremes-ipp.pagnoux.eu/)

Application web permettant de générer des tables de paramètres à partir d'[OpenFisca-France](https://github.com/openfisca/openfisca-france).

# Configuration des tables

Voir [documentation spécifique](./config-doc.md).

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

# Configuration de l'app

Des variables de configuration peuvent être spécifiées dans un fichier `.env` situé à la racine du répertoire.
> Voir cet [exemple](https://github.com/fpagnoux/baremes-ipp-views/blob/master/.env-prod.wp), utilisé pour l'intrégration dans le site WordPress [ipp.eu](https://ipp.eu/)

Les valeurs par défault conviennent pour un site indépendant située à la racine du domaine.

- `BASENAME`: À spécifier si les barèmes sous servis dans un sous-répertoire du domaine (e.g. domaine.org/baremes)
- `WORDPRESS`: Si spécifié, génère un site optimisé pour l'intégration dans Wordpress
  - Les pages ne sont pas stylées, ne contiennent pas de header ni de JS, etc.
  - Les fichiers XLSX et CSV sont générés statiquement
- `TABLES_DIR`: Le dossier où sont configurés les fichiers de configuration des tables.

  Dans le cas où le mode `WORDPRESS` est activé, d'autres variables sont nécessaires:

- `CSV_PATH`: Sous-répertoire où sont exposées les tables générées statiquement.
- `BASENAME_EN_SECTIONS`: à spécifier si les pages de sections en anglais sont servies dans un sous-dossier différent des pages en français
- `BASENAME_EN_TABLES`: à spécifier si les pages de tables en anglais sont servies dans un sous-dossier différent des pages en français
  - Ce paramètre est légèrement différent du précédent dans la configuration actuellement en production, pour contourner une incompatibilité entre le module d'i18n (WPML) et la réécriture d'URL.

