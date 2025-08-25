const express = require('express');
const router = express.Router();

// Comprehensive FAQ System
const faqData = {
  bilancio: [
    {
      question: 'Qual è il mio saldo attuale?',
      answer: 'Il tuo saldo attuale è di €3.250, aggiornato alle 14:05 di oggi. Puoi visualizzare il saldo in tempo reale nella dashboard principale.',
      keywords: ['saldo', 'bilancio', 'disponibile', 'conto', 'balance']
    },
    {
      question: 'Posso esportare il bilancio in PDF?',
      answer: 'Certamente! Vai nella sezione "Bilancio" e clicca su "Esporta PDF". Puoi scegliere il periodo e il formato di esportazione.',
      keywords: ['esporta', 'pdf', 'bilancio', 'download', 'stampa']
    },
    {
      question: 'Come posso vedere il saldo di tutti i miei conti?',
      answer: 'Nella sezione "Conti" trovi una panoramica completa di tutti i tuoi conti con saldi aggiornati in tempo reale.',
      keywords: ['tutti conti', 'panoramica', 'conti multipli', 'overview']
    },
    {
      question: 'Quando viene aggiornato il saldo?',
      answer: 'Il saldo viene aggiornato in tempo reale per le transazioni online e ogni 24 ore per le operazioni bancarie tradizionali.',
      keywords: ['aggiornamento', 'tempo reale', '24 ore', 'frequenza']
    }
  ],
  transazioni: [
    {
      question: 'Come posso visualizzare le transazioni degli ultimi 30 giorni?',
      answer: 'Vai su "Storico Transazioni" e imposta il filtro temporale su "Ultimi 30 giorni". Puoi anche personalizzare il periodo.',
      keywords: ['ultimi 30 giorni', 'storico', 'filtro', 'periodo', 'transazioni']
    },
    {
      question: 'Perché una transazione risulta in sospeso?',
      answer: 'Le transazioni possono restare in sospeso per verifica bancaria o limiti di sicurezza. Controlla i dettagli cliccando sulla voce.',
      keywords: ['in sospeso', 'verifica', 'sicurezza', 'stato', 'transazione']
    },
    {
      question: 'Come posso annullare una transazione?',
      answer: 'Le transazioni già processate non possono essere annullate. Per transazioni in sospeso, contatta l\'assistenza clienti.',
      keywords: ['annullare', 'disdire', 'transazione', 'processata', 'sospeso']
    },
    {
      question: 'Quanto tempo impiegano i bonifici?',
      answer: 'I bonifici SEPA impiegano 1-2 giorni lavorativi. I bonifici istantanei sono elaborati entro pochi secondi.',
      keywords: ['bonifico', 'tempo', 'SEPA', 'istantaneo', 'giorni']
    }
  ],
  portafoglio: [
    {
      question: 'Come posso modificare la composizione del mio portafoglio?',
      answer: 'Accedi alla sezione "Portafoglio", clicca su "Modifica" e seleziona gli asset da aggiungere o rimuovere.',
      keywords: ['modificare', 'composizione', 'asset', 'aggiungere', 'rimuovere']
    },
    {
      question: 'Qual è la performance del mio portafoglio questo mese?',
      answer: 'Il tuo portafoglio ha registrato una variazione del +4,2% rispetto al mese scorso. Puoi vedere i dettagli nella sezione "Performance".',
      keywords: ['performance', 'variazione', 'mese', 'rendimento', 'risultato']
    },
    {
      question: 'Come viene calcolato il rischio del portafoglio?',
      answer: 'Il rischio viene calcolato analizzando la volatilità degli asset, la correlazione tra strumenti e la diversificazione.',
      keywords: ['rischio', 'calcolo', 'volatilità', 'correlazione', 'diversificazione']
    },
    {
      question: 'Posso impostare alert per il portafoglio?',
      answer: 'Sì, puoi impostare alert personalizzati per variazioni di prezzo, performance o soglie di rischio nelle impostazioni.',
      keywords: ['alert', 'notifiche', 'variazioni', 'soglie', 'impostazioni']
    }
  ],
  criptovalute: [
    {
      question: 'Qual è il prezzo attuale del Bitcoin?',
      answer: 'Il prezzo attuale del Bitcoin è di €27.850, aggiornato alle 14:10. I prezzi vengono aggiornati ogni minuto.',
      keywords: ['bitcoin', 'prezzo', 'attuale', 'aggiornato', 'crypto']
    },
    {
      question: 'Posso collegare il mio wallet crypto?',
      answer: 'Sì, puoi collegare wallet compatibili come MetaMask o Ledger nella sezione "Cripto" > "Collega Wallet".',
      keywords: ['collegare', 'wallet', 'metamask', 'ledger', 'compatibili']
    },
    {
      question: 'Come funziona il trading di criptovalute?',
      answer: 'Il trading di criptovalute funziona 24/7. Puoi comprare, vendere e scambiare tramite la piattaforma integrata.',
      keywords: ['trading', '24/7', 'comprare', 'vendere', 'scambiare']
    },
    {
      question: 'Le criptovalute sono sicure?',
      answer: 'Utilizziamo standard di sicurezza bancaria e cold storage per la maggior parte degli asset. La sicurezza è la nostra priorità.',
      keywords: ['sicurezza', 'cold storage', 'standard bancari', 'priorità']
    }
  ],
  documentazione: [
    {
      question: 'Dove trovo i documenti fiscali?',
      answer: 'Vai su "Documenti" > "Fiscali" per scaricare CUD, 730 e altri moduli. I documenti sono disponibili dal 1° marzo.',
      keywords: ['documenti fiscali', 'CUD', '730', 'moduli', 'scarica']
    },
    {
      question: 'Posso ricevere la documentazione via email?',
      answer: 'Sì, attiva l\'opzione "Invio documenti via email" nelle impostazioni del profilo. Riceverai tutto automaticamente.',
      keywords: ['email', 'automatico', 'impostazioni', 'profilo', 'ricevi']
    },
    {
      question: 'Come posso verificare l\'autenticità di un documento?',
      answer: 'Ogni documento ha un codice QR e un numero di riferimento univoco. Puoi verificare l\'autenticità nella sezione "Verifica".',
      keywords: ['autenticità', 'QR', 'riferimento', 'verifica', 'univoco']
    },
    {
      question: 'I documenti sono conservati per quanto tempo?',
      answer: 'I documenti fiscali sono conservati per 10 anni come richiesto dalla legge. Puoi scaricarli in qualsiasi momento.',
      keywords: ['conservazione', '10 anni', 'legge', 'scarica', 'sempre']
    }
  ],
  assistenza_tecnica: [
    {
      question: 'L\'app non si apre, cosa posso fare?',
      answer: 'Prova a riavviare il dispositivo e verificare la connessione internet. Se il problema persiste, contatta l\'assistenza tecnica.',
      keywords: ['app non si apre', 'riavvia', 'internet', 'problema', 'assistenza']
    },
    {
      question: 'Come posso aggiornare l\'app?',
      answer: 'Vai sullo store del tuo dispositivo e cerca "Aggiorna" accanto al nome dell\'app. Gli aggiornamenti sono automatici.',
      keywords: ['aggiornare', 'store', 'automatico', 'versione', 'nuova']
    },
    {
      question: 'L\'app è lenta, come posso migliorare le performance?',
      answer: 'Chiudi le altre app in background, verifica la connessione internet e riavvia l\'app. Se persiste, contatta il supporto.',
      keywords: ['lenta', 'performance', 'background', 'internet', 'riavvia']
    },
    {
      question: 'Come posso cambiare la password?',
      answer: 'Vai su "Impostazioni" > "Sicurezza" > "Cambia Password". Ti verrà inviato un codice di conferma via email.',
      keywords: ['cambia password', 'sicurezza', 'codice', 'email', 'conferma']
    }
  ],
  sicurezza: [
    {
      question: 'Come attivo l\'autenticazione a due fattori?',
      answer: 'Vai su "Impostazioni" > "Sicurezza" e attiva l\'autenticazione 2FA. Puoi usare SMS o app authenticator.',
      keywords: ['2FA', 'due fattori', 'sicurezza', 'SMS', 'authenticator']
    },
    {
      question: 'I miei dati sono protetti?',
      answer: 'Sì, il gestionale utilizza crittografia end-to-end e rispetta il GDPR. I tuoi dati sono sempre al sicuro.',
      keywords: ['protezione', 'crittografia', 'GDPR', 'sicuro', 'dati']
    },
    {
      question: 'Come posso verificare gli accessi al mio account?',
      answer: 'Nella sezione "Sicurezza" > "Accessi" trovi lo storico completo di tutti gli accessi con data, ora e dispositivo.',
      keywords: ['verifica accessi', 'storico', 'data', 'ora', 'dispositivo']
    },
    {
      question: 'Cosa fare se sospetto un accesso non autorizzato?',
      answer: 'Cambia immediatamente la password e contatta l\'assistenza. Ti aiuteremo a verificare e proteggere l\'account.',
      keywords: ['accesso non autorizzato', 'cambia password', 'assistenza', 'protezione', 'account']
    }
  ],
  compliance: [
    {
      question: 'Come funziona la compliance automatica?',
      answer: 'Il nostro sistema AI verifica automaticamente tutte le operazioni rispetto alle normative vigenti, generando report di compliance in tempo reale.',
      keywords: ['compliance automatica', 'AI', 'normative', 'verifica', 'report']
    },
    {
      question: 'Quali normative vengono rispettate?',
      answer: 'Rispettiamo GDPR, MIFID II, PSD2, norme antiriciclaggio e tutte le normative bancarie europee e nazionali.',
      keywords: ['normative', 'GDPR', 'MIFID II', 'PSD2', 'antiriciclaggio']
    },
    {
      question: 'Come vengono gestiti i controlli AML?',
      answer: 'I controlli Anti-Money Laundering sono automatizzati e monitorano transazioni sospette, pattern anomali e soglie di rischio.',
      keywords: ['AML', 'antiriciclaggio', 'controlli', 'transazioni sospette', 'pattern']
    },
    {
      question: 'Posso scaricare i report di compliance?',
      answer: 'Sì, nella sezione "Compliance" puoi generare e scaricare report personalizzati per qualsiasi periodo richiesto.',
      keywords: ['report compliance', 'scarica', 'genera', 'periodo', 'personalizzati']
    }
  ],
  news: [
    {
      question: 'Come funziona l\'analisi del sentiment di mercato?',
      answer: 'La nostra AI analizza migliaia di fonti finanziarie in tempo reale, valutando il sentiment positivo/negativo per ogni asset.',
      keywords: ['sentiment', 'mercato', 'AI', 'fonti', 'analisi']
    },
    {
      question: 'Quali tipi di alert ricevo?',
      answer: 'Ricevi alert per movimenti di mercato significativi, notizie importanti, variazioni di prezzo e opportunità di trading.',
      keywords: ['alert', 'mercato', 'notizie', 'prezzi', 'opportunità']
    },
    {
      question: 'Come vengono filtrate le notizie rilevanti?',
      answer: 'L\'AI filtra automaticamente le notizie per rilevanza finanziaria, eliminando rumore e evidenziando informazioni importanti.',
      keywords: ['filtro', 'notizie', 'rilevanza', 'AI', 'importanti']
    },
    {
      question: 'Posso personalizzare le notifiche news?',
      answer: 'Sì, nelle impostazioni puoi scegliere asset, tipi di notizie e frequenza delle notifiche per personalizzare l\'esperienza.',
      keywords: ['personalizzare', 'notifiche', 'asset', 'tipi', 'frequenza']
    }
  ]
};

