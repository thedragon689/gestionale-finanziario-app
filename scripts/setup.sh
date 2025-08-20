#!/bin/bash

# Gestionale Finanziario - Setup Script
# Questo script configura l'ambiente di sviluppo per il gestionale finanziario

set -e

echo "🏦 Gestionale Finanziario - Setup Script"
echo "========================================"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzione per log
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verifica prerequisiti
check_prerequisites() {
    log "Verifica prerequisiti..."
    
    # Verifica Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js non trovato. Installa Node.js 18+ prima di continuare."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js versione 18+ richiesta. Versione attuale: $(node -v)"
        exit 1
    fi
    
    log "Node.js $(node -v) - OK"
    
    # Verifica npm
    if ! command -v npm &> /dev/null; then
        error "npm non trovato."
        exit 1
    fi
    
    log "npm $(npm -v) - OK"
    
    # Verifica Docker
    if ! command -v docker &> /dev/null; then
        warn "Docker non trovato. Il sistema funzionerà solo in modalità sviluppo locale."
    else
        log "Docker $(docker --version) - OK"
    fi
    
    # Verifica Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        warn "Docker Compose non trovato."
    else
        log "Docker Compose $(docker-compose --version) - OK"
    fi
}

# Setup ambiente
setup_environment() {
    log "Setup ambiente..."
    
    # Crea file .env se non esiste
    if [ ! -f .env ]; then
        log "Creazione file .env da env.example..."
        cp env.example .env
        warn "Modifica il file .env con le tue configurazioni prima di continuare."
    else
        log "File .env già esistente."
    fi
    
    # Crea directory necessarie
    mkdir -p logs
    mkdir -p database/backups
    mkdir -p nginx/ssl
    mkdir -p monitoring
}

# Installazione dipendenze
install_dependencies() {
    log "Installazione dipendenze..."
    
    # Installa dipendenze principali
    npm install
    
    # Installa dipendenze Core Banking
    if [ -d "core-banking" ]; then
        log "Installing Core Banking dependencies..."
        cd core-banking
        npm install
        cd ..
    fi
    
    # Installa dipendenze Cryptocurrency
    if [ -d "cryptocurrency" ]; then
        log "Installing Cryptocurrency dependencies..."
        cd cryptocurrency
        npm install
        cd ..
    fi
    
    # Installa dipendenze Frontend
    if [ -d "frontend" ]; then
        log "Installing Frontend dependencies..."
        cd frontend
        npm install
        cd ..
    fi
}

# Setup database
setup_database() {
    log "Setup database..."
    
    # Crea script di inizializzazione database
    cat > database/init/01-init.sql << 'EOF'
-- Inizializzazione database Gestionale Finanziario

-- Estensione per UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Estensione per crittografia
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Schema per il sistema bancario
CREATE SCHEMA IF NOT EXISTS banking;

-- Schema per criptovalute
CREATE SCHEMA IF NOT EXISTS crypto;

-- Schema per compliance
CREATE SCHEMA IF NOT EXISTS compliance;

-- Schema per audit
CREATE SCHEMA IF NOT EXISTS audit;

-- Utente per applicazione
CREATE USER IF NOT EXISTS app_user WITH PASSWORD 'app_password';
GRANT ALL PRIVILEGES ON DATABASE gestionale_finanziario TO app_user;
GRANT ALL PRIVILEGES ON SCHEMA banking TO app_user;
GRANT ALL PRIVILEGES ON SCHEMA crypto TO app_user;
GRANT ALL PRIVILEGES ON SCHEMA compliance TO app_user;
GRANT ALL PRIVILEGES ON SCHEMA audit TO app_user;

-- Configurazione timezone
SET timezone = 'Europe/Rome';
EOF

    log "Script di inizializzazione database creato."
}

# Setup Bitcoin Core (opzionale)
setup_bitcoin() {
    log "Setup Bitcoin Core..."
    
    if command -v docker &> /dev/null; then
        # Crea docker-compose per Bitcoin Core
        cat > bitcoin-core/docker-compose.yml << 'EOF'
version: '3.8'

services:
  bitcoin-core:
    image: kylemanna/bitcoind:latest
    container_name: bitcoin_core
    environment:
      - BITCOIN_RPC_USER=bitcoin
      - BITCOIN_RPC_PASSWORD=bitcoin_password
      - BITCOIN_RPC_ALLOW_IP=0.0.0.0/0
      - BITCOIN_TESTNET=1
    ports:
      - "8332:8332"
      - "18332:18332"
    volumes:
      - bitcoin_data:/bitcoin/.bitcoin
    command: >
      bitcoind
      -testnet
      -rpcuser=bitcoin
      -rpcpassword=bitcoin_password
      -rpcallowip=0.0.0.0/0
      -rpcbind=0.0.0.0
      -server=1
      -txindex=1
      -zmqpubrawblock=tcp://0.0.0.0:28332
      -zmqpubrawtx=tcp://0.0.0.0:28333

volumes:
  bitcoin_data:
EOF

        log "Docker Compose per Bitcoin Core creato."
        warn "Per avviare Bitcoin Core: cd bitcoin-core && docker-compose up -d"
    else
        warn "Docker non disponibile. Bitcoin Core deve essere installato manualmente."
    fi
}

