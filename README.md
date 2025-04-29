<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# API de mise en relation Entreprises & Investisseurs

## Description
Cette API permet la mise en relation entre entrepreneurs et investisseurs, permettant aux entrepreneurs de publier des projets et aux investisseurs de découvrir et soutenir ces projets en fonction de leurs intérêts.

## Prérequis
- Node.js (v18 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

## Installation

1. Cloner le repository
```bash
git clone [URL_DU_REPO]
cd [NOM_DU_REPO]
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
Créez un fichier `.env` à la racine du projet avec les variables suivantes :
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=qvema

# Application Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1d
```

4. Créer la base de données
```sql
CREATE DATABASE qvema;
```

## Démarrage

```bash
# Développement
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Structure du Projet

```
src/
├── modules/
│   ├── users/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   └── interests/
│       ├── dto/
│       ├── entities/
│       ├── interests.controller.ts
│       ├── interests.service.ts
│       └── interests.module.ts
├── app.module.ts
└── main.ts
```

## Fonctionnalités

- Authentification et gestion des utilisateurs (JWT)
- Gestion des rôles (entrepreneur, investisseur, admin)
- Gestion des projets
- Gestion des investissements
- Gestion des centres d'intérêt

## API Endpoints

### Authentification
- POST /auth/register - Inscription d'un utilisateur
- POST /auth/login - Connexion et récupération du token JWT

### Utilisateurs
- GET /users/profile - Consultation de son profil
- PUT /users/profile - Mise à jour des informations personnelles
- GET /users - Consultation de la liste des utilisateurs (Admin)
- DELETE /users/:id - Suppression d'un utilisateur (Admin)

### Projets
- POST /projects - Création d'un projet
- GET /projects - Consultation de tous les projets
- GET /projects/:id - Consultation d'un projet par ID
- PUT /projects/:id - Mise à jour d'un projet
- DELETE /projects/:id - Suppression d'un projet

### Intérêts
- GET /interests - Lister tous les intérêts disponibles
- POST /users/interests - Associer des intérêts à un utilisateur
- GET /users/interests - Voir les intérêts d'un utilisateur

### Investissements
- POST /investments - Investir dans un projet
- GET /investments - Voir ses investissements
- GET /investments/project/:id - Voir les investissements d'un projet
- DELETE /investments/:id - Annuler un investissement

## Sécurité

- Authentification JWT
- Validation des données
- Protection des routes avec Guards
- Gestion des rôles

## Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture de tests
npm run test:cov
```

## Licence

Ce projet est sous licence MIT.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