// Enhanced FAQ search method
function searchFAQ(message) {
  const lowerMessage = message.toLowerCase();
  
  // Search through all FAQ categories
  for (const [category, faqs] of Object.entries(faqData)) {
    for (const faq of faqs) {
      // Check if any keyword matches
      const keywordMatch = faq.keywords.some(keyword => 
        lowerMessage.includes(keyword.toLowerCase())
      );
      
      // Check if the question is similar
      const questionMatch = faq.question.toLowerCase().includes(lowerMessage) ||
                           lowerMessage.includes(faq.question.toLowerCase());
      
      if (keywordMatch || questionMatch) {
        return {
          category: category,
          question: faq.question,
          answer: faq.answer
        };
      }
    }
  }
  
  return null;
}

// Get category label in Italian
function getCategoryLabel(category) {
  const labels = {
    bilancio: 'Bilancio e Saldi',
    transazioni: 'Transazioni e Operazioni',
    portafoglio: 'Portafoglio e Investimenti',
    criptovalute: 'Criptovalute e Trading',
    documentazione: 'Documenti e Fiscale',
    assistenza_tecnica: 'Assistenza Tecnica',
    sicurezza: 'Sicurezza e Privacy',
    compliance: 'Compliance e Normative',
    news: 'News e Intelligence'
  };
  return labels[category] || category;
}

