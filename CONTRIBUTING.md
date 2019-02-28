# Notes sur la structure du répertoire:

- `__tests__`: tests unitaires
- `components`: composantss React qui peuvent s'intégrer dans les pages
- `pages`: templates de pages
- `server`: code exécuté par le serveur lors du démarrage de l'application (ou l'export).
  - Ex: Chargement des tables YAML, récupération des paramètres depuis l'API OpenFisca, définition des routes, écritures des CSV et XSLX, etc.
- `services`: modules réutilisables aussi bien côté client que serveur
  - Ex: Construction des tables à partir des param OpenFisca, génération des CSV et XSLX, etc.
- `tables`: Tables YAML définissant la structure des barèmes sur le site
- `messages.js`: Définition des messages en Anglais et Français
