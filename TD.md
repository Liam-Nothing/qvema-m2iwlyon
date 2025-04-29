# **API de mise en relation Entreprises & Investisseurs**

---

## 🎯 **1. Contexte**

Dans le cadre du développement d'une **plateforme de mise en relation entre entrepreneurs et investisseurs**, vous devez concevoir une **API REST sécurisée** en **NestJS** avec **MySQL et TypeORM**.

Cette plateforme permettra aux **entrepreneurs** de publier des **projets** et aux **investisseurs** de découvrir et soutenir ces projets en fonction de leurs intérêts.

📌 **Objectifs de l'API :**

✅ Permettre l'authentification et la gestion des utilisateurs (**JWT**)

✅ Différencier les rôles (`entrepreneur`, `investor`, `admin`)

✅ Permettre la gestion des projets et des investissements

✅ Sécuriser les routes en fonction des rôles avec **Guards & Decorators**

---

## ⚙ **2. Fonctionnalités attendues**

L’API devra inclure plusieurs **modules** et fonctionnalités spécifiques à chaque rôle.

### 🧑‍💼 **Utilisateur (Authentification & Gestion)**

id = uuid

📂 **Endpoints liés aux utilisateurs :**

| 🔍 Fonctionnalité | 🎯 Route | 🛡️ Accès |
| --- | --- | --- |
| **Inscription d'un utilisateur** | `POST /auth/register` | Public |
| **Connexion et récupération du token JWT** | `POST /auth/login` | Public |
| **Consultation de son profil** | `GET /users/profile` | Authentifié |
| **Mise à jour des informations personnelles et préférences (interests)** | `PUT /users/profile` | Authentifié |
| **Consultation de la liste des utilisateurs** | `GET /users` | Admin |
| **Suppression d’un utilisateur** | `DELETE /users/:id` | Admin |

📌 **Détails :**

- L’utilisateur peut être **entrepreneur, investisseur ou admin**.
- Le mot de passe doit être **hashé avec bcrypt**.
- Un `Guard` JWT doit sécuriser toutes les routes sauf l'inscription et la connexion.

---

### 🚀 **Projets (Création & Consultation)**

📂 **Endpoints liés aux projets :**

| 🔍 Fonctionnalité | 🎯 Route | 🛡️ Accès |
| --- | --- | --- |
| **Création d’un projet** | `POST /projects` | Entrepreneur |
| **Consultation de tous les projets** | `GET /projects` | Authentifié |
| **Consultation d’un projet par ID** | `GET /projects/:id` | Authentifié |
| **Mise à jour d’un projet** | `PUT /projects/:id` | Créateur (Entrepreneur) |
| **Suppression d’un projet** | `DELETE /projects/:id` | Créateur (Entrepreneur) ou Admin |

📌 **Détails :**

- Un projet contient : `title`, `description`, `budget`, `category`, `ownerId`.
- Seuls **les entrepreneurs** peuvent créer et modifier leurs propres projets.
- **Les admins** peuvent supprimer tout projet.

---

### 🏷 **Gestion des centres d’intérêt**

Chaque utilisateur peut choisir **plusieurs centres d’intérêt**, qui permettront de lui recommander des projets pertinents.

📂 **Endpoints liés aux intérêts :**

| 🔍 Fonctionnalité | 🎯 Route | 🛡️ Accès |
| --- | --- | --- |
| **Lister tous les intérêts disponibles** | `GET /interests` | Public |
| **Associer des intérêts à un utilisateur** | `POST /users/interests` | Authentifié |
| **Voir les intérêts d’un utilisateur** | `GET /users/interests` | Authentifié |
| **Recommander des projets en fonction des intérêts** | `GET /projects/recommended` | Authentifié |

📌 **Détails :**

- Un intérêt peut être **"Technologie", "Écologie", "Finance", etc.**
- Un utilisateur peut en sélectionner **plusieurs**.
- Les projets seront **recommandés en fonction des centres d’intérêt** de l’investisseur.

🚀 **L’objectif est d’optimiser la mise en relation en fonction des préférences des utilisateurs !** 🔥

---

### 💰 **Investissements (Gestion des fonds)**

📂 **Endpoints liés aux investissements :**

| 🔍 Fonctionnalité | 🎯 Route | 🛡️ Accès |
| --- | --- | --- |
| **Investir dans un projet** | `POST /investments` | Investisseur |
| **Voir ses investissements** | `GET /investments` | Investisseur |
| **Voir les investissements d’un projet** | `GET /investments/project/:id` | Authentifié |
| **Annuler un investissement** | `DELETE /investments/:id` | Investisseur |

📌 **Détails :**

- Un investissement contient : `investorId`, `projectId`, `amount`, `date`.
- Seuls **les investisseurs** peuvent investir.
- Un **entrepreneur peut voir les investissements** sur ses propres projets.