// Mock data per il chatbot (mantenuto per compatibilità)
const mockIntents = {
  greeting: {
    name: 'greeting',
    responses: [
      'Ciao! Sono FinBot, il tuo assistente finanziario AI avanzato. Posso aiutarti con analisi predittiva, rilevamento frodi, ottimizzazione investimenti, automazione processi, news intelligence e molto altro! Come posso esserti utile oggi?',
      'Buongiorno! Sono FinBot, l\'assistente AI che gestisce analisi predittiva, compliance intelligente, ottimizzazione portfolio e assistenza 24/7. Dimmi pure cosa ti serve!',
      'Salve! Benvenuto nel servizio di assistenza FinBot. Sono specializzato in analisi finanziarie avanzate, rilevamento frodi in tempo reale, ottimizzazione investimenti e automazione intelligente. Come posso aiutarti?'
    ]
  },
  fraud_detection: {
    name: 'fraud_detection',
    responses: [
      '🔒 **Rilevamento Frodi in Tempo Reale** - Il nostro sistema AI monitora 24/7: transazioni sospette, pattern anomali, comportamenti fraudolenti, e fornisce alert immediati per la tua sicurezza.',
      '🛡️ **Protezione Antifrode Avanzata** - Sistema di sicurezza completo con: monitoraggio continuo, AI per behavioral analysis, pattern recognition intelligente, alert istantanei, e dashboard di sicurezza in tempo reale.'
    ]
  },
  predictive_analysis: {
    name: 'predictive_analysis',
    responses: [
      '🔮 **Analisi Predittiva Avanzata** - Ecco le nostre funzionalità di analisi predittiva avanzata: 📊 Analisi flussi di cassa con AI, 🔍 Valutazione rischio credito in tempo reale, 📈 Trend di mercato predittivi, 🎯 Modelli ML per previsioni accurate',
      '🤖 **AI Predittiva** - La nostra AI offre analisi predittiva per: flussi di cassa, rischio credito, trend di mercato, e molto altro. Vuoi approfondire una specifica area?'
    ]
  },
  system_overview: {
    name: 'system_overview',
    responses: [
      '🚀 **Sistema AI Avanzato Completo** - Ecco tutte le funzionalità del nostro sistema AI avanzato:\n\n📊 **Analisi Predittiva Avanzata** - Flussi di cassa, rischio credito, trend mercato\n• 🔒 **Rilevamento Frodi in Tempo Reale** - Monitoraggio transazioni sospette\n• 💼 **Ottimizzazione Investimenti** - Portfolio automatico, simulazioni scenari\n• ⚡ **Automazione Processi** - Approvazione prestiti, report automatici\n• 🤖 **Chatbot Finanziario 24/7** - Assistenza clienti personalizzata\n• 📰 **News Intelligence** - Sentiment analysis e alert mercato\n• ⚖️ **Compliance Intelligente** - Verifica automatica normative\n• 🎯 **Personalizzazione UX** - Dashboard adattive per ogni ruolo'
    ]
  }
};

