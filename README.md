# Portfolio Enzo Bourgin (React + Vite)

Application principale du portfolio déployée sur `enzobourgin.fr`.

## Démarrage rapide

```bash
npm install
npm run dev
```

Build de production :

```bash
npm run build
```

Prévisualisation locale du build :

```bash
npm run preview
```

## Structure du front (`src`)

```text
src/
├─ App.jsx
├─ main.jsx
├─ index.css
├─ pages/                        # Pages portfolio et mini-apps
├─ layouts/                      # Layouts de navigation (ex: app de gestion)
├─ features/
│  └─ school-management/         # Feature isolée "app-de-gestion"
│     ├─ components/
│     └─ pages/
├─ styles/
│  ├─ pages/                     # CSS des pages
│  └─ WiiMenu.css
└─ assets/
```

## Dossiers annexes dans ce workspace

Ces dossiers existent dans le même repo mais ne sont pas utilisés par le build Vite du portfolio principal :

- `b2lp/`
- `inazuma-eleven/`
- `MaBanque/`
- `cuillere-backend/`

## Déploiement VPS

Guide détaillé : voir `docs/DEPLOYMENT_VPS.md`.

Ce guide couvre maintenant :

- déploiement front Vite (SPA)
- déploiement API Yo-kai (`yokai-medallium-api`) en service systemd
- configuration MySQL + import wiki
- reverse proxy `/api/yokai` (Apache/Nginx)
- SSL, cron d’import, checklist post-déploiement

Résumé :

1. `npm ci`
2. `npm run build`
3. Publier le contenu de `dist/` dans la racine web de `enzobourgin.fr`
4. Vérifier la réécriture SPA (fichier `.htaccess` présent dans `public/`)

## Vérification avant mise en ligne

- `npm run build` passe sans erreur
- Les routes SPA (`/menu`, `/about`, `/app-de-gestion/...`) fonctionnent en accès direct
- Les liens externes et CTA (mail/téléphone) répondent correctement
