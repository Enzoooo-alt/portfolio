# Audit des mini-projets (portfolio)

Date: 2026-03-16

## Vue d’ensemble

Le portfolio est déjà riche et visuellement fort. La majorité des projets sont **front-only** (React + state local), avec un bon niveau d’interaction. Le principal axe de progression est la **mise en production “pro”**: données dynamiques, sauvegarde côté serveur, analytics d’usage, et optimisation perf/SEO.

## Analyse par projet

### 1) About (`/about`)
- **État actuel**: FAQ locale statique, UX simple et claire.
- **Points forts**: lisible, rapide, facile à maintenir.
- **Améliorations**:
  - ajouter un schéma `FAQPage` (SEO).
  - connecter les réponses à un JSON/CMS léger pour édition rapide.
  - ajouter un bouton CTA direct vers contact/alternance.

### 2) Cuillère (`/cuillere`)
- **État actuel**: chatbot en mode démo local.
- **Points forts**: base UX propre, structure prête pour IA réelle.
- **Améliorations API**:
  - backend Node/Express avec endpoint `/api/chat`.
  - intégration OpenAI (ou Mistral/Anthropic) côté serveur, jamais côté client.
  - rate-limit + logs + modération de prompt.
  - persistance des conversations (SQLite/PostgreSQL).

### 3) Pokémon Types (`/pokemon-types`)
- **État actuel**: dataset local statique riche.
- **Points forts**: contenu utile, animations déjà impactantes.
- **Améliorations API**:
  - source temps réel via `PokeAPI` (fiches, sprites, évolutions).
  - cache local (stale-while-revalidate).
  - mode comparaison de 2 types avec matrice auto-générée.

### 4) Memory Game (`/memory-game`)
- **État actuel**: très bon gameplay + localStorage high scores.
- **Points forts**: progression, scoring, sensations arcade.
- **Améliorations API**:
  - leaderboard online (top scores par niveau).
  - authentification légère (pseudo + session).
  - anti-cheat basique (temps/moves plausibles).

### 5) App de gestion (`/app-de-gestion/*`)
- **État actuel**: front UI admin avec données mockées.
- **Points forts**: bonne base produit scolaire/ERP.
- **Améliorations API**:
  - backend CRUD (Laravel/Express) pour `students`, `teachers`, `courses`, `grades`, `attendance`.
  - validation serveur + pagination + filtres.
  - RBAC (`admin`, `teacher`, `student`) + JWT.

### 6) ReactCourse (`/react-course`)
- **État actuel**: excellent format pédagogique local.
- **Points forts**: interactif, progression claire.
- **Améliorations API**:
  - sauvegarde progression utilisateur.
  - moteur de correction plus robuste (sandbox exécution code).
  - stats pédagogiques: taux de réussite par leçon.

### 7) DemonSlayer (`/demon-slayer`)
- **État actuel**: encyclopédie immersive front-only.
- **Points forts**: très fort impact visuel.
- **Améliorations**:
  - externaliser dataset en JSON versionné.
  - lazy-loading images + fallback CDN robuste.
  - mode “collection” (favoris) avec localStorage/cloud.

### 8) Inazuma Draft (`/inazuma-draft`)
- **État actuel**: logique locale 1v1 sur un seul écran.
- **Points forts**: concept solide, gameplay lisible.
- **Améliorations API**:
  - mode multi-joueur temps réel (WebSocket/Socket.IO).
  - seed de draft + historique de matchs.
  - équilibrage auto des pools (MMR simple).

### 9) Image to Link (`/image-to-link`)
- **État actuel**: utilitaire très utile, historique local.
- **Points forts**: valeur pratique immédiate.
- **Améliorations API**:
  - upload serveur (S3/Cloudinary) + URL signées.
  - raccourcisseur de liens intégré.
  - preset templates (mailing, blog, e-commerce).

### 10) Cars Racing (`/cars-racing`)
- **État actuel**: jeu canvas complet avec highscores locaux.
- **Points forts**: sensation de jeu très réussie.
- **Améliorations API**:
  - leaderboard global + saison mensuelle.
  - replay seed (ghost mode).
  - métriques perf FPS et réglages qualité.