// Funzione per rilevare l'intent
function detectIntent(message) {
  const lowerMessage = message.toLowerCase();
  
  // First, check if this is a FAQ question
  const faqMatch = searchFAQ(message);
  if (faqMatch) {
    return {
      type: 'faq',
      category: faqMatch.category,
      question: faqMatch.question,
      answer: faqMatch.answer
    };
  }
  
  // Check for specific FAQ category requests
  if (lowerMessage.includes('faq') || lowerMessage.includes('domande frequenti') || lowerMessage.includes('tutte le faq')) {
    return { type: 'show_all_faq' };
  }
  
  if (lowerMessage.includes('bilancio') || lowerMessage.includes('saldi')) {
    return { type: 'bilancio_faq' };
  }
  
  if (lowerMessage.includes('transazioni') || lowerMessage.includes('operazioni')) {
    return { type: 'transazioni_faq' };
  }
  
  if (lowerMessage.includes('portafoglio') || lowerMessage.includes('investimenti')) {
    return { type: 'portafoglio_faq' };
  }
  
  if (lowerMessage.includes('crypto') || lowerMessage.includes('bitcoin') || lowerMessage.includes('criptovalute')) {
    return { type: 'crypto_faq' };
  }
  
  if (lowerMessage.includes('documenti') || lowerMessage.includes('fiscale')) {
    return { type: 'documenti_faq' };
  }
  
  if (lowerMessage.includes('assistenza') || lowerMessage.includes('tecnica')) {
    return { type: 'assistenza_faq' };
  }
  
  if (lowerMessage.includes('sicurezza') || lowerMessage.includes('privacy')) {
    return { type: 'sicurezza_faq' };
  }
  
  if (lowerMessage.includes('compliance') || lowerMessage.includes('normative') || lowerMessage.includes('regolamentazione')) {
    return { type: 'compliance_faq' };
  }
  
  if (lowerMessage.includes('news') || lowerMessage.includes('intelligence') || lowerMessage.includes('sentiment') || lowerMessage.includes('mercato')) {
    return { type: 'news_faq' };
  }
  
  // Fallback to existing intent detection
  if (lowerMessage.includes('ciao') || lowerMessage.includes('buongiorno') || lowerMessage.includes('salve')) {
    return { type: 'intent', value: 'greeting' };
  } else if (lowerMessage.includes('frode') || lowerMessage.includes('sicurezza') || lowerMessage.includes('rilevamento')) {
    return { type: 'intent', value: 'fraud_detection' };
  } else if (lowerMessage.includes('analisi') || lowerMessage.includes('predittiva') || lowerMessage.includes('previsioni')) {
    return { type: 'intent', value: 'predictive_analysis' };
  } else if (lowerMessage.includes('sistema') || lowerMessage.includes('cosa puoi fare') || lowerMessage.includes('funzionalità')) {
    return { type: 'intent', value: 'system_overview' };
  }
  
  return { type: 'intent', value: 'greeting' }; // Default fallback
}

