# 🏦 Core Banking Backend

## Panoramica

Il Core Banking Backend è il servizio principale che gestisce:
- **Conti bancari** e transazioni
- **API REST** per il frontend
- **AI Chatbot** per assistenza clienti
- **Documentazione Swagger** delle API

## 🚀 Avvio Rapido

### Prerequisiti
- Node.js 18+ 
- npm o yarn

### Installazione
```bash
npm install
```

### Configurazione
1. Copia il file di esempio:
```bash
cp env.example .env
```

2. Modifica le variabili nel file `.env`:
```bash
CORE_BANKING_PORT=3001
NODE_ENV=development
CHATBOT_ENABLED=true
CHATBOT_DEBUG=true
```

### Avvio
```bash
npm start
```

Il server sarà disponibile su `http://localhost:3001`

## 🔧 Configurazione

### Variabili d'Ambiente

#### Server
- `CORE_BANKING_PORT`: Porta del server (default: 3001)
- `NODE_ENV`: Ambiente di esecuzione (development/production)

#### Chatbot AI
- `CHATBOT_ENABLED`: Abilita il servizio chatbot (default: true)
- `CHATBOT_DEBUG`: Abilita i log di debug (default: true)
- `CHATBOT_FALLBACK_ENABLED`: Abilita il fallback locale (default: true)
- `CHATBOT_API_TIMEOUT`: Timeout per le chiamate API (default: 10000ms)
- `CHATBOT_MIN_INTENT_CONFIDENCE`: Soglia minima per il rilevamento intent (default: 0.6)

#### Sicurezza
- `HELMET_ENABLED`: Abilita Helmet per la sicurezza (default: true)
- `COMPRESSION_ENABLED`: Abilita la compressione (default: true)
- `MORGAN_ENABLED`: Abilita i log HTTP (default: true)

## 📚 API Endpoints

### Health Check
- `GET /health` - Stato del servizio

### Conti Bancari
- `GET /api/v1/accounts` - Lista conti
- `GET /api/v1/accounts/:id` - Dettagli conto

### Transazioni
- `GET /api/v1/transactions` - Lista transazioni
- `GET /api/v1/transactions/:id` - Dettagli transazione

### AI Chatbot
- `POST /ai/chatbot/message` - Processa messaggio chatbot
- `POST /ai/chatbot/sessions` - Crea nuova sessione
- `PUT /ai/chatbot/sessions/:id/context` - Aggiorna contesto sessione
- `PUT /ai/chatbot/sessions/:id/end` - Chiude sessione

## 🤖 AI Chatbot

### Funzionalità
- **Rilevamento Intent**: Analizza i messaggi per identificare l'intent dell'utente
- **Risposte Contestuali**: Genera risposte appropriate basate sull'intent
- **Quick Replies**: Fornisce opzioni di risposta rapida
- **Gestione Sessioni**: Mantiene il contesto della conversazione

### Intent Supportati
- **greeting**: Saluti e presentazione
- **fraud_detection**: Rilevamento frodi e sicurezza
- **predictive_analysis**: Analisi predittiva e AI
- **system_overview**: Panoramica del sistema

### Esempi di Utilizzo

#### Messaggio Utente
```json
POST /ai/chatbot/message
{
  "message": "Ciao, come funziona la sicurezza?",
  "sessionId": "session_123",
  "userId": "user_456"
}
```

#### Risposta Bot
```json
{
  "success": true,
  "data": {
    "id": "msg_789",
    "sessionId": "session_123",
    "message": "🔒 **Rilevamento Frodi in Tempo Reale** - Il nostro sistema AI monitora 24/7...",
    "sender": "bot",
    "timestamp": "2024-01-15T10:30:00Z",
    "type": "text",
    "metadata": {
      "intent": "fraud_detection",
      "confidence": 0.9,
      "quickReplies": [...]
    }
  }
}
```

## 🏗️ Architettura

### Struttura File
```
src/
├── routes/
│   ├── accounts.js      # API conti bancari
│   ├── transactions.js  # API transazioni
│   └── aiChatbot.js    # API chatbot AI
├── models/              # Modelli dati
├── controllers/         # Controller business logic
├── middleware/          # Middleware Express
├── services/            # Servizi business
├── utils/               # Utility e helper
└── server.js           # Entry point principale
```

### Middleware
- **Helmet**: Sicurezza HTTP headers
- **CORS**: Cross-origin resource sharing
- **Compression**: Compressione risposte
- **Morgan**: Logging HTTP requests
- **Rate Limiting**: Limitazione richieste

## 🔍 Debug e Logging

### Log Console
Il servizio fornisce log dettagliati per:
- Richieste HTTP in arrivo
- Processamento messaggi chatbot
- Rilevamento intent
- Errori e eccezioni

### Esempio Log
```
🤖 [Backend] Processing message: "Ciao, come funziona la sicurezza?" for session: session_123
🎯 [Backend] Intent detected: fraud_detection
💬 [Backend] Response generated: 🔒 **Rilevamento Frodi in Tempo Reale**...
✅ [Backend] Chat message created with ID: msg_789
```

## 🧪 Testing

### Test Manuali
1. **Health Check**: `curl http://localhost:3001/health`
2. **Chatbot**: Usa il componente di test nel frontend
3. **API**: Usa Swagger UI su `/api-docs`

### Test Automatizzati
```bash
npm test
```

## 🚨 Troubleshooting

### Chatbot Non Risponde
1. Verifica che il servizio sia in esecuzione
2. Controlla i log per errori
3. Verifica la configurazione CORS
4. Testa l'endpoint `/health`

### Errori CORS
1. Verifica `CORS_ORIGIN` nel file `.env`
2. Assicurati che il frontend sia su `http://localhost:3000`
3. Riavvia il server dopo modifiche alla configurazione

### Performance Lente
1. Riduci `CHATBOT_API_TIMEOUT`
2. Abilita la compressione
3. Verifica i log per colli di bottiglia

## 📈 Monitoraggio

### Metriche Disponibili
- Richieste per minuto
- Tempo di risposta medio
- Tasso di errore
- Utilizzo memoria/CPU

### Health Check
L'endpoint `/health` fornisce:
- Stato del servizio
- Versione
- Timestamp
- Informazioni sistema

## 🔄 Deployment

### Produzione
1. Imposta `NODE_ENV=production`
2. Configura variabili d'ambiente sicure
3. Usa un process manager (PM2, Docker)
4. Configura logging su file
5. Abilita monitoring e alerting

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📞 Supporto

Per problemi o domande:
1. Controlla i log del server
2. Verifica la configurazione
3. Testa gli endpoint individualmente
4. Controlla la documentazione Swagger
5. Apri un issue su GitHub

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per dettagli.
