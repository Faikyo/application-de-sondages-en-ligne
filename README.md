# Application de Sondages en Ligne

Application web permettant de créer et gérer des sondages interactifs avec votes en temps réel.

## 🎯 Objectifs du projet

Ce projet a été réalisé dans le cadre d'un test technique avec les objectifs suivants :
- Développer une API REST en NestJS pour gérer des sondages
- Créer une interface React pour voter et visualiser les résultats
- Implémenter un système de vote avec protection contre les votes multiples

## 🚀 Technologies utilisées

### Backend
- **NestJS** - Framework Node.js
- **TypeORM** - ORM pour la gestion de base de données
- **PostgreSQL** - Base de données relationnelle
- **class-validator** - Validation des données

### Frontend
- **React** - Bibliothèque UI
- **TypeScript** - Typage statique
- **React Router** - Navigation
- **Vite** - Build tool

## 📋 Prérequis

- Node.js (v16 ou supérieur)
- PostgreSQL installé et en cours d'exécution
- npm ou yarn

## 🛠️ Installation

### 1. Cloner le projet
```bash
git clone https://github.com/Faikyo/application-de-sondages-en-ligne.git
cd application-de-sondages-en-ligne
```

### 2. Configuration de la base de données

Créer une base de données PostgreSQL :
```sql
CREATE DATABASE sondagedb;
```

Vérifier les paramètres de connexion dans `back-end/src/app.module.ts` :
```typescript
{
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'sondagedb',
}
```

### 3. Installation et démarrage du Backend

```bash
cd back-end
npm install
npm run start:dev
```

L'API sera accessible sur : http://localhost:3000/api

### 4. Installation et démarrage du Frontend

```bash
cd front-end
npm install
npm run dev
```

L'application sera accessible sur : http://localhost:5173

## 🎮 Utilisation

### Connexion
- **Admin** : Entrez `admin` comme identifiant pour accéder à l'interface d'administration
- **Utilisateur** : Entrez n'importe quel autre nom (ex: Jean, Marie) pour accéder à l'interface de vote

### Interface Administrateur
- Créer des sondages avec titre et description
- Ajouter des options de réponse (minimum 2)
- Définir si le sondage accepte une ou plusieurs réponses

### Interface Utilisateur
- Visualiser tous les sondages disponibles
- Voter pour un ou plusieurs choix selon le type de sondage
- Consulter les résultats en temps réel après avoir voté
- Protection contre les votes multiples par utilisateur

## 📁 Structure du projet

```
├── back-end/
│   └── src/
│       ├── sondages/          # Module des sondages
│       │   ├── poll.entity.ts     # Entité Sondage
│       │   ├── option.entity.ts   # Entité Option
│       │   ├── vote.entity.ts     # Entité Vote
│       │   ├── sondages.dto.ts    # DTOs pour validation
│       │   ├── sondages.service.ts    # Logique métier
│       │   └── sondages.controller.ts # Endpoints API
│       ├── app.module.ts      # Module principal
│       └── main.ts            # Point d'entrée
│
└── front-end/
    └── src/
        ├── pages/             # Pages de l'application
        │   ├── LoginPage.tsx      # Page de connexion
        │   ├── AdminPage.tsx      # Interface admin
        │   └── UserPage.tsx       # Interface utilisateur
        ├── services/
        │   └── api.ts         # Service d'appels API
        └── App.tsx            # Composant principal avec routes
```

## 🔗 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/sondages` | Créer un nouveau sondage |
| GET | `/api/sondages` | Lister tous les sondages |
| GET | `/api/sondages/:id/resultats` | Obtenir les résultats d'un sondage |
| POST | `/api/sondages/:id/vote` | Voter pour un sondage |
| GET | `/api/sondages/:id/has-voted/:voter` | Vérifier si un utilisateur a voté |

## 🔒 Sécurité et validations

- Validation des données entrantes avec class-validator
- Protection contre les votes multiples (contrainte unique en base)
- Vérification du respect des règles de vote (simple/multiple)
- Gestion des erreurs avec codes HTTP appropriés

## 🧪 Points d'amélioration possibles

1. **Tests** : Ajouter des tests d'intégration (Jest)
2. **Authentification** : Implémenter JWT pour une vraie sécurité
3. **Interface** : Améliorer le design avec une librairie UI
4. **Fonctionnalités** :
   - Modifier/supprimer des sondages
   - Dates de début/fin de sondage
   - Export des résultats
   - Graphiques pour les résultats

## 📝 Notes de développement

- L'authentification est volontairement simplifiée pour ce test
- Les tables sont créées automatiquement grâce à `synchronize: true`
- CORS configuré pour permettre les appels depuis le frontend

## 🤝 Auteur

Furkan Demirbas

---

*Projet réalisé dans le cadre d'un test technique pour une alternance en Master*