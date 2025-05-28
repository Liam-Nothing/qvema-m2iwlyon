# Checklist des Tests API

## Module d'Authentification (`/auth`)

### 1. Inscription (`POST /auth/register`)

#### Test avec données valides
```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "test@example.com",
  "password": "Password123!",
  "firstname": "John",
  "lastname": "Doe",
  "role": "entrepreneur"
}'
```
- [x] Test avec données valides (✅ Fonctionne)

#### Test avec email déjà utilisé
```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "test@example.com",
  "password": "Password123!",
  "firstname": "John",
  "lastname": "Doe",
  "role": "entrepreneur"
}'
```
- [x] Test avec email déjà utilisé (✅ Retourne erreur 400 comme attendu)

#### Test avec mot de passe trop court
```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "test2@example.com",
  "password": "123",
  "firstname": "John",
  "lastname": "Doe",
  "role": "entrepreneur"
}'
```
- [x] Test avec mot de passe trop court (< 8 caractères) (✅ Retourne erreur 400 comme attendu)

#### Test avec email invalide
```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "invalid-email",
  "password": "Password123!",
  "firstname": "John",
  "lastname": "Doe",
  "role": "entrepreneur"
}'
```
- [x] Test avec email invalide (✅ Retourne erreur 400 comme attendu)

#### Test avec données manquantes
```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "test3@example.com",
  "password": "Password123!"
}'
```
- [x] Test avec données manquantes (✅ Retourne erreur 400 comme attendu)

### 2. Connexion (`POST /auth/login`)
- [ ] Test avec identifiants valides
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- [ ] Test avec identifiants invalides
- [ ] Test avec email inexistant
- [ ] Test avec mot de passe incorrect

## Module Utilisateurs (`/users`)

### 1. Profil Utilisateur (`GET /users/profile`)
- [ ] Test avec token valide
- [ ] Test sans token
- [ ] Test avec token invalide
- [ ] Test avec token expiré

### 2. Mise à jour du Profil (`PATCH /users/profile`)
- [ ] Test mise à jour réussie
  ```json
  {
    "firstname": "John",
    "lastname": "Doe",
    "email": "newemail@example.com"
  }
  ```
- [ ] Test avec données invalides
- [ ] Test sans authentification
- [ ] Test avec email déjà utilisé

### 3. Administration des Utilisateurs (`GET /users`)
- [ ] Test avec rôle admin
- [ ] Test avec rôle non-admin
- [ ] Test sans authentification

## Module Projets (`/projects`)

### 1. Création de Projet (`POST /projects`)
- [ ] Test création par entrepreneur
  ```json
  {
    "title": "Nouveau projet",
    "description": "Description du projet",
    "budget": 10000,
    "category": "Technology"
  }
  ```
- [ ] Test par non-entrepreneur
- [ ] Test avec données invalides
- [ ] Test avec budget négatif
- [ ] Test avec champs manquants

### 2. Liste des Projets (`GET /projects`)
- [ ] Test récupération liste complète
- [ ] Test filtrage par catégorie
- [ ] Test pagination
- [ ] Test sans authentification

### 3. Détails d'un Projet (`GET /projects/:id`)
- [ ] Test projet existant
- [ ] Test ID inexistant
- [ ] Test sans authentification
- [ ] Test format ID invalide

### 4. Suppression de Projet (`DELETE /projects/:id`)
- [ ] Test suppression par créateur
- [ ] Test suppression par admin
- [ ] Test par non-autorisé
- [ ] Test projet inexistant

## Module Investissements (`/investments`)

### 1. Création d'Investissement (`POST /investments`)
- [ ] Test investissement réussi
  ```json
  {
    "projectId": "uuid",
    "amount": 5000
  }
  ```
- [ ] Test par non-investisseur
- [ ] Test montant invalide
- [ ] Test projet inexistant
- [ ] Test montant négatif

### 2. Liste des Investissements (`GET /investments`)
- [ ] Test liste investisseur
- [ ] Test par non-investisseur
- [ ] Test sans authentification

### 3. Investissements d'un Projet (`GET /investments/project/:id`)
- [ ] Test liste investissements projet
- [ ] Test projet inexistant
- [ ] Test sans authentification
- [ ] Test format ID invalide

### 4. Annulation d'Investissement (`DELETE /investments/:id`)
- [ ] Test annulation réussie
- [ ] Test annulation investissement autre utilisateur
- [ ] Test sans authentification
- [ ] Test investissement inexistant

## Tests Généraux

### Authentification
- [ ] Test token JWT valide
- [ ] Test token expiré
- [ ] Test token invalide
- [ ] Test refresh token

### Validation des Données
- [ ] Test limites des champs
- [ ] Test formats (email, montants)
- [ ] Test données manquantes
- [ ] Test caractères spéciaux

### Sécurité
- [ ] Test permissions par rôle
- [ ] Test accès ressources non autorisées
- [ ] Test protection injections
- [ ] Test CORS

### Performance
- [ ] Test temps de réponse
- [ ] Test requêtes simultanées
- [ ] Test pagination
- [ ] Test charge serveur 