# Setup monitoring
setup_monitoring() {
    log "Setup monitoring..."
    
    # Configurazione Prometheus
    cat > monitoring/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'gestionale-api'
    static_configs:
      - targets: ['api-gateway:3001']
    metrics_path: '/metrics'

  - job_name: 'core-banking'
    static_configs:
      - targets: ['core-banking:3002']
    metrics_path: '/metrics'

  - job_name: 'cryptocurrency'
    static_configs:
      - targets: ['cryptocurrency:3007']
    metrics_path: '/metrics'
EOF

    log "Configurazione monitoring creata."
}

# Setup nginx
setup_nginx() {
    log "Setup nginx..."
    
    # Configurazione nginx
    cat > nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream api_backend {
        server api-gateway:3001;
    }

    upstream frontend_backend {
        server frontend:3000;
    }

    server {
        listen 80;
        server_name localhost;

        # Frontend
        location / {
            proxy_pass http://frontend_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API
        location /api/ {
            proxy_pass http://api_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check
        location /health {
            proxy_pass http://api_backend/health;
        }
    }
}
EOF

    log "Configurazione nginx creata."
}

# Setup SSL (self-signed per sviluppo)
setup_ssl() {
    log "Setup SSL certificates..."
    
    if [ ! -f nginx/ssl/server.crt ]; then
        log "Generazione certificati SSL self-signed..."
        
        # Crea directory SSL
        mkdir -p nginx/ssl
        
        # Genera certificato self-signed
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout nginx/ssl/server.key \
            -out nginx/ssl/server.crt \
            -subj "/C=IT/ST=Italy/L=Rome/O=Gestionale Finanziario/CN=localhost"
        
        log "Certificati SSL generati."
    else
        log "Certificati SSL già esistenti."
    fi
}

# Verifica finale
verify_setup() {
    log "Verifica setup..."
    
    # Verifica file di configurazione
    if [ -f .env ]; then
        log "✓ File .env presente"
    else
        error "✗ File .env mancante"
        exit 1
    fi
    
    # Verifica dipendenze
    if [ -f "node_modules/.package-lock.json" ]; then
        log "✓ Dipendenze Node.js installate"
    else
        error "✗ Dipendenze Node.js mancanti"
        exit 1
    fi
    
    # Verifica Docker Compose
    if [ -f "docker-compose.yml" ]; then
        log "✓ Docker Compose configurato"
    else
        error "✗ Docker Compose mancante"
        exit 1
    fi
    
    log "Setup completato con successo! 🎉"
}

# Menu principale
main() {
    case "${1:-all}" in
        "prerequisites")
            check_prerequisites
            ;;
        "environment")
            setup_environment
            ;;
        "dependencies")
            install_dependencies
            ;;
        "database")
            setup_database
            ;;
        "bitcoin")
            setup_bitcoin
            ;;
        "monitoring")
            setup_monitoring
            ;;
        "nginx")
            setup_nginx
            ;;
        "ssl")
            setup_ssl
            ;;
        "verify")
            verify_setup
            ;;
        "all")
            check_prerequisites
            setup_environment
            install_dependencies
            setup_database
            setup_bitcoin
            setup_monitoring
            setup_nginx
            setup_ssl
            verify_setup
            ;;
        *)
            echo "Uso: $0 [prerequisites|environment|dependencies|database|bitcoin|monitoring|nginx|ssl|verify|all]"
            echo ""
            echo "Comandi disponibili:"
            echo "  prerequisites  - Verifica prerequisiti"
            echo "  environment    - Setup ambiente"
            echo "  dependencies   - Installa dipendenze"
            echo "  database       - Setup database"
            echo "  bitcoin        - Setup Bitcoin Core"
            echo "  monitoring     - Setup monitoring"
            echo "  nginx          - Setup nginx"
            echo "  ssl            - Setup certificati SSL"
            echo "  verify         - Verifica setup"
            echo "  all            - Esegue tutto (default)"
            exit 1
            ;;
    esac
}

# Esegui script
main "$@"
