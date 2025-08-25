# 🤖 AI Chatbot - Sistema di Assistenza Intelligente

## Panoramica

L'AI Chatbot è un sistema di assistenza intelligente integrato nel Gestionale Finanziario che fornisce:

- **Chat AI interattiva** per domande e assistenza
- **Rilevamento intelligente degli intent** con machine learning
- **Risposte contestuali** basate sulla conversazione
- **Quick replies** per navigazione rapida
- **Fallback locale** quando l'API non è disponibile

## 🚀 Come Utilizzare

### 1. Apertura del Chatbot
- Clicca sul pulsante fluttuante 🤖 nell'interfaccia
- Oppure naviga alla sezione AI Advanced > Chatbot

### 2. Inizio Conversazione
- Il chatbot si presenta automaticamente con un messaggio di benvenuto
- Puoi iniziare a scrivere domande o richieste
- Utilizza i quick replies per navigare rapidamente tra le funzionalità

### 3. Esempi di Domande
```
- "Ciao" → Saluto e presentazione
- "Cosa puoi fare?" → Panoramica sistema
- "Analisi predittiva" → Informazioni su analisi AI
- "Rilevamento frodi" → Sicurezza e protezione
- "Ottimizzazione investimenti" → Gestione portfolio
- "Automazione processi" → Processi automatici
```

## 🔧 Debug e Configurazione

### Componente di Test
Utilizza il componente `ChatbotSimpleTest` per:
- Testare messaggi singoli
- Verificare il rilevamento degli intent
- Controllare i quick replies
- Configurare i parametri del chatbot

### Configurazioni Disponibili

#### Debug & Logging
- **Abilita Log Debug**: Mostra log dettagliati nella console
- **Forza Processamento Locale**: Salta le chiamate API per test
- **Abilita Fallback Locale**: Usa il processamento locale se l'API fallisce

#### Parametri
- **Soglia Intent**: Percentuale minima per riconoscere un intent (60% default)
- **Timeout API**: Tempo massimo per le chiamate API (10s default)

### Console Logs
Con i log di debug abilitati, vedrai:
```
🤖 [Chatbot] 🔄 Attempting to process message via API: ciao
🤖 [Chatbot] ❌ API call failed, falling back to local processing
🤖 [Chatbot] 🔧 Processing message locally: ciao
🤖 [Chatbot] 🔍 Analyzing message for intent: ciao
🤖 [Chatbot] 🎯 Exact match found for intent: greeting
🤖 [Chatbot] 🏆 Best intent match: greeting with score: 100
🤖 [Chatbot] 💬 Generated response: {...}
```

## 🏗️ Architettura

### Componenti Principali

#### 1. **AIChatbot.tsx** - Interfaccia utente
- Gestione della conversazione
- Visualizzazione messaggi
- Gestione quick replies
- Integrazione con il servizio

#### 2. **aiChatbotService.ts** - Servizio backend
- Processamento messaggi
- Rilevamento intent
- Generazione risposte
- Gestione sessioni
- Fallback locale

#### 3. **ChatbotSimpleTest.tsx** - Componente di test
- Test funzionalità
- Debug configurazione
- Verifica intent detection
- Configurazione parametri

### Flusso di Elaborazione

```
1. Utente invia messaggio
2. Chiamata API /ai/chatbot/message
3. Se API fallisce → Fallback locale
4. Rilevamento intent con scoring
5. Generazione risposta appropriata
6. Restituzione messaggio + metadata
```

## 🐛 Risoluzione Problemi

### Chatbot Non Risponde
1. **Controlla la console** per errori
2. **Verifica la configurazione** nel componente di test
3. **Abilita i log di debug** per vedere cosa succede
4. **Testa con il componente di test** per isolare il problema

### Risposte Non Corrette
1. **Verifica la soglia intent** (default 60%)
2. **Controlla gli esempi** negli intent
3. **Testa messaggi specifici** per vedere l'intent rilevato
4. **Usa il fallback locale** per testare senza API

### Performance Lente
1. **Riduci il timeout API** se necessario
2. **Abilita il processamento locale** per test rapidi
3. **Controlla i log** per identificare colli di bottiglia

## 📊 Intent Disponibili

### Intent Principali
- **greeting**: Saluti e presentazione
- **check_balance**: Controllo saldo conto
- **recent_transactions**: Movimenti recenti
- **investment_advice**: Consigli investimenti
- **fraud_detection**: Rilevamento frodi
- **predictive_analysis**: Analisi predittiva
- **system_overview**: Panoramica sistema

### Intent Specializzati
- **market_data**: Dati di mercato
- **education_request**: Educazione finanziaria
- **security_alerts**: Alert di sicurezza
- **compliance_intelligence**: Compliance intelligente
- **personalization_ux**: Personalizzazione UX

## 🔄 Aggiornamenti e Manutenzione

### Aggiungere Nuovi Intent
1. Aggiungi l'intent nell'array `intents`
2. Definisci esempi e risposte
3. Implementa la logica in `generateResponse`
4. Testa con il componente di test

### Modificare Risposte
1. Aggiorna l'array `responses` dell'intent
2. Modifica la logica in `generateResponse`
3. Testa le modifiche

### Configurazione Dinamica
- Usa `updateChatbotConfig()` per modificare parametri
- Usa `getChatbotConfig()` per leggere la configurazione
- Usa `resetChatbotConfig()` per ripristinare i default

## 📱 Integrazione

### Con Altri Componenti
- **AINewsIntelligence**: News e sentiment analysis
- **AIAdvancedDashboard**: Dashboard avanzate
- **AIAgent**: Sistema di assistenza generale

### API Endpoints
- `POST /ai/chatbot/message` - Processamento messaggi
- `POST /ai/chatbot/sessions` - Creazione sessioni
- `PUT /ai/chatbot/sessions/:id/context` - Aggiornamento contesto
- `PUT /ai/chatbot/sessions/:id/end` - Chiusura sessioni

## 🎯 Best Practices

1. **Testa sempre** con il componente di test
2. **Usa i log** per debug e monitoraggio
3. **Configura parametri** in base alle esigenze
4. **Mantieni aggiornati** gli esempi degli intent
5. **Gestisci errori** appropriatamente
6. **Documenta modifiche** e nuove funzionalità

## 🆘 Supporto

Per problemi o domande:
1. Controlla i log della console
2. Usa il componente di test per debug
3. Verifica la configurazione
4. Controlla la documentazione degli intent
5. Testa con messaggi semplici prima di quelli complessi