---

### 🛠 **Administration**

📂 **Endpoints liés aux admins :**

| 🔍 Fonctionnalité | 🎯 Route | 🛡️ Accès |
| --- | --- | --- |
| **Voir tous les utilisateurs** | `GET /admin/users` | Admin |
| **Supprimer un utilisateur** | `DELETE /admin/users/:id` | Admin |
| **Voir toutes les transactions** | `GET /admin/investments` | Admin |

📌 **Détails :**

- Un **admin** a un accès complet à tous les modules.
- Il peut **gérer les utilisateurs** et **superviser les investissements**.

---

## 🔐 **3. Sécurité & Rôles**

L'API doit être **sécurisée avec JWT** et respecter **les permissions selon les rôles** :

| 👤 Rôle | ✅ Permissions |
| --- | --- |
| **Entrepreneur** | Créer, modifier, supprimer **ses propres projets** |
| **Investisseur** | Voir les projets, investir et gérer ses investissements |
| **Admin** | Voir et gérer **tous les utilisateurs, projets et investissements** |

🚀 **Mise en place des protections :**

- **JWT** pour l’authentification
- **`RolesGuard`** pour vérifier les rôles
- **Décorateurs `@Roles()` et `@UseGuards(AuthGuard('jwt'), RolesGuard)`** pour sécuriser les routes

---

## 📚 **4. Liens utiles**

🔹 **Documentation NestJS** → https://docs.nestjs.com/

🔹 **Documentation TypeORM** → https://typeorm.io/

🔹 **JWT (Json Web Token)** → https://jwt.io/

🔹 **Tutoriel sur les Guards et les Rôles en NestJS** → https://docs.nestjs.com/security/authorization

🔹 **MySQL avec TypeORM** → https://typeorm.io/#/

---

## 🏆 **5. Déroulement de l'exercice**

Méthodologie recommandée :

1. Créer le projet avec Fastify à la place de Express (par défaut)
2. Configurer TypeORM (n’oublie pas que ton serveur de bdd ex:wampserver doit être lancé !)
3. Créer un module `User` et tester la route en GET afin de s’assurer que cela renvoie la chaine de caractères  `This action returns all users` par défaut quand on utilise la CLI pour générer un module avec nest.
4. Modifier les différents fichiers afin de créer l’ajout d’un utilisateur : seul l’email et le mot de passe sont obligatoires. Si tout fonctionne bien, cela doit retourner le JSON correspondant à notre objet user :
    
    ```tsx
    {
    	"id": "90e1a731-ee48-4a66-b111-955f94eef833",
    	"email": "toto@mail.fr",
    	"password": "azerty",
    	"firstname": null,
    	"lastname": null,
    	"role": "entrepreneur",
    	"interests": [],
    	"createdAt": "2025-03-05T14:30:37.216Z"
    }
    ```
    
    On remarque qu’il retourne le mot de passe également, on fera donc en sorte, non seulement de le crypter avec `bcrypt` mais également de ne pas l’exposer dans le retour JSON.
    
    S’assurer également que l’email est unique en BDD (car par défaut, on peut ajouter plusieurs users avec le même).
    
    Les intérets sont une entité à part entière avec une relation many-to-many avec les utilisateurs.
    
5. Créer l’authentification avec `JWT` (créer un `AuthModule` dédié)
    - Ajouter la gestion de connexion avec JWT.
    - Générer un token lors de l’authentification.
    - Protéger les routes nécessitant un utilisateur connecté.
6. Protéger les routes avec des Guards (`AuthGuard` + `RolesGuard`)
    - Vérifier que seules les personnes authentifiées peuvent accéder aux routes privées.
    - Implémenter un système de rôles (`admin`, `entrepreneur`, `investor`).
7.  Créer et gérer les projets (`ProjectModule`)
    - Permettre aux entrepreneurs de créer, modifier et supprimer leurs projets.
    - Autoriser tous les utilisateurs à consulter les projets.
8. Créer la gestion des investissements (`InvestmentModule`)
    - Permettre aux investisseurs d’investir dans un projet.
    - Permettre aux entrepreneurs de voir les investissements reçus.
9. Mettre en place les routes d’administration (`AdminModule`)
    - Ajouter la gestion des utilisateurs (suppression, consultation).
    - Donner des permissions spécifiques aux admins.

### 🎯 **Objectif final**

✔ Une **API REST complète** et **sécurisée**

✔ Une **gestion des utilisateurs et rôles avancée**

✔ Des **projets et investissements fonctionnels**

---

Sujet par [Audrey HOSSEPIAN](https://audreyhossepian.fr) - https://www.instagram.com/haudrey.dev/