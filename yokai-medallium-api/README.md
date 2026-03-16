# Yo-kai Medallium API (MySQL)

API Node.js + MySQL pour alimenter un médallium Yo-kai dynamique.

## 1) Installation

```bash
cd yokai-medallium-api
npm install
cp .env.example .env
```

## 2) Base MySQL

Créer le schéma:

```bash
mysql -u root -p < src/db/schema.sql
```

## 3) Lancer l'API

```bash
npm run dev
```

Healthcheck: `GET http://localhost:4010/health`

## 4) Import automatique depuis wiki

```bash
npm run import:wikis
```

Ou via endpoint admin:

```bash
curl -X POST "http://localhost:4010/api/yokai/admin/import?limit=500" \
  -H "x-admin-token: change-me"
```

## Endpoints

- `GET /api/yokai`
- `GET /api/yokai?search=jibanyan&page=1&pageSize=24`
- `GET /api/yokai?tribe=Brave`
- `GET /api/yokai/tribes`
- `GET /api/yokai/:slug`
- `POST /api/yokai/admin/import?limit=500`

## Notes

- Les contenus/images viennent de pages wiki publiques (source dans `wiki_url`).
- Vérifie les droits/licences des assets avant usage commercial.
