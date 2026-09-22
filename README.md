# Triboo

Application de gestion des tâches, mémos, rendez-vous et listes de courses pour toute la famille — avec rappels automatisés et notifications push, installable comme une PWA sur mobile.

## Le problème que ça résout

Entre les échéances administratives récurrentes (déclaration nounou, assurances...), les rendez-vous, les courses et les petites choses à ne pas oublier, il est facile de perdre le fil en famille. Triboo centralise tout ça en un seul endroit, avec des rappels qui arrivent au bon moment — même quand l'app n'est pas ouverte.

## Fonctionnalités

- **Tâches, mémos et rendez-vous** — trois types de contenu dans une même entité, avec priorité (urgent / important / faible) et catégorie
- **Récurrence configurable** — quotidienne, hebdomadaire, mensuelle, annuelle, avec génération automatique des occurrences
- **Rappels automatiques** — notification le jour même, avec option de rappel 24h avant
- **Tâches partagées ou personnelles** — chaque tâche peut être visible par tout le foyer ou réservée à son créateur
- **Listes de courses** — plusieurs listes possibles, items cochables, ajout/suppression libre
- **Calendrier** — vue mensuelle avec navigation, détail par jour
- **Notifications push réelles** — via PWA + Service Worker, fonctionnent même app fermée
- **Compte foyer unique** — un mot de passe partagé, profils individuels pour trier et notifier, sans authentification lourde

## Stack technique

**Backend**
- Node.js + Express
- MySQL (mysql2)
- express-validator — validation des entrées
- node-cron — génération des occurrences récurrentes et envoi des rappels
- web-push — notifications push (VAPID)
- helmet, express-rate-limit — durcissement sécurité
- PM2 + Nginx en production (VPS OVH), HTTPS via Certbot

**Frontend**
- Vite + React (SPA)
- react-router-dom
- date-fns — gestion des dates et calculs de récurrence
- vite-plugin-pwa — manifest et build PWA (Service Worker d'envoi de notifications géré manuellement)
- lucide-react — icônes
- CSS classique (pas de framework utilitaire)

**Dev**
- Docker (MySQL + phpMyAdmin)

## Structure du projet

```
Triboo/
├── docker-compose.yml
├── server/          # API Express, jobs planifiés
└── client/          # Frontend Vite + React (PWA)
```

## Lancer le projet en local

1. Base de données : `docker compose up -d`
2. Backend : `cd server && npm install && npm run dev`
3. Frontend : `cd client && npm install && npm run dev`

L'app est accessible sur `http://localhost:5173`, phpMyAdmin sur `http://localhost:8080`.

## Statut

Déployé en production, usage familial actif.
