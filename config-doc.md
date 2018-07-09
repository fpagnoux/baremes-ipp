# Configuration des tables

À l'exception de la page d'accueil, qui est définie dans le fichier [`pages/index.js`](./pages/index.js), toutes les pages sont générées à partir des fichiers de configuration au format YAML situés dans le dossier [`tables`](./tables/).

Chaque fichier représente une section des paramètres (qui correspond à un fichier Excel dans la version actuelle des paramètres).

## Structure d'un fichier de configuration YAML

Considérons le fichier de configuration suivant:

```YAML
title: Prestations sociales
children:
  rsa:
    title: Revenu de solidarité active
    children:
      rsa_montant:
        table: prestations.minima_sociaux.rsa.montant_de_base_du_rsa
      rsa_forfait_logement:
        table: prestations.minima_sociaux.rsa.forfait_logement
      rsa_majoration:
        title: "Revenu de solidarité active (RSA) : majorations (montant de base et revenus) et montant minimum versé"
        table:
          ...
```

Ce fichier génére la section suivante:

![image](https://user-images.githubusercontent.com/11834997/42471691-a9fe89ec-838c-11e8-922c-b6695d226bbd.png)

Notes:
- Le `title` de premier niveau définit le titre de la section.
- L'attribut `children` permet de définir des sous-sections, de manière arborescente.
- Le mot clé `table` permet de référencer une table de paramètre. Voir [Configuration d'une table](#configuration-dune-table).
- Il est possible de générer automatiquement le contenu d'une sous-section. Voir [Génération d'une sous-section](#generation-dune-sous-section)

## Configuration d'une table

### À partir d'un paramètre OpenFisca

La manière la plus simple de définir une table est de référencer un paramètre OpenFisca:

```yaml
rsa_montant:
    table: prestations.minima_sociaux.rsa.montant_de_base_du_rsa
```

génère un lien dans le sommaire:

![image](https://user-images.githubusercontent.com/11834997/42472337-ebc0b4f2-838e-11e8-8296-e9f49f9147a9.png)

ainsi qu'une page `./rsa/rsa_montant/`:

![image](https://user-images.githubusercontent.com/11834997/42472364-08ffb126-838f-11e8-89ce-b244561f3bd3.png)

Note:
- Le titre dans le sommaire sera par défault la description OpenFisca du paramètre, sauf si un `title` est spécifié.
- Le paramètre passé à `table:` peut être un noeud. Dans ce cas, une table complexe sera générée:

![image](https://user-images.githubusercontent.com/11834997/42472504-7bfea15a-838f-11e8-93eb-8519b990f662.png)

### Table sur-mesure

Il est possible de définir de manière fine le contenu d'une table. 

Par exemple:

```yaml
rsa_majoration:
  title: "Revenu de solidarité active (RSA) : majorations (montant de base et revenus) et montant minimum versé"
  table:
    "Majoration montant maximal (en % de la base RSA)":
      "Couples ou célibataire avec un enfant": prestations.minima_sociaux.rsa.majoration_rsa.taux_deuxieme_personne
      "Couple, 1 enfant - ou pour le deuxième enfant": prestations.minima_sociaux.rsa.majoration_rsa.taux_troisieme_personne
      "Par enfant supplémentaire": prestations.minima_sociaux.rsa.majoration_rsa.taux_personne_supp
    "Majoration isolement (en % de la base RSA) ":
      "Femmes enceintes": prestations.minima_sociaux.rsa.majoration_parent_isole.femmes_enceintes
      "Par enfant à charge": prestations.minima_sociaux.rsa.majoration_parent_isole.par_enfant_a_charge
```

génère la table suivante:

![image](https://user-images.githubusercontent.com/11834997/42472709-4b6a3b70-8390-11e8-80a4-928e45b31c65.png)

Note:
  - Dans ce cas, un `title` est nécessaire, car il ne peut pas être inféré d'OpenFisca.

## Génération d'une sous-section