// Funzione per generare risposta
function generateResponse(intent, message) {
  // Handle FAQ responses
  if (intent.type === 'faq') {
    return {
      text: `📋 **FAQ - ${getCategoryLabel(intent.category)}**\n\n**D:** ${intent.question}\n**R:** ${intent.answer}`,
      type: 'text',
      quickReplies: [
        { title: '📋 Tutte le FAQ', payload: 'faq' },
        { title: '💰 Bilancio', payload: 'bilancio' },
        { title: '💳 Transazioni', payload: 'transazioni' },
        { title: '📊 Portafoglio', payload: 'portafoglio' },
        { title: '🚀 Criptovalute', payload: 'criptovalute' },
        { title: '📄 Documenti', payload: 'documenti' },
        { title: '⚡ Assistenza', payload: 'assistenza' },
        { title: '🔒 Sicurezza', payload: 'sicurezza' },
        { title: '⚖️ Compliance', payload: 'compliance' },
        { title: '📰 News', payload: 'news' }
      ]
    };
  }
  
  // Handle FAQ category requests
  if (intent.type === 'show_all_faq') {
    let response = `📋 **Tutte le FAQ Disponibili**\n\n`;
    
    for (const [category, faqs] of Object.entries(faqData)) {
      const categoryLabel = getCategoryLabel(category);
      response += `**${categoryLabel}**\n`;
      
      faqs.forEach((faq, index) => {
        response += `${index + 1}. ${faq.question}\n`;
      });
      
      response += `\n`;
    }
    
    response += `**💡 Come Usare le FAQ:**\n`;
    response += `• Fai una domanda specifica (es: "saldo attuale")\n`;
    response += `• Chiedi di una categoria (es: "bilancio", "transazioni")\n`;
    response += `• Usa parole chiave (es: "bitcoin", "2FA", "PDF")\n\n`;
    response += `**🎯 Esempi di Domande:**\n`;
    response += `• "Qual è il mio saldo attuale?"\n`;
    response += `• "Come esportare il bilancio in PDF?"\n`;
    response += `• "Quanto tempo impiegano i bonifici?"\n`;
    response += `• "Come attivo l'autenticazione a due fattori?"\n`;
    
    return {
      text: response,
      type: 'text',
      quickReplies: [
        { title: '💰 Bilancio', payload: 'bilancio' },
        { title: '💳 Transazioni', payload: 'transazioni' },
        { title: '📊 Portafoglio', payload: 'portafoglio' },
        { title: '🚀 Criptovalute', payload: 'criptovalute' },
        { title: '📄 Documenti', payload: 'documenti' },
        { title: '⚡ Assistenza', payload: 'assistenza' },
        { title: '🔒 Sicurezza', payload: 'sicurezza' },
        { title: '⚖️ Compliance', payload: 'compliance' },
        { title: '📰 News', payload: 'news' }
      ]
    };
  }
  
  if (intent.type && intent.type.endsWith('_faq')) {
    const category = intent.type.replace('_faq', '');
    const faqs = faqData[category];
    
    if (faqs) {
      const categoryLabel = getCategoryLabel(category);
      let response = `📋 **FAQ - ${categoryLabel}**\n\n`;
      
      faqs.forEach((faq, index) => {
        response += `**${index + 1}. ${faq.question}**\n`;
        response += `${faq.answer}\n\n`;
      });
      
      response += `**💡 Suggerimenti:**\n`;
      response += `• Fai domande specifiche per risposte dettagliate\n`;
      response += `• Usa le parole chiave per trovare rapidamente le informazioni\n`;
      
      return {
        text: response,
        type: 'text',
        quickReplies: [
          { title: '📋 Tutte le FAQ', payload: 'faq' },
          { title: '💰 Bilancio', payload: 'bilancio' },
          { title: '💳 Transazioni', payload: 'transazioni' },
          { title: '📊 Portafoglio', payload: 'portafoglio' },
          { title: '🚀 Criptovalute', payload: 'criptovalute' },
          { title: '📄 Documenti', payload: 'documenti' },
          { title: '⚡ Assistenza', payload: 'assistenza' },
          { title: '🔒 Sicurezza', payload: 'sicurezza' },
          { title: '⚖️ Compliance', payload: 'compliance' },
          { title: '📰 News', payload: 'news' }
        ]
      };
    }
  }
  
  // Handle regular intents
  if (intent.type === 'intent') {
    const intentData = mockIntents[intent.value] || mockIntents.greeting;
    const responses = intentData.responses;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      text: randomResponse,
      type: 'text',
      quickReplies: [
        { title: '📊 Analisi Predittiva', payload: 'analisi predittiva' },
        { title: '🔒 Rilevamento Frodi', payload: 'rilevamento frodi' },
        { title: '💼 Ottimizzazione Investimenti', payload: 'ottimizzazione investimenti' },
        { title: '⚡ Automazione Processi', payload: 'automazione' },
        { title: '📰 News Intelligence', payload: 'news' },
        { title: '⚖️ Compliance', payload: 'compliance' },
        { title: '🎯 Personalizzazione UX', payload: 'personalizzazione' },
        { title: '🚀 Panoramica Sistema', payload: 'sistema' },
        { title: '📋 FAQ', payload: 'faq' }
      ]
    };
  }
  
  // Default fallback
  return {
    text: 'Grazie per la tua domanda! 🤔\n\nPer aiutarti al meglio, posso fornirti informazioni su:\n\n**💰 Bilancio e Saldi**\n• Saldo conto, esportazione PDF, aggiornamenti\n• Esempio: "Qual è il mio saldo attuale?"\n\n**💳 Transazioni e Operazioni**\n• Storico transazioni, bonifici, tempi di elaborazione\n• Esempio: "Come vedere le transazioni degli ultimi 30 giorni?"\n\n**📊 Portafoglio e Investimenti**\n• Gestione asset, performance, rischio, alert\n• Esempio: "Qual è la performance del mio portafoglio?"\n\n**🚀 Criptovalute e Trading**\n• Prezzi Bitcoin, wallet, sicurezza, trading 24/7\n• Esempio: "Qual è il prezzo attuale del Bitcoin?"\n\n**📄 Documenti e Fiscale**\n• CUD, 730, PDF, email, autenticità\n• Esempio: "Dove trovo i documenti fiscali?"\n\n**🔒 Sicurezza e Privacy**\n• 2FA, password, protezione dati, monitoraggio accessi\n• Esempio: "Come attivo l\'autenticazione a due fattori?"\n\n**⚡ Assistenza Tecnica**\n• Problemi app, aggiornamenti, performance, password\n• Esempio: "L\'app non si apre, cosa posso fare?"\n\n**⚖️ Compliance e Normative**\n• Verifica automatica normative, controlli AML, report compliance\n• Esempio: "Come funziona la compliance automatica?"\n\n**📰 News e Intelligence**\n• Analisi sentiment mercato, alert notizie, filtri personalizzati\n• Esempio: "Come funziona l\'analisi del sentiment di mercato?"\n\nProva a chiedere di uno di questi argomenti o chiedi "sistema" per una panoramica completa!',
    type: 'text',
    quickReplies: [
      { title: '📋 FAQ', payload: 'faq' },
      { title: '💰 Bilancio', payload: 'bilancio' },
      { title: '💳 Transazioni', payload: 'transazioni' },
      { title: '📊 Portafoglio', payload: 'portafoglio' },
      { title: '🚀 Criptovalute', payload: 'criptovalute' },
      { title: '📄 Documenti', payload: 'documenti' },
      { title: '⚡ Assistenza', payload: 'assistenza' },
      { title: '🔒 Sicurezza', payload: 'sicurezza' },
      { title: '⚖️ Compliance', payload: 'compliance' },
      { title: '📰 News', payload: 'news' }
    ]
  };
}

