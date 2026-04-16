#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# Déploiement VPS complet - Portfolio + API Yo-kai + MySQL
# HTTPS + vhost .conf supposés déjà configurés
# ============================================================

# -----------------------------
# Variables à adapter
# -----------------------------
PROJECT_DIR="/var/www/html/websites/portfolio"
WEB_ROOT="/var/www/enzobourgin.fr"
API_DIR="$PROJECT_DIR/yokai-medallium-api"

DOMAIN="enzobourgin.fr"
API_PORT="4010"

MYSQL_ROOT_MODE="sudo" # sudo | direct
MYSQL_DB="yokai_medallium"
MYSQL_USER="yokai_app"
MYSQL_PASSWORD="CHANGE_ME_STRONG_PASSWORD"

ADMIN_IMPORT_TOKEN="CHANGE_ME_IMPORT_TOKEN"
IMPORT_LIMIT="300"
RUN_IMPORT="yes" # yes | no

NODE_BIN="/usr/bin/node"
NPM_BIN="/usr/bin/npm"

SERVICE_NAME="yokai-medallium-api"

# -----------------------------
# Helpers
# -----------------------------
red() { printf '\033[31m%s\033[0m\n' "$*"; }
green() { printf '\033[32m%s\033[0m\n' "$*"; }
blue() { printf '\033[36m%s\033[0m\n' "$*"; }

run_mysql_root() {
  local sql="$1"
  if [[ "$MYSQL_ROOT_MODE" == "sudo" ]]; then
    sudo mysql -e "$sql"
  else
    mysql -u root -e "$sql"
  fi
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { red "Commande manquante: $1"; exit 1; }
}

# -----------------------------
# Pré-check
# -----------------------------
blue "[1/10] Vérification des prérequis"
require_cmd git
require_cmd rsync
require_cmd mysql
require_cmd "$NODE_BIN"
require_cmd "$NPM_BIN"

[[ -d "$PROJECT_DIR" ]] || { red "Dossier projet introuvable: $PROJECT_DIR"; exit 1; }
[[ -d "$API_DIR" ]] || { red "Dossier API introuvable: $API_DIR"; exit 1; }

# -----------------------------
# Pull code (optionnel)
# -----------------------------
blue "[2/10] Mise à jour du code (git pull)"
cd "$PROJECT_DIR"
if [[ -d .git ]]; then
  git pull --ff-only || true
else
  blue "Repo git non détecté, étape git pull ignorée"
fi

# -----------------------------
# Install deps
# -----------------------------
blue "[3/10] Installation des dépendances front + API"
cd "$PROJECT_DIR"
"$NPM_BIN" ci
cd "$API_DIR"
"$NPM_BIN" ci

# -----------------------------
# Env front
# -----------------------------
blue "[4/10] Configuration .env.production (front)"
cat > "$PROJECT_DIR/.env.production" <<EOF
VITE_YOKAI_API_URL=/api/yokai
EOF

# -----------------------------
# Env API
# -----------------------------
blue "[5/10] Configuration .env API"
cat > "$API_DIR/.env" <<EOF
PORT=$API_PORT
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=$MYSQL_USER
MYSQL_PASSWORD=$MYSQL_PASSWORD
MYSQL_DATABASE=$MYSQL_DB
ADMIN_IMPORT_TOKEN=$ADMIN_IMPORT_TOKEN
FANDOM_BASE_URL=https://yokaiwatch.fandom.com
IMPORT_LIMIT=$IMPORT_LIMIT
EOF

# -----------------------------
# MySQL setup
# -----------------------------
blue "[6/10] Provisioning MySQL (DB + user + droits + schéma)"
run_mysql_root "CREATE DATABASE IF NOT EXISTS $MYSQL_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
run_mysql_root "CREATE USER IF NOT EXISTS '$MYSQL_USER'@'localhost' IDENTIFIED BY '$MYSQL_PASSWORD';"
run_mysql_root "GRANT ALL PRIVILEGES ON $MYSQL_DB.* TO '$MYSQL_USER'@'localhost'; FLUSH PRIVILEGES;"

mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DB" < "$API_DIR/src/db/schema.sql"

# -----------------------------
# Build + publish front
# -----------------------------
blue "[7/10] Build front + publication web"
cd "$PROJECT_DIR"
"$NPM_BIN" run build
sudo mkdir -p "$WEB_ROOT"
sudo rsync -av --delete "$PROJECT_DIR/dist/" "$WEB_ROOT/"

# -----------------------------
# systemd API
# -----------------------------
blue "[8/10] Installation/MAJ service systemd API"
sudo tee "/etc/systemd/system/${SERVICE_NAME}.service" >/dev/null <<EOF
[Unit]
Description=Yo-kai Medallium API
After=network.target mariadb.service

[Service]
Type=simple
WorkingDirectory=$API_DIR
ExecStart=$NODE_BIN src/server.js
Restart=always
RestartSec=5
User=www-data
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE_NAME"
sudo systemctl restart "$SERVICE_NAME"

# -----------------------------
# Import data
# -----------------------------
blue "[9/10] Import wiki Yo-kai (optionnel)"
if [[ "$RUN_IMPORT" == "yes" ]]; then
  cd "$API_DIR"
  IMPORT_LIMIT="$IMPORT_LIMIT" "$NPM_BIN" run import:wikis || true
else
  blue "Import ignoré (RUN_IMPORT=$RUN_IMPORT)"
fi

# -----------------------------
# Checks finaux
# -----------------------------
blue "[10/10] Vérifications finales"
API_HEALTH=$(curl -s "http://127.0.0.1:${API_PORT}/health" || true)
YO_COUNT=$(mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -D "$MYSQL_DB" -N -e "SELECT COUNT(*) FROM yokai;" || echo "0")

green "Déploiement terminé ✅"
echo ""
echo "Domaine: https://$DOMAIN"
echo "Front webroot: $WEB_ROOT"
echo "API health: $API_HEALTH"
echo "Yo-kai en DB: $YO_COUNT"
echo ""
echo "Commandes utiles:"
echo "  sudo systemctl status $SERVICE_NAME"
echo "  journalctl -u $SERVICE_NAME -f"
echo "  curl -s http://127.0.0.1:${API_PORT}/health"
echo ""
echo "⚠️ Pense à changer MYSQL_PASSWORD et ADMIN_IMPORT_TOKEN dans ce script avant prod."
