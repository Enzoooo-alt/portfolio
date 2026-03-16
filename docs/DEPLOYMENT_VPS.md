# Déploiement VPS complet (Front + API Yo-kai MySQL)

Ce guide couvre le déploiement de :

- la SPA Vite/React (`/`, `/menu`, `/cars-racing`, `/yokai-medallium`, etc.)
- l’API `yokai-medallium-api` (Node.js + MySQL)
- la musique custom (`public/audio/*.mp3`)

## 0) Prérequis VPS

- Debian/Ubuntu récent
- Nom de domaine pointant vers le VPS
- Apache ou Nginx
- Node.js LTS (20+ recommandé)
- MariaDB/MySQL
- Certbot (SSL)

Exemple paquets:

```bash
sudo apt update
sudo apt install -y git curl unzip
sudo apt install -y apache2 libapache2-mod-proxy-html libapache2-mod-fcgid
sudo apt install -y mariadb-server
sudo apt install -y certbot python3-certbot-apache
```

Installer Node LTS (selon ta méthode standard : nvm ou nodesource).

## 1) Récupérer le projet

```bash
cd /var/www/html
git clone <URL_DU_REPO> portfolio
cd portfolio
```

## 2) Configuration Front (Vite)

Créer `.env.production` à la racine du repo :

```bash
cat > .env.production <<'EOF'
VITE_YOKAI_API_URL=/api/yokai
EOF
```

Build production :

```bash
npm ci
npm run build
```

Publier `dist/` dans le DocumentRoot de ton vhost.

Exemple :

```bash
sudo rsync -av --delete dist/ /var/www/enzobourgin.fr/
```

## 3) Ajouter les musiques (important)

Copier tes fichiers dans `public/audio/` avant le build (ou dans le dossier publié après build) avec **ces noms exacts** :

- `mario-galaxy-gusty-garden.mp3`
- `mario-64-bob-omb.mp3`
- `wii-sports-title.mp3`
- `tomodachi-life-theme.mp3`
- `inazuma-eleven-match.mp3`
- `yokai-watch-main-theme.mp3`

## 4) Configuration MySQL pour l’API Yo-kai

Créer la base + utilisateur applicatif :

```bash
sudo mysql -e "CREATE DATABASE IF NOT EXISTS yokai_medallium CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'yokai_app'@'localhost' IDENTIFIED BY 'CHANGE_ME_STRONG_PASSWORD';"
sudo mysql -e "GRANT ALL PRIVILEGES ON yokai_medallium.* TO 'yokai_app'@'localhost'; FLUSH PRIVILEGES;"
```

Appliquer le schéma :

```bash
mysql -u yokai_app -p yokai_medallium < /var/www/html/portfolio/yokai-medallium-api/src/db/schema.sql
```

## 5) Configuration API Yo-kai

```bash
cd /var/www/html/portfolio/yokai-medallium-api
npm ci
cp .env.example .env
```

Éditer `.env` :

```env
PORT=4010
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=yokai_app
MYSQL_PASSWORD=CHANGE_ME_STRONG_PASSWORD
MYSQL_DATABASE=yokai_medallium
ADMIN_IMPORT_TOKEN=CHANGE_ME_IMPORT_TOKEN
FANDOM_BASE_URL=https://yokaiwatch.fandom.com
IMPORT_LIMIT=300
```

Test rapide local API :

```bash
node src/server.js
curl http://127.0.0.1:4010/health
```

## 6) Lancer l’API en service systemd (recommandé)

Créer `/etc/systemd/system/yokai-medallium-api.service` :

```ini
[Unit]
Description=Yo-kai Medallium API
After=network.target mariadb.service

[Service]
Type=simple
WorkingDirectory=/var/www/html/portfolio/yokai-medallium-api
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=5
User=www-data
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Activer :

```bash
sudo systemctl daemon-reload
sudo systemctl enable yokai-medallium-api
sudo systemctl start yokai-medallium-api
sudo systemctl status yokai-medallium-api
```

Logs :

```bash
journalctl -u yokai-medallium-api -f
```

## 7) Reverse proxy web serveur

### Apache

Activer modules :

```bash
sudo a2enmod rewrite proxy proxy_http headers
sudo systemctl restart apache2
```

Dans le vhost (`enzobourgin.fr.conf`) :

```apache
DocumentRoot /var/www/enzobourgin.fr

<Directory /var/www/enzobourgin.fr>
    AllowOverride All
    Require all granted
</Directory>

ProxyPreserveHost On
ProxyPass /api/yokai http://127.0.0.1:4010/api/yokai
ProxyPassReverse /api/yokai http://127.0.0.1:4010/api/yokai
```

Le fallback SPA est géré via `.htaccess` (copié depuis `public/.htaccess` dans `dist/.htaccess`).

### Nginx (alternative)

```nginx
location /api/yokai/ {
  proxy_pass http://127.0.0.1:4010/api/yokai/;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
}

location / {
  try_files $uri $uri/ /index.html;
}
```

## 8) SSL

Apache + Certbot :

```bash
sudo certbot --apache -d enzobourgin.fr -d www.enzobourgin.fr
```

## 9) Import initial Yo-kai

```bash
cd /var/www/html/portfolio/yokai-medallium-api
npm run import:wikis
```

Vérifier volume importé :

```bash
mysql -u yokai_app -p -D yokai_medallium -e "SELECT COUNT(*) AS total_yokai FROM yokai;"
```

## 10) Import périodique (cron)

Exemple cron quotidien à 04:30 :

```bash
crontab -e
```

Ajouter :

```cron
30 4 * * * cd /var/www/html/portfolio/yokai-medallium-api && /usr/bin/npm run import:wikis >> /var/log/yokai-import.log 2>&1
```

## 11) Vérification finale

- `https://enzobourgin.fr/` charge correctement
- refresh direct OK sur `/menu`, `/yokai-medallium`, `/app-de-gestion/dashboard`
- `https://enzobourgin.fr/api/yokai` répond
- `https://enzobourgin.fr/api/yokai/tribes` répond
- musique BGM : les fichiers sont bien présents dans `/audio/*.mp3`

## 12) Routine de mise à jour

```bash
cd /var/www/html/portfolio
git pull

# Front
npm ci
npm run build
sudo rsync -av --delete dist/ /var/www/enzobourgin.fr/

# API
cd yokai-medallium-api
npm ci
sudo systemctl restart yokai-medallium-api

# Optionnel: refresh data
npm run import:wikis
```

## 13) Ce qu’il faut absolument ajouter avant prod

- mot de passe MySQL robuste (pas la valeur exemple)
- `ADMIN_IMPORT_TOKEN` robuste
- sauvegarde DB régulière (`mysqldump`)
- monitoring de service (`systemctl` + logs)
- rotation de logs (`logrotate`) si import fréquent