### 11) Portfolio (`/`)
- **État actuel**: base solide, infos complètes.
- **Améliorations**:
  - ajouter preuves de projet: capture, stack, rôle, lien GitHub/demo.
  - clarifier la proposition de valeur en 1 phrase en header.
  - connecter formulaire contact à un endpoint mail sécurisé.

## Priorités recommandées (ordre concret)

1. **Backend API unique** (Express/Laravel) + endpoints pour chatbot, leaderboard et CRUD gestion.
2. **Authentification légère** + profils.
3. **Monitoring prod** (logs, erreurs, uptime) pour VPS.
4. **SEO/Perf**: images optimisées, métadonnées OG/Twitter, schema.org.
5. **Analytics**: événements clés (clic projets, CTA contact, temps sur page).

## Stack/API cible (simple et efficace)

- **Backend**: Node.js + Express ou Laravel (tu as déjà les deux univers dans le workspace).
- **DB**: PostgreSQL (ou SQLite au départ).
- **Realtime**: Socket.IO pour draft multijoueur.
- **Fichiers**: Cloudinary/S3 pour uploads (ImageToLink).
- **Sécurité**: Helmet, CORS strict, rate-limit, validation Zod/Joi.
- **Déploiement**: PM2 + Nginx/Apache reverse proxy + HTTPS Let’s Encrypt.

## Améliorations déjà implémentées (cette session)

### Corrections globales (tous projets)
- normalisation desktop-first (`100vw` problématiques remplacés par `100%` sur les conteneurs principaux).
- correction des styles Vite par défaut dans `index.css` (suppression du layout centré forcé du `body`).
- garde-fous anti-coupure: `overflow-x: hidden`, `#root` en pleine largeur, `box-sizing` global, médias responsives.

### Par projet (implémenté)
- **About**: cartes FAQ plus compactes et lisibles sur mobile.
- **Portfolio**: header profil optimisé téléphone (avatar/badges/espacements).
- **Cuillère**: UI chat premium responsive + mode API/démo + fallback + persistance locale.
- **Pokémon Types**: mode live PokéAPI + fallback local + grilles allégées mobile/tablette.
- **Memory Game**: barre info et grille mieux calibrées desktop/tablette/mobile, meilleure stabilité tactile.
- **Image to Link**: structure formulaires/cartes optimisée et boutons mieux adaptés petits écrans.
- **ReactCourse**: sidebar/leçons/carte de cours affinées en responsive avec meilleure lisibilité.
- **Cars Racing**: menu/contrôles/overlay retouchés pour éviter débordements et améliorer mobile.
- **Cars Racing**: mode ghost local + spawn en lanes + progression auto du niveau pour un gameplay plus cohérent.
- **Demon Slayer**: header/navigation allégés sur petits écrans + réduction d’effets lourds mobile.
- **Demon Slayer**: intégration d’images de personnages via API (Jikan) avec fallback robuste.
- **Inazuma Draft**: API joueurs enrichie (PNG proxifiées), stats étendues et simulation 1v1 de match améliorée.
- **Wii Menu**: grille/preview/footer optimisés tablette/téléphone + mode tactile amélioré.
- **App de gestion** (`Dashboard`, `Students`, `Teachers`): tables et blocs desktop/tablette/mobile fiabilisés.

## TODO — prochaines améliorations (à implémenter)

### Priorité haute
- [x] **Cuillère**: ajouter indicateur de latence API + bouton retry.
- [x] **App de gestion**: ajouter tri/filtre client-side sur colonnes de tableau.
- [x] **ReactCourse**: sauvegarder la progression par leçon dans `localStorage`.

### Priorité moyenne
- [x] **Pokémon Types**: ajouter comparaison de 2 types côte-à-côte.
- [x] **Image to Link**: ajouter presets de tailles (blog, miniature, bannière).
- [x] **Memory Game**: ajouter mode “daily challenge” (seed journalière).
- [x] **Cars Racing**: ajouter mode “ghost” local (meilleur tour précédent).

### Priorité basse
- [ ] **About**: ajouter un champ de recherche FAQ local.
- [ ] **Portfolio**: ajouter des vignettes “avant/après” par projet.
- [ ] **Demon Slayer**: ajouter mode “favoris” persistant.
- [ ] **Inazuma Draft**: ajouter système de seed partageable (`?seed=...`).