// POST /ai/chatbot/message - Processa messaggio del chatbot
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Messaggio richiesto'
      });
    }
    
    console.log(`🤖 [Backend] Processing message: "${message}" for session: ${sessionId}`);
    
    // Rileva intent
    const intent = detectIntent(message);
    console.log(`🎯 [Backend] Intent detected: ${intent}`);
    
    // Genera risposta
    const response = generateResponse(intent, message);
    console.log(`💬 [Backend] Response generated: ${response.text.substring(0, 50)}...`);
    
    // Crea messaggio di risposta
    const chatMessage = {
      id: `msg_${Date.now()}`,
      sessionId: sessionId || 'default_session',
      message: response.text,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: response.type,
      metadata: {
        intent: intent,
        confidence: 0.9,
        quickReplies: response.quickReplies
      }
    };
    console.log(`✅ [Backend] Chat message created with ID: ${chatMessage.id}`);
    
    res.json({
      success: true,
      data: chatMessage
    });
    
  } catch (error) {
    console.error('❌ [Backend] Error processing chatbot message:', error);
    res.status(500).json({
      success: false,
      error: 'Errore interno del server durante il processamento del messaggio'
    });
  }
});

// POST /ai/chatbot/sessions - Crea nuova sessione
router.post('/sessions', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const session = {
      id: `session_${Date.now()}`,
      userId: userId || 'anonymous',
      startTime: new Date().toISOString(),
      status: 'active',
      context: {
        currentTopic: 'general',
        previousIntents: [],
        variables: {}
      }
    };
    
    console.log(`📋 [Backend] New session created: ${session.id} for user: ${session.userId}`);
    
    res.json({
      success: true,
      data: session
    });
    
  } catch (error) {
    console.error('❌ [Backend] Error creating session:', error);
    res.status(500).json({
      success: false,
      error: 'Errore interno del server durante la creazione della sessione'
    });
  }
});

// PUT /ai/chatbot/sessions/:id/context - Aggiorna contesto sessione
router.put('/sessions/:id/context', async (req, res) => {
  try {
    const { id } = req.params;
    const { context } = req.body;
    
    console.log(`🔄 [Backend] Updating context for session: ${id}`);
    
    res.json({
      success: true,
      message: 'Contesto sessione aggiornato con successo'
    });
    
  } catch (error) {
    console.error('❌ [Backend] Error updating session context:', error);
    res.status(500).json({
      success: false,
      error: 'Errore interno del server durante l\'aggiornamento del contesto'
    });
  }
});

// PUT /ai/chatbot/sessions/:id/end - Chiude sessione
router.put('/sessions/:id/end', async (req, res) => {
  try {
    const { id } = req.params;
    const { endTime, status, satisfaction } = req.body;
    
    console.log(`🔚 [Backend] Ending session: ${id} with status: ${status}`);
    
    res.json({
      success: true,
      message: 'Sessione chiusa con successo'
    });
    
  } catch (error) {
    console.error('❌ [Backend] Error ending session:', error);
    res.status(500).json({
      success: false,
      error: 'Errore interno del server durante la chiusura della sessione'
    });
  }
});

module.exports = router;
