# Application-de-sondages-en-ligne

1. Backend : Création d'une API REST, gestion des bases de données, validation des
données
2. Frontend : Gestion des appels API, affichage dynamique des sondages et votes.

Critère: Détails
Backend: Bonne structuration du code, utilisation correcte des entités, validation
des données
Frontend: Bonne gestion des appels API, UX fluide
Gestion des votes: Empêcher un utilisateur de voter plusieurs fois si le sondage ne l’autorise pas
Bonus: Mise en place de test d’intégration

Fonctionnalités demandées :

Backend (NestJS)
Le backend doit exposer une API express suivant le modèle REST permettant de :
▪ Créer un sondage avec un titre, une description et plusieurs choix de réponse
o Vous devez gérer qu’un sondage peut nécessiter qu’une seule réponse.
▪ Lister tous les sondages disponibles.
▪ Récupérer un sondage avec ses résultats.
▪ Répondre aux sondages.
Vous êtes libre sur le modèle de données, mais nous vous conseillons d’utiliser TypeORM et
class validator.

Frontend (React)
Le frontend doit être divisé en deux parties :
1. Une partie administrateur pour créer les sondages.
2. Une partie utilisateur pour répondre aux sondages et voir le résultat.
Nous vous conseillons d’utiliser MaterialUI et lucide.dev pour les icones.
