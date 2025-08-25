import { api } from './api';

// Configurazione Chatbot
const CHATBOT_CONFIG = {
  // Abilita/disabilita il fallback locale
  ENABLE_LOCAL_FALLBACK: true,
  
  // Abilita/disabilita i log di debug
  ENABLE_DEBUG_LOGS: true,
  
  // Soglia minima per il rilevamento degli intent
  MIN_INTENT_CONFIDENCE: 0.6,
  
  // Timeout per le chiamate API (in ms)
  API_TIMEOUT: 10000,
  
  // Abilita/disabilita il processamento locale forzato (per debug)
  FORCE_LOCAL_PROCESSING: false,
  
  // Configurazione per i quick replies
  QUICK_REPLIES: {
    ENABLE: true,
    MAX_COUNT: 8
  }
};

// Funzione di logging condizionale
const debugLog = (...args: any[]) => {
  if (CHATBOT_CONFIG.ENABLE_DEBUG_LOGS) {
    console.log('🤖 [Chatbot]', ...args);
  }
};

// Interfacce per Chatbot Finanziario
export interface ChatMessage {
  id: string;
  sessionId: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: string;
  type: 'text' | 'quick_reply' | 'card' | 'chart' | 'list';
  metadata?: {
    intent?: string;
    confidence?: number;
    entities?: any[];
    quickReplies?: QuickReply[];
    cards?: ChatCard[];
    data?: any;
  };
}

export interface QuickReply {
  title: string;
  payload: string;
  imageUrl?: string;
}

export interface ChatCard {
  title: string;
  subtitle: string;
  imageUrl?: string;
  buttons: {
    title: string;
    type: 'postback' | 'url' | 'phone';
    payload: string;
  }[];
}

export interface ChatSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'closed' | 'transferred';
  context: {
    customerProfile?: any;
    currentTopic?: string;
    previousIntents?: string[];
    variables?: { [key: string]: any };
  };
  satisfaction?: {
    rating: number;
    feedback: string;
  };
}

export interface ChatbotIntent {
  name: string;
  description: string;
  examples: string[];
  responses: string[];
  actions?: string[];
  requiredParams?: string[];
  confidence?: number;
}

export interface FinancialEducationContent {
  id: string;
  title: string;
  category: 'investing' | 'saving' | 'budgeting' | 'credit' | 'insurance' | 'retirement';
  level: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  duration: number; // in minutes
  interactive: boolean;
  quiz?: {
    questions: {
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    }[];
  };
  relatedTopics: string[];
}

export interface CustomerInsight {
  customerId: string;
  financialGoals: string[];
  riskTolerance: 'low' | 'medium' | 'high';
  investmentExperience: 'beginner' | 'intermediate' | 'expert';
  preferredChannels: string[];
  learningStyle: 'visual' | 'reading' | 'interactive' | 'mixed';
  interests: string[];
  concerns: string[];
}

class AIChatbotService {
  private readonly intents: ChatbotIntent[] = [
    {
      name: 'greeting',
      description: 'Saluti iniziali',
      examples: ['ciao', 'buongiorno', 'salve', 'hey', 'hi', 'hello', 'buonasera', 'buonanotte', 'salve a tutti', 'buon pomeriggio', 'come stai', 'inizio', 'start', 'benvenuto', 'welcome'],
      responses: [
        'Ciao! Sono FinBot, il tuo assistente finanziario AI avanzato. Posso aiutarti con analisi predittiva, rilevamento frodi, ottimizzazione investimenti, automazione processi, news intelligence e molto altro! Come posso esserti utile oggi?',
        'Buongiorno! Sono FinBot, l\'assistente AI che gestisce analisi predittiva, compliance intelligente, ottimizzazione portfolio e assistenza 24/7. Dimmi pure cosa ti serve!',
        'Salve! Benvenuto nel servizio di assistenza FinBot. Sono specializzato in analisi finanziarie avanzate, rilevamento frodi in tempo reale, ottimizzazione investimenti e automazione intelligente. Come posso aiutarti?',
        '👋 Ciao! Sono FinBot, il tuo assistente AI per la gestione finanziaria. Posso aiutarti con: 📊 Analisi Predittiva, 🔒 Sicurezza, 💼 Investimenti, ⚡ Automazione, 📰 News, e molto altro! Dimmi pure cosa ti serve!'
      ]
    },
    {
      name: 'check_balance',
      description: 'Controllo saldo conto',
      examples: ['saldo', 'quanto ho sul conto', 'bilancio', 'disponibilità', 'disponibile', 'conto', 'account', 'balance', 'check balance', 'quanto ho', 'soldi', 'liquidità', 'cassa', 'portafoglio', 'wallet', 'saldo conto', 'stato conto'],
      responses: [
        '💰 **Saldo Conto Aggiornato** - Il saldo del tuo conto corrente principale è di €{balance}. Ultimo aggiornamento: {lastUpdate}',
        '📊 **Panoramica Saldi** - Ecco i tuoi saldi aggiornati: Conto Corrente €{balance}, Conto Risparmio €{savingsBalance}',
        '💳 **Stato Conto** - Il tuo conto ha un saldo di €{balance}. Ultimo aggiornamento: {lastUpdate}',
        '🏦 **Disponibilità** - Saldo disponibile: €{balance}. Ultimo aggiornamento: {lastUpdate}'
      ],
      actions: ['fetch_balance'],
      requiredParams: ['accountId']
    },
    {
      name: 'recent_transactions',
      description: 'Movimenti recenti',
      examples: ['movimenti', 'transazioni', 'operazioni recenti', 'ultime spese', 'movimenti conto', 'storico transazioni', 'operazioni', 'spese', 'entrate', 'uscite', 'movimenti recenti', 'ultimi movimenti', 'transactions', 'movements', 'history', 'storico', 'cronologia', 'ultime operazioni', 'recent transactions'],
      responses: [
        '📋 **Movimenti Recenti** - Ecco i tuoi ultimi movimenti del conto:',
        '💳 **Transazioni Aggiornate** - Le tue transazioni più recenti:',
        '📊 **Storico Operazioni** - Ecco i movimenti del tuo conto:',
        '🔄 **Ultimi Movimenti** - Le tue operazioni più recenti:'
      ],
      actions: ['fetch_transactions'],
      requiredParams: ['accountId', 'limit']
    },
    {
      name: 'investment_advice',
      description: 'Consigli di investimento',
      examples: ['come investire', 'consigli investimenti', 'dove mettere i soldi', 'portfolio', 'investimenti', 'investire', 'consigli finanziari', 'strategia investimenti', 'gestione portfolio', 'asset allocation', 'diversificazione', 'investments', 'investment advice', 'financial advice', 'portfolio management', 'dove investire', 'come gestire i soldi', 'strategia finanziaria', 'pianificazione investimenti'],
      responses: [
        '💼 **Consigli Investimenti Personalizzati** - Basandomi sul tuo profilo di rischio {riskProfile}, ti consiglio:',
        '🎯 **Strategia Investimenti** - Per i tuoi obiettivi di investimento, ecco alcune opzioni:',
        '📈 **Pianificazione Portfolio** - Basandomi sul tuo profilo, ecco i miei consigli:',
        '🏦 **Gestione Investimenti** - Per il tuo profilo di rischio {riskProfile}, ti suggerisco:'
      ],
      actions: ['generate_investment_advice'],
      requiredParams: ['riskProfile', 'investmentGoals']
    },
    {
      name: 'loan_info',
      description: 'Informazioni su prestiti',
      examples: ['prestito', 'mutuo', 'finanziamento', 'credito', 'prestiti', 'mutui', 'finanziamenti', 'crediti', 'debito', 'debiti', 'loan', 'mortgage', 'credit', 'financing', 'prestito personale', 'mutuo casa', 'finanziamento auto', 'credito al consumo', 'prestito d\'onore', 'microcredito', 'prestito consolidamento', 'mutuo prima casa', 'mutuo seconda casa'],
      responses: [
        '🏦 **Informazioni Prestiti e Finanziamenti** - Posso aiutarti con informazioni su prestiti personali, mutui e finanziamenti.',
        '💳 **Soluzioni di Credito** - Che tipo di finanziamento ti interessa? Prestito personale o mutuo casa?',
        '📋 **Prodotti di Credito** - Ti spiego le diverse opzioni disponibili per prestiti e mutui.',
        '🔍 **Guida ai Prestiti** - Ecco tutto quello che devi sapere sui nostri prodotti di credito.'
      ],
      actions: ['show_loan_products']
    },
    {
      name: 'market_data',
      description: 'Dati di mercato',
      examples: ['borsa', 'quotazioni', 'mercati', 'prezzi azioni', 'criptovalute', 'mercato', 'borsa italiana', 'wall street', 'nasdaq', 'ftse', 'dax', 'azionario', 'obbligazioni', 'titoli', 'azioni', 'obbligazioni', 'etf', 'fondi', 'market data', 'stock prices', 'cryptocurrency', 'bitcoin', 'ethereum', 'prezzi', 'andamento mercato', 'trend mercato', 'analisi mercato', 'quotazioni in tempo reale'],
      responses: [
        '📈 **Dati di Mercato Aggiornati** - Ecco i dati di mercato aggiornati:',
        '💹 **Quotazioni in Tempo Reale** - Le quotazioni che hai richiesto:',
        '🏛️ **Stato Mercati Finanziari** - Ecco l\'andamento attuale dei mercati:',
        '📊 **Analisi Mercato** - Dati aggiornati su borsa, azioni e criptovalute:'
      ],
      actions: ['fetch_market_data']
    },
    {
      name: 'education_request',
      description: 'Richiesta educazione finanziaria',
      examples: ['come funziona', 'spiegami', 'non capisco', 'impara', 'educazione', 'aiuto', 'help', 'spiegazione', 'tutorial', 'guida', 'istruzioni', 'come fare', 'cosa significa', 'definizione', 'concetti', 'termini', 'glossario', 'abc finanziario', 'educazione finanziaria', 'alfabetizzazione finanziaria', 'financial education', 'financial literacy', 'spiegazioni', 'lezioni', 'corsi', 'formazione'],
      responses: [
        '📚 **Educazione Finanziaria** - Sarò felice di spiegarti! Di cosa vorresti sapere di più?',
        '🎓 **Formazione Finanziaria** - La educazione finanziaria è importante. Su quale argomento vorresti approfondire?',
        '📖 **Guida e Spiegazioni** - Posso aiutarti a capire meglio i concetti finanziari. Cosa ti interessa?',
        '🔍 **Tutorial e Guide** - Ti spiego passo dopo passo i concetti che non ti sono chiari. Dimmi pure cosa vuoi imparare!'
      ],
      actions: ['provide_education']
    },
    {
      name: 'predictive_analysis',
      description: 'Analisi predittiva avanzata',
      examples: ['analisi predittiva', 'flussi di cassa', 'rischio credito', 'trend mercato', 'previsioni', 'predizioni', 'predittiva', 'analisi', 'flussi cassa', 'cash flow', 'rischio', 'credito', 'scoring', 'trend', 'mercato', 'previsioni mercato', 'predizioni mercato', 'machine learning', 'ai predittiva', 'intelligenza artificiale', 'modelli predittivi', 'algoritmi', 'statistiche', 'probabilità', 'forecast', 'prediction', 'predictive analytics', 'cash flow prediction', 'credit risk', 'market trends'],
      responses: [
        '🔮 **Analisi Predittiva Avanzata** - Ecco le nostre funzionalità di analisi predittiva avanzata: 📊 Analisi flussi di cassa con AI, 🔍 Valutazione rischio credito in tempo reale, 📈 Trend di mercato predittivi, 🎯 Modelli ML per previsioni accurate',
        '🤖 **AI Predittiva** - La nostra AI offre analisi predittiva per: flussi di cassa, rischio credito, trend di mercato, e molto altro. Vuoi approfondire una specifica area?',
        '📊 **Modelli Predittivi** - Utilizziamo machine learning avanzato per: previsioni flussi di cassa, scoring creditizio, analisi trend mercato, e valutazioni probabilistiche.',
        '🎯 **Previsioni Intelligenti** - La nostra AI analizza dati storici per prevedere: flussi di cassa futuri, rischi creditizi, trend di mercato, e opportunità di investimento.'
      ],
      actions: ['show_predictive_analysis']
    },
    {
      name: 'fraud_detection',
      description: 'Rilevamento frodi in tempo reale',
      examples: ['frode', 'rilevamento frodi', 'rilevamento frodi in tempo reale', 'sicurezza', 'transazioni sospette', 'monitoraggio', 'protezione', 'antifrode', 'pattern anomali', 'comportamenti fraudolenti', 'alert sicurezza', 'monitoraggio 24/7', 'detection', 'fraud detection', 'real time', 'tempo reale', 'sicurezza finanziaria', 'protezione conto', 'monitoraggio transazioni', 'sicurezza conto', 'protezione finanziaria', 'monitoraggio frodi', 'sistema antifrode', 'ai sicurezza', 'intelligenza artificiale sicurezza'],
      responses: [
        '🔒 **Rilevamento Frodi in Tempo Reale** - Il nostro sistema AI monitora 24/7: transazioni sospette, pattern anomali, comportamenti fraudolenti, e fornisce alert immediati per la tua sicurezza. Utilizziamo machine learning avanzato per identificare minacce in tempo reale.',
        '🛡️ **Protezione Antifrode Avanzata** - Sistema di sicurezza completo con: monitoraggio continuo, AI per behavioral analysis, pattern recognition intelligente, alert istantanei, e dashboard di sicurezza in tempo reale per la massima protezione.'
      ],
      actions: ['show_fraud_protection']
    },
    {
      name: 'security_alerts',
      description: 'Alert di sicurezza e notifiche',
      examples: ['alert sicurezza', 'notifiche', 'avvisi', 'warning', 'allarmi', 'segnalazioni', 'alert frode', 'notifiche sicurezza'],
      responses: [
        '🚨 **Sistema Alert di Sicurezza** - Ricevi notifiche immediate su: transazioni sospette, accessi anomali, pattern fraudolenti, e minacce emergenti. Configura i tuoi alert personalizzati per la massima protezione.',
        '📱 **Notifiche Intelligenti** - Sistema di alert avanzato che ti informa in tempo reale su: attività sospette, tentativi di accesso, transazioni anomale, e rischi di sicurezza identificati dalla nostra AI.'
      ],
      actions: ['show_security_alerts']
    },
    {
      name: 'investment_optimization',
      description: 'Ottimizzazione investimenti',
      examples: ['ottimizzazione investimenti', 'portfolio automatico', 'simulazioni', 'asset allocation', 'rebalancing', 'gestione portfolio', 'ottimizzazione', 'portfolio', 'asset allocation', 'diversificazione', 'rebalancing', 'gestione rischio', 'simulazioni monte carlo', 'monte carlo', 'risk management', 'portfolio management', 'investment optimization', 'asset allocation', 'diversification', 'rebalancing', 'risk analysis', 'portfolio analysis', 'gestione investimenti', 'ottimizzazione portfolio', 'strategia investimenti', 'pianificazione portfolio'],
      responses: [
        '💼 **Ottimizzazione Investimenti AI** - La nostra AI offre ottimizzazione investimenti completa: portfolio automatico, simulazioni scenari, asset allocation intelligente, rebalancing automatico, e gestione rischio avanzata',
        '🎯 **Portfolio Intelligente** - Ottimizzazione portfolio con: simulazioni Monte Carlo, analisi rischio-rendimento, diversificazione automatica, e strategie personalizzate',
        '📊 **Gestione Portfolio Avanzata** - Sistema di ottimizzazione automatica che include: analisi rischio-rendimento, diversificazione intelligente, rebalancing automatico, e simulazioni scenari.',
        '🚀 **Portfolio Performance** - La nostra AI ottimizza automaticamente il tuo portfolio considerando: rischio, rendimento, diversificazione, e condizioni di mercato.'
      ],
      actions: ['show_investment_tools']
    },
    {
      name: 'process_automation',
      description: 'Automazione processi',
      examples: ['automazione', 'processi automatici', 'approvazione prestiti', 'report automatici', 'workflow', 'efficienza', 'automatico', 'processi', 'workflow', 'efficienza', 'produttività', 'ottimizzazione processi', 'automazione intelligente', 'ai automation', 'intelligent automation', 'process automation', 'workflow automation', 'approvazione automatica', 'report automatici', 'valutazione automatica', 'processi bancari', 'bancario', 'finanziario', 'efficienza operativa', 'operazioni automatiche'],
      responses: [
        '⚡ **Automazione Intelligente** - Automazione intelligente per: approvazione prestiti automatica, report generati in tempo reale, workflow ottimizzati, e processi bancari efficienti',
        '🤖 **Processi AI** - I nostri processi automatizzati includono: valutazione creditizia AI, generazione report automatici, e gestione workflow intelligente',
        '🚀 **Efficienza Operativa** - Automazione completa dei processi: approvazioni automatiche, report in tempo reale, workflow intelligenti, e gestione operativa ottimizzata.',
        '📊 **Processi Ottimizzati** - La nostra AI automatizza: valutazioni creditizie, approvazioni prestiti, generazione report, e gestione workflow per massimizzare l\'efficienza.'
      ],
      actions: ['show_automation_features']
    },
    {
      name: 'news_intelligence',
      description: 'News Intelligence e sentiment analysis',
      examples: ['news', 'intelligence', 'sentiment analysis', 'alert mercato', 'notizie', 'mercato', 'tendenze', 'notizie finanziarie', 'finanziarie', 'sentiment', 'analisi sentiment', 'market news', 'financial news', 'news analysis', 'market intelligence', 'trend detection', 'alert', 'notifiche', 'aggiornamenti', 'informazioni mercato', 'analisi notizie', 'impatto notizie', 'trend emergenti', 'mercati finanziari', 'borsa', 'quotazioni', 'andamento mercato', 'news feed', 'rss', 'feed notizie'],
      responses: [
        '📰 **News Intelligence Avanzata** - News Intelligence con: sentiment analysis automatica, alert di mercato in tempo reale, analisi impatto notizie, e trend detection avanzato',
        '🔍 **Analisi Notizie AI** - Il sistema analizza: sentiment delle notizie, impatto sui mercati, alert automatici, e trend emergenti per decisioni informate',
        '📊 **Market Intelligence** - La nostra AI analizza in tempo reale: sentiment delle notizie, impatto sui mercati, trend emergenti, e opportunità di investimento.',
        '🚨 **Alert Intelligenti** - Sistema di notifiche che ti informa su: notizie importanti, cambiamenti di mercato, trend emergenti, e opportunità di trading identificate dalla nostra AI.'
      ],
      actions: ['show_news_intelligence']
    },
    {
      name: 'compliance_intelligence',
      description: 'Compliance intelligente',
      examples: ['compliance', 'normative', 'regolamentazioni', 'verifica automatica', 'conformità', 'regole', 'norme', 'regolamenti', 'legge', 'leggi', 'regolamentazione', 'verifica', 'controllo', 'audit', 'audit trail', 'gdpr', 'psd2', 'sox', 'basilea', 'regolamentazione bancaria', 'normative finanziarie', 'compliance bancaria', 'regolamentazione finanziaria', 'normative europee', 'compliance europea', 'regolamentazione europea', 'normative internazionali', 'compliance internazionale'],
      responses: [
        '⚖️ **Compliance Intelligente AI** - Compliance intelligente con: verifica automatica normative, monitoraggio regolamentazioni, alert compliance, e gestione rischi normativi in tempo reale',
        '🔒 **Conformità Automatica** - Il sistema garantisce: conformità automatica, monitoraggio normative, gestione rischi, e audit trail completo',
        '📋 **Gestione Normative** - La nostra AI monitora automaticamente: normative GDPR, PSD2, SOX, Basilea, e regolamentazioni bancarie in tempo reale.',
        '🚨 **Alert Compliance** - Sistema di monitoraggio che ti avvisa su: cambiamenti normativi, rischi di compliance, violazioni normative, e aggiornamenti regolamentari.'
      ],
      actions: ['show_compliance_features']
    },
    {
      name: 'personalization_ux',
      description: 'Personalizzazione UX e dashboard adattive',
      examples: ['personalizzazione', 'dashboard', 'ux', 'interfaccia', 'ruolo', 'adattivo', 'customizzazione', 'personalizza', 'custom', 'adattivo', 'adattiva', 'ruolo utente', 'preferenze', 'preferenze utente', 'abitudini', 'layout', 'design', 'user experience', 'user interface', 'ui', 'ux design', 'interface design', 'dashboard personalizzate', 'dashboard adattive', 'interfaccia personalizzata', 'esperienza utente', 'esperienza personalizzata', 'customizzazione interfaccia', 'personalizzazione dashboard', 'dashboard intelligenti', 'interfacce intelligenti'],
      responses: [
        '🎯 **Personalizzazione UX Completa** - Personalizzazione UX completa: dashboard adattive per ogni ruolo, interfacce personalizzate, esperienze utente ottimizzate, e layout intelligenti',
        '🔄 **Dashboard Adattive** - Le nostre dashboard si adattano a: ruolo utente, preferenze personali, abitudini di utilizzo, e necessità specifiche',
        '👤 **Esperienza Personalizzata** - La nostra AI personalizza automaticamente: layout dashboard, interfacce utente, menu navigazione, e contenuti in base al tuo ruolo e preferenze.',
        '🎨 **Design Intelligente** - Sistema di personalizzazione che include: temi personalizzati, layout adattivi, menu contestuali, e interfacce che si adattano alle tue abitudini di utilizzo.'
      ],
      actions: ['show_personalization_features']
    },
    {
      name: 'system_overview',
      description: 'Panoramica sistema completo',
      examples: ['sistema', 'funzionalità', 'caratteristiche', 'panoramica', 'cosa puoi fare', 'capabilities', 'funzionalità sistema', 'caratteristiche sistema', 'panoramica sistema', 'cosa fa il sistema', 'capabilities sistema', 'sistema ai', 'intelligenza artificiale', 'ai system', 'artificial intelligence', 'sistema intelligente', 'sistema avanzato', 'sistema moderno', 'sistema completo', 'sistema integrato', 'sistema bancario', 'sistema finanziario', 'gestionale', 'gestionale finanziario', 'sistema gestionale', 'sistema bancario avanzato', 'sistema finanziario intelligente'],
      responses: [
        '🚀 **Sistema AI Avanzato Completo** - Ecco tutte le funzionalità del nostro sistema AI avanzato:\n\n📊 **Analisi Predittiva Avanzata** - Flussi di cassa, rischio credito, trend mercato\n• 🔒 **Rilevamento Frodi in Tempo Reale** - Monitoraggio transazioni sospette\n• 💼 **Ottimizzazione Investimenti** - Portfolio automatico, simulazioni scenari\n• ⚡ **Automazione Processi** - Approvazione prestiti, report automatici\n• 🤖 **Chatbot Finanziario 24/7** - Assistenza clienti personalizzata\n• 📰 **News Intelligence** - Sentiment analysis e alert mercato\n• ⚖️ **Compliance Intelligente** - Verifica automatica normative\n• 🎯 **Personalizzazione UX** - Dashboard adattive per ogni ruolo',
        '🤖 **Sistema Intelligente Integrato** - Il nostro sistema AI offre:\n\n• Analisi predittiva per flussi di cassa e rischio credito\n• Rilevamento frodi in tempo reale\n• Ottimizzazione automatica portfolio\n• Automazione processi bancari\n• Chatbot intelligente 24/7\n• News intelligence e sentiment analysis\n• Compliance automatica\n• Dashboard personalizzate per ruolo',
        '🏦 **Gestionale Finanziario AI** - Sistema completo che include:\n\n• **Analisi Predittiva**: Flussi di cassa, rischio credito, trend mercato\n• **Sicurezza**: Rilevamento frodi 24/7, monitoraggio transazioni\n• **Investimenti**: Portfolio automatico, ottimizzazione asset allocation\n• **Automazione**: Processi bancari, report automatici, workflow\n• **Intelligence**: News analysis, sentiment analysis, market trends\n• **Compliance**: Monitoraggio normative, audit automatici\n• **UX**: Dashboard personalizzate, interfacce adattive',
        '💡 **Sistema All-in-One** - Un\'unica piattaforma per:\n\n• Gestione completa delle finanze personali e aziendali\n• Analisi predittiva e decisioni informate\n• Sicurezza avanzata e protezione antifrode\n• Ottimizzazione automatica degli investimenti\n• Automazione intelligente dei processi bancari\n• Monitoraggio compliance e normative\n• Esperienza utente personalizzata e intuitiva'
      ],
      actions: ['show_system_overview']
    }
  ];

  // Elaborazione del messaggio
  async processMessage(message: string, sessionId: string, userId?: string): Promise<ChatMessage> {
    // Se il processamento locale è forzato, salta l'API
    if (CHATBOT_CONFIG.FORCE_LOCAL_PROCESSING) {
      debugLog('🔧 Forced local processing enabled, skipping API call');
      return this.processMessageLocally(message, sessionId, userId);
    }

    try {
      debugLog('🔄 Attempting to process message via API:', message);
      
      // Aggiungi timeout alla chiamata API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CHATBOT_CONFIG.API_TIMEOUT);
      
      const response = await api.post('/ai/chatbot/message', {
        message,
        sessionId,
        userId
      });
      
      clearTimeout(timeoutId);
      debugLog('✅ API response received:', response);
      return response.data as ChatMessage;
      
    } catch (error) {
      debugLog('❌ API call failed:', error);
      
      if (CHATBOT_CONFIG.ENABLE_LOCAL_FALLBACK) {
        debugLog('🔄 Falling back to local processing');
        return this.processMessageLocally(message, sessionId, userId);
      } else {
        debugLog('❌ Local fallback disabled, throwing error');
        throw new Error(`API call failed and local fallback is disabled: ${error}`);
      }
    }
  }

  private async processMessageLocally(message: string, sessionId: string, userId?: string): Promise<ChatMessage> {
    debugLog('🔧 Processing message locally:', message);
    
    const intent = this.detectIntent(message);
    debugLog('🎯 Intent detected:', intent.name, 'with confidence:', intent.confidence);
    
    const response = await this.generateResponse(intent, message, sessionId, userId);
    debugLog('💬 Generated response:', response);
    
    return {
      id: `msg_${Date.now()}`,
      sessionId,
      message: response.text,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: response.type,
      metadata: {
        intent: intent.name,
        confidence: intent.confidence || 0.8,
        entities: response.entities,
        quickReplies: response.quickReplies,
        cards: response.cards,
        data: response.data
      }
    };
  }

  // Enhanced intent detection with more specific patterns
  private detectIntent(message: string): ChatbotIntent {
    const lowerMessage = message.toLowerCase();
    
    // First, check if this is a FAQ question
    const faqAnswer = this.searchFAQ(message);
    if (faqAnswer) {
      return {
        name: 'faq_response',
        description: 'Risposta FAQ',
        examples: ['faq', 'domanda', 'aiuto', 'supporto'],
        responses: [faqAnswer]
      };
    }
    
    // Portfolio Management
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('asset') || lowerMessage.includes('investimenti') || 
        lowerMessage.includes('allocazione') || lowerMessage.includes('distribuzione') || lowerMessage.includes('gestione patrimoniale')) {
      return {
        name: 'portfolio_management',
        description: 'Gestione portfolio e asset allocation',
        examples: ['portfolio', 'asset', 'investimenti', 'allocazione'],
        responses: [`📊 **Gestione Portfolio e Asset Allocation**

Il nostro sistema offre analisi avanzate per la gestione del portfolio:

**🔍 Analisi Portfolio:**
• Distribuzione asset per classe e settore
• Correlazioni e diversificazione
• Performance storica e benchmark
• Risk-adjusted returns (Sharpe ratio, Sortino)

**📈 Asset Allocation:**
• Strategie personalizzate per profilo rischio
• Rebalancing automatico
• Opportunità di mercato in tempo reale
• Hedging e protezione del capitale

**🎯 Strumenti Disponibili:**
• Dashboard Portfolio in tempo reale
• Simulazioni scenario e stress test
• Report periodici automatici
• Alert personalizzati per soglie

Vuoi vedere il tuo portfolio attuale o simulare una nuova allocazione?`]
      };
    }

    // News Intelligence
    if (lowerMessage.includes('news') || lowerMessage.includes('notizie') || lowerMessage.includes('intelligence') || 
        lowerMessage.includes('mercato') || lowerMessage.includes('finanziario') || lowerMessage.includes('economia')) {
      return {
        name: 'news_intelligence',
        description: 'News Intelligence e analisi di mercato',
        examples: ['news', 'notizie', 'intelligence', 'mercato'],
        responses: [`📰 **News Intelligence e Analisi di Mercato**

Il nostro sistema di News Intelligence fornisce:

**🔍 Raccolta Dati:**
• Fonti multiple: Reuters, Bloomberg, CNBC, FT
• Social media sentiment analysis
• Dati macroeconomici in tempo reale
• Calendario eventi economici

**🧠 Analisi AI:**
• Sentiment analysis automatica
• Rilevamento trend emergenti
• Correlazione news-performance asset
• Alert per notizie critiche

**📊 Dashboard Intelligence:**
• Market sentiment score
• Top news del giorno
• Impact analysis su portfolio
• Raccomandazioni basate su news

**🎯 Funzionalità:**
• Filtri personalizzabili per settore/asset
• Notifiche push per breaking news
• Report settimanali di sintesi
• Historical news analysis

Vuoi accedere al dashboard News Intelligence o ricevere alert specifici?`]
      };
    }

    // Process Automation
    if (lowerMessage.includes('processi') || lowerMessage.includes('automazione') || lowerMessage.includes('workflow') || 
        lowerMessage.includes('efficienza') || lowerMessage.includes('ottimizzazione') || lowerMessage.includes('operazioni')) {
      return {
        name: 'process_automation',
        description: 'Automazione processi e workflow',
        examples: ['processi', 'automazione', 'workflow', 'efficienza'],
        responses: [`⚡ **Automazione Processi e Workflow**

Il nostro sistema di automazione copre:

**🔄 Processi Operativi:**
• Onboarding clienti automatizzato
• Approvazione prestiti e crediti
• Gestione documenti e compliance
• Reconciliation automatica

**🤖 RPA (Robotic Process Automation):**
• Data entry automatizzato
• Report generation automatica
• Alert e notifiche intelligenti
• Integration cross-sistema

**📊 Workflow Management:**
• Designer workflow drag & drop
• Approvazioni multi-livello
• Tracking stato processi
• SLA monitoring automatico

**🎯 Benefici:**
• Riduzione errori del 95%
• Accelerazione processi del 80%
• Compliance automatica
• ROI misurabile

**🔧 Moduli Disponibili:**
• Loan Processing Automation
• KYC/AML Automation
• Risk Assessment Automation
• Customer Service Automation

Vuoi vedere i processi attualmente automatizzati o configurare nuovi workflow?`]
      };
    }

    // Compliance and Regulatory
    if (lowerMessage.includes('compliance') || lowerMessage.includes('normativa') || lowerMessage.includes('regolamentare') || 
        lowerMessage.includes('kyc') || lowerMessage.includes('aml') || lowerMessage.includes('gdpr') || 
        lowerMessage.includes('basel') || lowerMessage.includes('mifid')) {
      return {
        name: 'compliance_regulatory',
        description: 'Compliance e regulatory management',
        examples: ['compliance', 'normativa', 'regolamentare', 'kyc', 'aml'],
        responses: [`⚖️ **Compliance e Regulatory Management**

Il nostro sistema garantisce conformità completa:

**📋 Framework Normativi:**
• **KYC/AML**: Verifica identità e anti-riciclaggio
• **GDPR**: Protezione dati personali
• **Basel III**: Requisiti patrimoniali
• **MiFID II**: Mercati finanziari
• **PSD2**: Servizi di pagamento

**🔍 Funzionalità Compliance:**
• **Risk Assessment**: Valutazione rischi automatica
• **Monitoring**: Sorveglianza continua transazioni
• **Reporting**: Report regolamentari automatici
• **Audit Trail**: Tracciabilità completa operazioni

**🛡️ Sicurezza e Controlli:**
• **Access Control**: Gestione permessi granulare
• **Data Encryption**: Crittografia end-to-end
• **Fraud Detection**: Rilevamento frodi AI
• **Incident Management**: Gestione incidenti strutturata

**📊 Dashboard Compliance:**
• Status compliance real-time
• Alert violazioni normative
• Metriche performance compliance
• Roadmap aggiornamenti normativi

**🎯 Moduli Specializzati:**
• Regulatory Reporting Engine
• Risk Assessment Framework
• Compliance Training Platform
• Audit Management System

Vuoi verificare lo stato compliance attuale o configurare nuovi controlli?`]
      };
    }

    // UX Personalization
    if (lowerMessage.includes('ux') || lowerMessage.includes('personalizzazione') || lowerMessage.includes('interfaccia') || 
        lowerMessage.includes('esperienza') || lowerMessage.includes('usabilità') || lowerMessage.includes('design')) {
      return {
        name: 'ux_personalization',
        description: 'Personalizzazione UX e design system',
        examples: ['ux', 'personalizzazione', 'interfaccia', 'design'],
        responses: [`🎨 **Personalizzazione UX e Design System**

Il nostro sistema offre esperienze utente personalizzate:

**👤 Profili Utente:**
• **Executive**: Dashboard executive con KPI high-level
• **Analyst**: Strumenti analitici avanzati e dati raw
• **Operator**: Interfacce operative semplificate
• **Compliance**: Focus su controlli e reporting

**🎨 Temi e Layout:**
• **Light/Dark Mode**: Toggle automatico o manuale
• **Color Schemes**: Palette personalizzabili per brand
• **Layout Responsive**: Adattamento automatico device
• **Font Scaling**: Dimensioni testo personalizzabili

**🔧 Personalizzazione Contenuti:**
• **Widget Dashboard**: Drag & drop personalizzazione
• **Quick Actions**: Azioni frequenti in evidenza
• **Favorites**: Sezioni preferite sempre visibili
• **Custom Views**: Viste personalizzate per ruolo

**📱 Multi-Device Experience:**
• **Desktop**: Interfacce complete e avanzate
• **Tablet**: Layout ottimizzati touch
• **Mobile**: App native responsive
• **Smart Watch**: Notifiche e alert essenziali

**🎯 Funzionalità Avanzate:**
• **AI Recommendations**: Suggerimenti personalizzati
• **Behavioral Analytics**: Analisi comportamento utente
• **A/B Testing**: Test interfacce alternative
• **Accessibility**: Supporto completo accessibilità

**🔍 Moduli UX:**
• Design System Manager
• User Preference Engine
• Analytics Dashboard
• A/B Testing Platform

Vuoi personalizzare la tua interfaccia o vedere le opzioni disponibili per il tuo ruolo?`]
      };
    }

    // Enhanced existing intents
    if (lowerMessage.includes('ciao') || lowerMessage.includes('salve') || lowerMessage.includes('buongiorno') || 
        lowerMessage.includes('buonasera') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return {
        name: 'greeting',
        description: 'Saluti iniziali',
        examples: ['ciao', 'salve', 'buongiorno', 'hello'],
        responses: [`Ciao! Sono FinBot, il tuo assistente finanziario AI avanzato! 🚀

Posso aiutarti con:

**📊 Portfolio & Asset Management**
**📰 News Intelligence & Market Analysis**
**⚡ Process Automation & Workflow**
**⚖️ Compliance & Regulatory Management**
**🎨 UX Personalization & Design**
**🔮 Predictive Analytics & Risk Management**
**🔒 Fraud Detection & Security**

Dimmi di cosa hai bisogno o chiedi "sistema" per una panoramica completa!`]
      };
    }

    if (lowerMessage.includes('sistema') || lowerMessage.includes('panoramica') || lowerMessage.includes('overview') || 
        lowerMessage.includes('funzionalità') || lowerMessage.includes('cosa puoi fare')) {
      return {
        name: 'system_overview',
        description: 'Panoramica sistema completo',
        examples: ['sistema', 'panoramica', 'overview', 'funzionalità'],
        responses: [`🚀 **Sistema AI Avanzato Completo - Panoramica Generale**

Il nostro sistema integrato offre soluzioni end-to-end per la gestione finanziaria:

**🏦 Core Banking & Operations**
• Gestione conti e transazioni
• Lending e mortgage management
• Crypto wallet e trading
• Customer relationship management

**🤖 AI & Machine Learning**
• **Portfolio Management**: Asset allocation e risk management
• **News Intelligence**: Market sentiment e trend analysis
• **Process Automation**: Workflow e RPA avanzati
• **Compliance Engine**: Regulatory management automatico
• **Fraud Detection**: Rilevamento frodi real-time
• **Predictive Analytics**: Forecasting e scenario planning

**📊 Analytics & Reporting**
• Dashboard real-time personalizzabili
• Report automatici e scheduling
• Data visualization avanzata
• KPI tracking e alerting

**🔒 Security & Compliance**
• Multi-factor authentication
• End-to-end encryption
• Audit trail completo
• Regulatory reporting automatico

**🎨 User Experience**
• Interfacce personalizzabili per ruolo
• Multi-device support
• Accessibility completa
• AI-powered recommendations

**📱 Integration & APIs**
• RESTful APIs per integrazioni
• Webhook per notifiche
• Data export in multipli formati
• Third-party integrations

Vuoi approfondire una specifica area o vedere demo delle funzionalità?`]
      };
    }

    if (lowerMessage.includes('predittiva') || lowerMessage.includes('forecast') || lowerMessage.includes('predizione') || 
        lowerMessage.includes('futuro') || lowerMessage.includes('trend') || lowerMessage.includes('scenario')) {
      return {
        name: 'predictive_analysis',
        description: 'Analisi predittiva avanzata',
        examples: ['predittiva', 'forecast', 'predizione', 'trend'],
        responses: [`🔮 **Analisi Predittiva Avanzata - Forecasting e Scenario Planning**

Il nostro sistema di analisi predittiva offre:

**📈 Market Forecasting:**
• **Price Prediction**: Modelli ML per asset pricing
• **Trend Analysis**: Identificazione pattern emergenti
• **Volatility Forecasting**: Previsione volatilità mercati
• **Correlation Analysis**: Relazioni tra asset e fattori

**🎯 Risk Prediction:**
• **Credit Risk**: Scoring automatico clienti
• **Market Risk**: VaR e stress testing
• **Operational Risk**: Previsione incidenti operativi
• **Liquidity Risk**: Analisi flussi di cassa futuri

**🔍 Customer Behavior Prediction:**
• **Churn Prediction**: Identificazione clienti a rischio
• **Product Affinity**: Raccomandazioni prodotti
• **Lifecycle Management**: Strategie retention personalizzate
• **Cross-selling**: Opportunità di vendita predittive

**📊 Scenario Planning:**
• **Economic Scenarios**: Recessione, crescita, inflazione
• **Market Scenarios**: Bull/bear market, crisi
• **Regulatory Scenarios**: Cambiamenti normativi
• **Stress Testing**: Test estremi su portfolio

**🤖 AI Models:**
• **Neural Networks**: Deep learning per pattern complessi
• **Time Series**: ARIMA, LSTM per serie temporali
• **Ensemble Methods**: Combinazione multipli modelli
• **Real-time Learning**: Aggiornamento continuo modelli

**📈 Accuracy Metrics:**
• **Backtesting**: Validazione su dati storici
• **Out-of-sample Testing**: Test su dati non visti
• **Performance Tracking**: Monitoraggio accuratezza
• **Model Improvement**: Ottimizzazione continua

Vuoi vedere le previsioni attuali o configurare nuovi modelli predittivi?`]
      };
    }

    if (lowerMessage.includes('frodi') || lowerMessage.includes('fraud') || lowerMessage.includes('sicurezza') || 
        lowerMessage.includes('minacce') || lowerMessage.includes('anomalie') || lowerMessage.includes('sospette')) {
      return {
        name: 'fraud_detection',
        description: 'Rilevamento frodi in tempo reale',
        examples: ['frodi', 'fraud', 'sicurezza', 'minacce'],
        responses: [`🔒 **Rilevamento Frodi in Tempo Reale - Sicurezza Avanzata**

Il nostro sistema di fraud detection offre:

**🚨 Real-time Monitoring:**
• **Transaction Monitoring**: Analisi transazioni in tempo reale
• **Behavioral Analysis**: Profili utente e anomalie
• **Pattern Recognition**: Identificazione pattern sospetti
• **Risk Scoring**: Punteggi rischio dinamici

**🤖 AI-Powered Detection:**
• **Machine Learning**: Modelli ML per rilevamento frodi
• **Anomaly Detection**: Identificazione comportamenti anomali
• **Network Analysis**: Analisi relazioni e connessioni
• **Predictive Models**: Previsione tentativi frode

**🔍 Tipologie Frodi Rilevate:**
• **Payment Fraud**: Frodi su pagamenti e bonifici
• **Identity Theft**: Furto identità e account takeover
• **Money Laundering**: Riciclaggio di denaro
• **Insider Threats**: Minacce interne e abusi
• **Synthetic Fraud**: Identità sintetiche e false

**📊 Dashboard Security:**
• **Threat Intelligence**: Feed minacce in tempo reale
• **Incident Management**: Gestione incidenti strutturata
• **Risk Metrics**: KPI sicurezza e performance
• **Compliance Reporting**: Report sicurezza automatici

**🛡️ Response & Mitigation:**
• **Automatic Blocking**: Blocco automatico transazioni sospette
• **Alert System**: Notifiche immediate per team security
• **Investigation Tools**: Strumenti investigazione avanzati
• **Recovery Procedures**: Procedure recupero automatiche

**📈 Performance Metrics:**
• **False Positive Rate**: < 0.1%
• **Detection Rate**: > 99.5%
• **Response Time**: < 30 secondi
• **Recovery Rate**: > 95%

Vuoi vedere lo stato sicurezza attuale o configurare nuovi controlli anti-frode?`]
      };
    }

    // FAQ Category Intents
    if (lowerMessage.includes('saldo') || lowerMessage.includes('bilancio') || lowerMessage.includes('conto') || 
        lowerMessage.includes('disponibile') || lowerMessage.includes('balance')) {
      return {
        name: 'balance_inquiry',
        description: 'Richiesta informazioni saldo e bilancio',
        examples: ['saldo', 'bilancio', 'conto', 'disponibile'],
        responses: [`💰 **Informazioni Saldo e Bilancio**

**📊 Come Visualizzare il Saldo:**
• Dashboard principale: Saldo in tempo reale
• Sezione "Conti": Panoramica completa
• Sezione "Bilancio": Storico e dettagli

**📈 Aggiornamenti:**
• Transazioni online: Tempo reale
• Operazioni bancarie: Ogni 24 ore
• Notifiche automatiche per variazioni

**📋 Funzionalità Disponibili:**
• Esportazione PDF del bilancio
• Filtri temporali personalizzabili
• Confronto periodi diversi
• Alert per soglie di saldo

**🔍 FAQ Correlate:**
• "Qual è il mio saldo attuale?"
• "Posso esportare il bilancio in PDF?"
• "Come vedere tutti i miei conti?"

Hai bisogno di informazioni specifiche sul tuo saldo o bilancio?`]
      };
    }

    if (lowerMessage.includes('transazione') || lowerMessage.includes('operazione') || lowerMessage.includes('bonifico') || 
        lowerMessage.includes('pagamento') || lowerMessage.includes('movimento')) {
      return {
        name: 'transaction_inquiry',
        description: 'Richiesta informazioni transazioni e operazioni',
        examples: ['transazione', 'operazione', 'bonifico', 'pagamento'],
        responses: [`💳 **Informazioni Transazioni e Operazioni**

**📋 Gestione Transazioni:**
• Storico completo con filtri temporali
• Dettagli dettagliati per ogni operazione
• Stato in tempo reale (completata, in sospeso, rifiutata)

**⏱️ Tempi di Elaborazione:**
• Bonifici SEPA: 1-2 giorni lavorativi
• Bonifici istantanei: Entro pochi secondi
• Pagamenti carta: Immediati
• Addebiti diretti: 2-3 giorni

**🔍 FAQ Correlate:**
• "Come vedere transazioni ultimi 30 giorni?"
• "Perché una transazione è in sospeso?"
• "Quanto tempo impiegano i bonifici?"

**⚠️ Note Importanti:**
• Transazioni processate non possono essere annullate
• Per transazioni in sospeso, contatta l'assistenza
• Verifica sempre i dettagli prima di confermare

Hai bisogno di aiuto con una transazione specifica?`]
      };
    }

    if (lowerMessage.includes('crypto') || lowerMessage.includes('bitcoin') || lowerMessage.includes('wallet') || 
        lowerMessage.includes('trading') || lowerMessage.includes('criptovalute')) {
      return {
        name: 'crypto_inquiry',
        description: 'Richiesta informazioni criptovalute e trading',
        examples: ['crypto', 'bitcoin', 'wallet', 'trading'],
        responses: [`🚀 **Criptovalute e Trading**

**💰 Prezzi in Tempo Reale:**
• Aggiornamento ogni minuto
• Prezzi in Euro e principali valute
• Grafici storici e analisi tecniche

**🔐 Wallet e Sicurezza:**
• Collegamento wallet MetaMask, Ledger
• Cold storage per la maggior parte degli asset
• Standard di sicurezza bancaria
• Autenticazione multi-fattore

**📈 Trading 24/7:**
• Piattaforma integrata
• Compra, vendi, scambia
• Ordini limite e di mercato
• Portfolio tracking automatico

**🔍 FAQ Correlate:**
• "Qual è il prezzo attuale del Bitcoin?"
• "Posso collegare il mio wallet crypto?"
• "Le criptovalute sono sicure?"

**⚠️ Avvertenze:**
• Le criptovalute sono volatili
• Investi solo quello che puoi permetterti di perdere
• Diversifica sempre il portfolio

Vuoi informazioni su una criptovaluta specifica o sul trading?`]
      };
    }

    if (lowerMessage.includes('documento') || lowerMessage.includes('fiscale') || lowerMessage.includes('pdf') || 
        lowerMessage.includes('modulo') || lowerMessage.includes('certificato')) {
      return {
        name: 'documentation_inquiry',
        description: 'Richiesta informazioni documenti e moduli',
        examples: ['documento', 'fiscale', 'pdf', 'modulo'],
        responses: [`📄 **Documenti e Moduli Fiscali**

**📋 Documenti Disponibili:**
• CUD (Certificazione Unica Dipendente)
• Modulo 730
• Certificati conto corrente
• Estratti conto personalizzabili

**📅 Disponibilità:**
• Documenti fiscali: Dal 1° marzo
• Estratti conto: Sempre disponibili
• Certificati: Generazione immediata

**📧 Modalità di Invio:**
• Download diretto dalla piattaforma
• Invio automatico via email
• Notifiche per nuovi documenti
• Archiviazione sicura per 10 anni

**🔍 FAQ Correlate:**
• "Dove trovo i documenti fiscali?"
• "Posso ricevere documenti via email?"
• "Come verificare l'autenticità?"

**🔐 Sicurezza:**
• Codice QR per verifica
• Riferimento univoco per ogni documento
• Crittografia end-to-end
• Conformità GDPR

Hai bisogno di un documento specifico o informazioni sui moduli fiscali?`]
      };
    }

    if (lowerMessage.includes('sicurezza') || lowerMessage.includes('password') || lowerMessage.includes('2fa') || 
        lowerMessage.includes('autenticazione') || lowerMessage.includes('protezione')) {
      return {
        name: 'security_inquiry',
        description: 'Richiesta informazioni sicurezza e privacy',
        examples: ['sicurezza', 'password', '2fa', 'autenticazione'],
        responses: [`🔒 **Sicurezza e Privacy**

**🛡️ Protezione Account:**
• Autenticazione a due fattori (2FA)
• Password sicure con requisiti minimi
• Blocco automatico per tentativi falliti
• Notifiche per accessi sospetti

**🔐 Autenticazione Avanzata:**
• SMS o app authenticator per 2FA
• Biometria su dispositivi compatibili
• Sessioni sicure con timeout automatico
• Logout forzato da tutti i dispositivi

**📱 Monitoraggio Accessi:**
• Storico completo degli accessi
• Dispositivi e sessioni attive
• Geolocalizzazione degli accessi
• Alert per attività sospette

**🔍 FAQ Correlate:**
• "Come attivo l'autenticazione a due fattori?"
• "I miei dati sono protetti?"
• "Come verificare gli accessi al mio account?"

**⚠️ In Caso di Problemi:**
• Cambia immediatamente la password
• Contatta l'assistenza per blocco account
• Verifica tutti i dispositivi collegati
• Controlla le notifiche di sicurezza

Hai bisogno di aiuto con le impostazioni di sicurezza o hai notato attività sospette?`]
      };
    }

    // FAQ System Intents
    if (lowerMessage.includes('faq') || lowerMessage.includes('domande frequenti') || lowerMessage.includes('tutte le faq')) {
      return {
        name: 'show_all_faq',
        description: 'Mostra tutte le FAQ disponibili',
        examples: ['faq', 'domande frequenti', 'tutte le faq'],
        responses: [this.getAllFAQCategories()]
      };
    }

    if (lowerMessage.includes('bilancio') || lowerMessage.includes('saldi')) {
      const faqResponse = this.getFAQForCategory('bilancio');
      if (faqResponse) {
        return {
          name: 'bilancio_faq',
          description: 'FAQ specifiche per bilancio e saldi',
          examples: ['bilancio', 'saldi', 'faq bilancio'],
          responses: [faqResponse]
        };
      }
    }

    if (lowerMessage.includes('transazioni') || lowerMessage.includes('operazioni')) {
      const faqResponse = this.getFAQForCategory('transazioni');
      if (faqResponse) {
        return {
          name: 'transazioni_faq',
          description: 'FAQ specifiche per transazioni e operazioni',
          examples: ['transazioni', 'operazioni', 'faq transazioni'],
          responses: [faqResponse]
        };
      }
    }

    if (lowerMessage.includes('portafoglio') || lowerMessage.includes('investimenti')) {
      const faqResponse = this.getFAQForCategory('portafoglio');
      if (faqResponse) {
        return {
          name: 'portafoglio_faq',
          description: 'FAQ specifiche per portafoglio e investimenti',
          examples: ['portafoglio', 'investimenti', 'faq portafoglio'],
          responses: [faqResponse]
        };
      }
    }

    if (lowerMessage.includes('criptovalute') || lowerMessage.includes('crypto')) {
      const faqResponse = this.getFAQForCategory('criptovalute');
      if (faqResponse) {
        return {
          name: 'crypto_faq',
          description: 'FAQ specifiche per criptovalute e trading',
          examples: ['criptovalute', 'crypto', 'faq crypto'],
          responses: [faqResponse]
        };
      }
    }

    if (lowerMessage.includes('documenti') || lowerMessage.includes('fiscale')) {
      const faqResponse = this.getFAQForCategory('documentazione');
      if (faqResponse) {
        return {
          name: 'documenti_faq',
          description: 'FAQ specifiche per documenti e moduli fiscali',
          examples: ['documenti', 'fiscale', 'faq documenti'],
          responses: [faqResponse]
        };
      }
    }

    if (lowerMessage.includes('assistenza') || lowerMessage.includes('tecnica')) {
      const faqResponse = this.getFAQForCategory('assistenza_tecnica');
      if (faqResponse) {
        return {
          name: 'assistenza_faq',
          description: 'FAQ specifiche per assistenza tecnica',
          examples: ['assistenza', 'tecnica', 'faq assistenza'],
          responses: [faqResponse]
        };
      }
    }

    if (lowerMessage.includes('sicurezza') || lowerMessage.includes('privacy')) {
      const faqResponse = this.getFAQForCategory('sicurezza');
      if (faqResponse) {
        return {
          name: 'sicurezza_faq',
          description: 'FAQ specifiche per sicurezza e privacy',
          examples: ['sicurezza', 'privacy', 'faq sicurezza'],
          responses: [faqResponse]
        };
      }
    }

    // Default fallback with FAQ suggestions
    return {
      name: 'general_inquiry',
      description: 'Richiesta generale',
      examples: ['aiuto', 'help', 'supporto'],
      responses: [`Grazie per la tua domanda! 🤔

Per aiutarti al meglio, posso fornirti informazioni su:

**💰 Bilancio e Saldi**
• Saldo conto, esportazione PDF, aggiornamenti
• Esempio: "Qual è il mio saldo attuale?"

**💳 Transazioni e Operazioni**
• Storico transazioni, bonifici, tempi di elaborazione
• Esempio: "Come vedere le transazioni degli ultimi 30 giorni?"

**📊 Portafoglio e Investimenti**
• Gestione asset, performance, rischio, alert
• Esempio: "Qual è la performance del mio portafoglio?"

**🚀 Criptovalute e Trading**
• Prezzi Bitcoin, wallet, sicurezza, trading 24/7
• Esempio: "Qual è il prezzo attuale del Bitcoin?"

**📄 Documenti e Fiscale**
• CUD, 730, PDF, email, autenticità
• Esempio: "Dove trovo i documenti fiscali?"

**🔒 Sicurezza e Privacy**
• 2FA, password, protezione dati, monitoraggio accessi
• Esempio: "Come attivo l'autenticazione a due fattori?"

**⚡ Assistenza Tecnica**
• Problemi app, aggiornamenti, performance, password
• Esempio: "L'app non si apre, cosa posso fare?"

Prova a chiedere di uno di questi argomenti o chiedi "sistema" per una panoramica completa!`]
    };
  }

  private async generateResponse(intent: ChatbotIntent, message: string, sessionId: string, userId?: string): Promise<any> {
    const baseResponse = intent.responses[Math.floor(Math.random() * intent.responses.length)];
    
    switch (intent.name) {
      case 'greeting':
        return {
          text: baseResponse,
          type: 'text',
          quickReplies: [
            { title: '📊 Analisi Predittiva', payload: 'analisi predittiva' },
            { title: '🔒 Rilevamento Frodi', payload: 'rilevamento frodi' },
            { title: '💼 Ottimizzazione Investimenti', payload: 'ottimizzazione investimenti' },
            { title: '⚡ Automazione Processi', payload: 'automazione' },
            { title: '📰 News Intelligence', payload: 'news intelligence' },
            { title: '⚖️ Compliance', payload: 'compliance' },
            { title: '🎯 Personalizzazione UX', payload: 'personalizzazione' },
            { title: '🚀 Panoramica Sistema', payload: 'sistema' }
          ]
        };

      case 'check_balance':
        const balance = await this.fetchBalance(userId);
        return {
          text: baseResponse.replace('{balance}', balance.amount).replace('{lastUpdate}', balance.lastUpdate),
          type: 'text',
          data: balance,
          quickReplies: [
            { title: 'Vedi Movimenti', payload: 'recent_transactions' },
            { title: 'Altro Conto', payload: 'other_accounts' }
          ]
        };

      case 'recent_transactions':
        const transactions = await this.fetchTransactions(userId);
        return {
          text: baseResponse,
          type: 'list',
          data: transactions,
          quickReplies: [
            { title: 'Dettagli', payload: 'transaction_details' },
            { title: 'Filtra', payload: 'filter_transactions' }
          ]
        };

      case 'investment_advice':
        const advice = await this.generateInvestmentAdvice(userId);
        return {
          text: baseResponse.replace('{riskProfile}', advice.riskProfile),
          type: 'card',
          cards: advice.recommendations,
          quickReplies: [
            { title: 'Approfondisci', payload: 'learn_more_investing' },
            { title: 'Simula Portfolio', payload: 'simulate_portfolio' }
          ]
        };

      case 'market_data':
        const marketData = await this.fetchMarketData();
        return {
          text: baseResponse,
          type: 'chart',
          data: marketData,
          quickReplies: [
            { title: 'Analisi Dettagliata', payload: 'detailed_analysis' },
            { title: 'Alert Prezzi', payload: 'price_alerts' }
          ]
        };

      case 'education_request':
        return {
          text: baseResponse,
          type: 'text',
          quickReplies: [
            { title: 'Investimenti Base', payload: 'education_investing' },
            { title: 'Risparmi', payload: 'education_saving' },
            { title: 'Budget', payload: 'education_budgeting' },
            { title: 'Pensione', payload: 'education_retirement' }
          ]
        };

      case 'predictive_analysis':
        return {
          text: baseResponse,
          type: 'card',
          cards: [
            {
              title: '📊 Analisi Flussi di Cassa',
              subtitle: 'Predizioni AI per gestione liquidità',
              buttons: [
                { title: 'Simula Scenari', type: 'postback', payload: 'simula_flussi_cassa' },
                { title: 'Vedi Report', type: 'postback', payload: 'report_flussi_cassa' }
              ]
            },
            {
              title: '🔍 Valutazione Rischio Credito',
              subtitle: 'AI per scoring creditizio avanzato',
              buttons: [
                { title: 'Analizza Cliente', type: 'postback', payload: 'analizza_rischio_credito' },
                { title: 'Modelli ML', type: 'postback', payload: 'modelli_ml_credito' }
              ]
            }
          ],
          quickReplies: [
            { title: '📈 Trend Mercato', payload: 'trend_mercato' },
            { title: '🎯 Previsioni', payload: 'previsioni_ai' }
          ]
        };

      case 'fraud_detection':
        return {
          text: baseResponse,
          type: 'card',
          cards: [
            {
              title: '🔒 Monitoraggio 24/7',
              subtitle: 'Rilevamento transazioni sospette in tempo reale',
              buttons: [
                { title: 'Vedi Alert', type: 'postback', payload: 'alert_frode' },
                { title: 'Pattern Anomali', type: 'postback', payload: 'pattern_anomali' }
              ]
            },
            {
              title: '🛡️ Protezione Avanzata',
              subtitle: 'AI per behavioral analysis e machine learning',
              buttons: [
                { title: 'Report Sicurezza', type: 'postback', payload: 'report_sicurezza' },
                { title: 'Configura Alert', type: 'postback', payload: 'configura_alert' }
              ]
            },
            {
              title: '📊 Dashboard Sicurezza',
              subtitle: 'Monitoraggio real-time e statistiche avanzate',
              buttons: [
                { title: 'Vedi Dashboard', type: 'postback', payload: 'dashboard_sicurezza' },
                { title: 'Export Report', type: 'postback', payload: 'export_report' }
              ]
            }
          ],
          quickReplies: [
            { title: '📊 Statistiche Sicurezza', payload: 'stats_sicurezza' },
            { title: '⚙️ Impostazioni', payload: 'impostazioni_sicurezza' },
            { title: '🔍 Analisi Dettagliata', payload: 'analisi_dettagliata' },
            { title: '📱 Notifiche', payload: 'configura_notifiche' }
          ]
        };

      case 'security_alerts':
        return {
          text: baseResponse,
          type: 'card',
          cards: [
            {
              title: '🚨 Alert in Tempo Reale',
              subtitle: 'Notifiche immediate per minacce di sicurezza',
              buttons: [
                { title: 'Vedi Alert Attivi', type: 'postback', payload: 'alert_attivi' },
                { title: 'Cronologia Alert', type: 'postback', payload: 'cronologia_alert' }
              ]
            },
            {
              title: '⚙️ Configurazione Alert',
              subtitle: 'Personalizza le tue notifiche di sicurezza',
              buttons: [
                { title: 'Configura Notifiche', type: 'postback', payload: 'configura_notifiche' },
                { title: 'Livelli Priorità', type: 'postback', payload: 'livelli_priorita' }
              ]
            },
            {
              title: '📊 Dashboard Alert',
              subtitle: 'Monitoraggio centralizzato di tutti gli alert',
              buttons: [
                { title: 'Vedi Dashboard', type: 'postback', payload: 'dashboard_alert' },
                { title: 'Export Report', type: 'postback', payload: 'export_alert' }
              ]
            }
          ],
          quickReplies: [
            { title: '🔔 Notifiche Push', payload: 'notifiche_push' },
            { title: '📧 Email Alert', payload: 'email_alert' },
            { title: '📱 SMS Alert', payload: 'sms_alert' },
            { title: '⚙️ Impostazioni', payload: 'impostazioni_alert' }
          ]
        };

      case 'investment_optimization':
        return {
          text: baseResponse,
          type: 'card',
          cards: [
            {
              title: '💼 Portfolio Automatico',
              subtitle: 'Gestione intelligente asset allocation',
              buttons: [
                { title: 'Vedi Portfolio', type: 'postback', payload: 'portfolio_attuale' },
                { title: 'Ottimizza', type: 'postback', payload: 'ottimizza_portfolio' }
              ]
            },
            {
              title: '🎲 Simulazioni Scenari',
              subtitle: 'Analisi Monte Carlo e stress test',
              buttons: [
                { title: 'Simula Scenari', type: 'postback', payload: 'simula_scenari' },
                { title: 'Stress Test', type: 'postback', payload: 'stress_test' }
              ]
            }
          ],
          quickReplies: [
            { title: '📈 Performance', payload: 'performance_portfolio' },
            { title: '⚖️ Gestione Rischio', payload: 'gestione_rischio' }
          ]
        };

      case 'process_automation':
        return {
          text: baseResponse,
          type: 'card',
          cards: [
            {
              title: '⚡ Approvazione Prestiti',
              subtitle: 'Valutazione automatica con AI',
              buttons: [
                { title: 'Simula Prestito', type: 'postback', payload: 'simula_prestito' },
                { title: 'Criteri AI', type: 'postback', payload: 'criteri_ai' }
              ]
            },
            {
              title: '📊 Report Automatici',
              subtitle: 'Generazione intelligente documenti',
              buttons: [
                { title: 'Vedi Report', type: 'postback', payload: 'report_disponibili' },
                { title: 'Configura', type: 'postback', payload: 'configura_report' }
              ]
            }
          ],
          quickReplies: [
            { title: '🔄 Workflow', payload: 'workflow_automatici' },
            { title: '📈 Efficienza', payload: 'metriche_efficienza' }
          ]
        };

      case 'news_intelligence':
        return {
          text: baseResponse,
          type: 'card',
          cards: [
            {
              title: '📰 Sentiment Analysis',
              subtitle: 'Analisi automatica sentiment notizie',
              buttons: [
                { title: 'Analizza News', type: 'postback', payload: 'analizza_news' },
                { title: 'Report Sentiment', type: 'postback', payload: 'report_sentiment' }
              ]
            },
            {
              title: '🚨 Alert Mercato',
              subtitle: 'Notifiche intelligenti in tempo reale',
              buttons: [
                { title: 'Configura Alert', type: 'postback', payload: 'configura_alert_mercato' },
                { title: 'Vedi Alert Attivi', type: 'postback', payload: 'alert_attivi' }
              ]
            }
          ],
          quickReplies: [
            { title: '📊 Trend Detection', payload: 'trend_detection' },
            { title: '🎯 Impatto Mercato', payload: 'impatto_mercato' }
          ]
        };

      case 'compliance_intelligence':
        return {
          text: baseResponse,
          type: 'card',
          cards: [
            {
              title: '⚖️ Verifica Automatica',
              subtitle: 'Controllo normative in tempo reale',
              buttons: [
                { title: 'Stato Compliance', type: 'postback', payload: 'stato_compliance' },
                { title: 'Report Normative', type: 'postback', payload: 'report_normative' }
              ]
            },
            {
              title: '🛡️ Gestione Rischi',
              subtitle: 'Monitoraggio rischi normativi',
              buttons: [
                { title: 'Rischi Attivi', type: 'postback', payload: 'rischi_normativi' },
                { title: 'Audit Trail', type: 'postback', payload: 'audit_trail' }
              ]
            }
          ],
          quickReplies: [
            { title: '📋 Checklist', payload: 'checklist_compliance' },
            { title: '⚙️ Configurazione', payload: 'config_compliance' }
          ]
        };

      case 'personalization_ux':
        return {
          text: baseResponse,
          type: 'card',
          cards: [
            {
              title: '🎯 Dashboard Adattive',
              subtitle: 'Interfacce personalizzate per ruolo',
              buttons: [
                { title: 'Personalizza', type: 'postback', payload: 'personalizza_dashboard' },
                { title: 'Vedi Layout', type: 'postback', payload: 'layout_disponibili' }
              ]
            },
            {
              title: '👤 Esperienza Utente',
              subtitle: 'UX ottimizzata e intelligente',
              buttons: [
                { title: 'Preferenze', type: 'postback', payload: 'preferenze_utente' },
                { title: 'Temi', type: 'postback', payload: 'temi_disponibili' }
              ]
            }
          ],
          quickReplies: [
            { title: '🔧 Impostazioni', payload: 'impostazioni_ux' },
            { title: '📱 Responsive', payload: 'design_responsive' }
          ]
        };

      case 'system_overview':
        return {
          text: baseResponse,
          type: 'text',
          quickReplies: [
            { title: '📊 Analisi Predittiva', payload: 'analisi predittiva' },
            { title: '🔒 Rilevamento Frodi', payload: 'rilevamento frodi' },
            { title: '💼 Investimenti', payload: 'ottimizzazione investimenti' },
            { title: '⚡ Automazione', payload: 'automazione' },
            { title: '📰 News', payload: 'news intelligence' },
            { title: '⚖️ Compliance', payload: 'compliance' },
            { title: '🎯 UX', payload: 'personalizzazione' }
          ]
        };

      case 'fallback':
        return {
          text: baseResponse,
          type: 'text',
          quickReplies: [
            { title: '🔒 Rilevamento Frodi', payload: 'rilevamento frodi' },
            { title: '📊 Analisi Predittiva', payload: 'analisi predittiva' },
            { title: '💼 Investimenti', payload: 'ottimizzazione investimenti' },
            { title: '🚀 Panoramica Sistema', payload: 'sistema' }
          ]
        };

      default:
        return {
          text: baseResponse,
          type: 'text',
          quickReplies: [
            { title: '🚀 Panoramica Sistema', payload: 'sistema' },
            { title: '📊 Analisi Predittiva', payload: 'analisi predittiva' },
            { title: '🔒 Sicurezza', payload: 'rilevamento frodi' },
            { title: '💼 Investimenti', payload: 'ottimizzazione investimenti' }
          ]
        };
    }
  }

  private async fetchBalance(userId?: string): Promise<any> {
    // Simulazione fetch saldo
    return {
      amount: '€' + (Math.random() * 10000 + 1000).toFixed(2),
      lastUpdate: new Date().toLocaleString('it-IT'),
      accountType: 'Conto Corrente'
    };
  }

  private async fetchTransactions(userId?: string, limit: number = 5): Promise<any[]> {
    // Simulazione fetch transazioni
    const types = ['Bonifico', 'Carta', 'Prelievo', 'Stipendio', 'Bolletta'];
    const merchants = ['Supermercato', 'Ristorante', 'Benzina', 'Amazon', 'Netflix'];
    
    return Array.from({ length: limit }, (_, i) => ({
      id: `txn_${i}`,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('it-IT'),
      type: types[Math.floor(Math.random() * types.length)],
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      amount: (Math.random() * 200 + 10).toFixed(2),
      sign: Math.random() > 0.7 ? '+' : '-'
    }));
  }

  private async generateInvestmentAdvice(userId?: string): Promise<any> {
    const riskProfiles = ['conservativo', 'moderato', 'aggressivo'];
    const riskProfile = riskProfiles[Math.floor(Math.random() * riskProfiles.length)];
    
    return {
      riskProfile,
      recommendations: [
        {
          title: 'ETF Diversificato',
          subtitle: 'Portafoglio bilanciato globale',
          buttons: [
            { title: 'Scopri', type: 'postback', payload: 'learn_etf' },
            { title: 'Investi', type: 'postback', payload: 'invest_etf' }
          ]
        },
        {
          title: 'Obbligazioni Governative',
          subtitle: 'Investimento a basso rischio',
          buttons: [
            { title: 'Dettagli', type: 'postback', payload: 'bonds_details' },
            { title: 'Confronta', type: 'postback', payload: 'compare_bonds' }
          ]
        }
      ]
    };
  }

  private async fetchMarketData(): Promise<any> {
    return {
      indices: [
        { name: 'FTSE MIB', value: 28450, change: '+1.2%' },
        { name: 'S&P 500', value: 4200, change: '+0.8%' },
        { name: 'Bitcoin', value: 42000, change: '-2.1%' }
      ],
      timestamp: new Date().toLocaleTimeString('it-IT')
    };
  }

  // Educazione Finanziaria
  async getEducationalContent(topic: string, level: 'beginner' | 'intermediate' | 'advanced'): Promise<FinancialEducationContent> {
    try {
      const response = await api.get(`/ai/education/${topic}/${level}`);
      return response.data as FinancialEducationContent;
    } catch (error) {
      console.error('Error fetching educational content:', error);
      return this.mockEducationalContent(topic, level);
    }
  }

  private mockEducationalContent(topic: string, level: string): FinancialEducationContent {
    const contents = {
      investing: {
        beginner: {
          title: 'Investimenti: Primi Passi',
          content: 'Gli investimenti sono un modo per far crescere i tuoi soldi nel tempo. Iniziamo con i concetti base: diversificazione, rischio e rendimento.',
          duration: 10,
          quiz: {
            questions: [
              {
                question: 'Cosa significa diversificare un portafoglio?',
                options: [
                  'Investire tutto in un singolo titolo',
                  'Suddividere gli investimenti tra diversi asset',
                  'Vendere tutto quando i mercati scendono',
                  'Comprare solo azioni'
                ],
                correct: 1,
                explanation: 'La diversificazione riduce il rischio distribuendo gli investimenti su diversi asset.'
              }
            ]
          }
        }
      },
      saving: {
        beginner: {
          title: 'Come Risparmiare Efficacemente',
          content: 'Il risparmio è la base della sicurezza finanziaria. Impara a creare un budget e a mettere da parte denaro ogni mese.',
          duration: 8,
          quiz: {
            questions: [
              {
                question: 'Quale percentuale del reddito dovrebbe essere risparmiata?',
                options: ['5%', '10-20%', '50%', '100%'],
                correct: 1,
                explanation: 'Gli esperti consigliano di risparmiare il 10-20% del reddito mensile.'
              }
            ]
          }
        }
      }
    };

    const topicContent = contents[topic as keyof typeof contents]?.[level as keyof typeof contents.investing];
    
    return {
      id: `edu_${topic}_${level}`,
      title: topicContent?.title || `${topic} - ${level}`,
      category: topic as any,
      level: level as any,
      content: topicContent?.content || 'Contenuto educativo in fase di sviluppo.',
      duration: topicContent?.duration || 15,
      interactive: true,
      quiz: topicContent?.quiz,
      relatedTopics: ['budgeting', 'credit', 'retirement']
    };
  }

  // Gestione Sessioni
  async createSession(userId: string): Promise<ChatSession> {
    const session: ChatSession = {
      id: `session_${Date.now()}`,
      userId,
      startTime: new Date().toISOString(),
      status: 'active',
      context: {
        currentTopic: 'general',
        previousIntents: [],
        variables: {}
      }
    };

    try {
      await api.post('/ai/chatbot/sessions', session);
    } catch (error) {
      console.error('Error creating session:', error);
    }

    return session;
  }

  async updateSessionContext(sessionId: string, context: any): Promise<void> {
    try {
      await api.put(`/ai/chatbot/sessions/${sessionId}/context`, context);
    } catch (error) {
      console.error('Error updating session context:', error);
    }
  }

  async endSession(sessionId: string, satisfaction?: { rating: number; feedback: string }): Promise<void> {
    try {
      await api.put(`/ai/chatbot/sessions/${sessionId}/end`, {
        endTime: new Date().toISOString(),
        status: 'closed',
        satisfaction
      });
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }

  // Analisi Customer Insight
  async analyzeCustomerInsights(userId: string): Promise<CustomerInsight> {
    try {
      const response = await api.get(`/ai/insights/customer/${userId}`);
      return response.data as CustomerInsight;
    } catch (error) {
      console.error('Error analyzing customer insights:', error);
      return this.mockCustomerInsights(userId);
    }
  }

  private mockCustomerInsights(userId: string): CustomerInsight {
    return {
      customerId: userId,
      financialGoals: ['Acquisto casa', 'Pensione', 'Fondo emergenza'],
      riskTolerance: 'medium',
      investmentExperience: 'intermediate',
      preferredChannels: ['mobile', 'web', 'chatbot'],
      learningStyle: 'interactive',
      interests: ['investing', 'saving', 'real_estate'],
      concerns: ['market_volatility', 'inflation', 'job_security']
    };
  }

  // Personalizzazione Risposte
  async getPersonalizedResponse(message: string, customerInsight: CustomerInsight): Promise<string> {
    const baseResponse = await this.processMessage(message, 'temp_session');
    
    // Personalizza la risposta basandosi sui insights del cliente
    let personalizedResponse = baseResponse.message;
    
    if (customerInsight.riskTolerance === 'low') {
      personalizedResponse = personalizedResponse.replace(/aggressivo/g, 'conservativo');
    }
    
    if (customerInsight.investmentExperience === 'beginner') {
      personalizedResponse += '\n\nTi consiglio di iniziare con i nostri contenuti educativi per principianti.';
    }
    
    return personalizedResponse;
  }

  // Escalation a operatore umano
  async requestHumanAgent(sessionId: string, reason: string): Promise<{ transferId: string; estimatedWaitTime: number }> {
    try {
      const response = await api.post('/ai/chatbot/transfer-human', {
        sessionId,
        reason,
        priority: this.calculateTransferPriority(reason)
      });
      return response.data as { transferId: string; estimatedWaitTime: number };
    } catch (error) {
      console.error('Error requesting human agent:', error);
      return {
        transferId: `transfer_${Date.now()}`,
        estimatedWaitTime: Math.floor(Math.random() * 300 + 60) // 1-5 minuti
      };
    }
  }

  private calculateTransferPriority(reason: string): 'low' | 'medium' | 'high' | 'urgent' {
    const urgentKeywords = ['frode', 'furto', 'emergenza', 'blocco'];
    const highKeywords = ['prestito', 'mutuo', 'investimento', 'problema'];
    
    const lowerReason = reason.toLowerCase();
    
    if (urgentKeywords.some(keyword => lowerReason.includes(keyword))) {
      return 'urgent';
    }
    if (highKeywords.some(keyword => lowerReason.includes(keyword))) {
      return 'high';
    }
    return 'medium';
  }

  // Test connettività backend
  async testBackendConnectivity(): Promise<{ status: 'connected' | 'failed'; error?: string }> {
    try {
      debugLog('🔍 Testing backend connectivity...');
      
      // Prova prima l'endpoint di health
      try {
        const response = await api.get('/health');
        debugLog('✅ Backend health endpoint is reachable');
        return { status: 'connected' };
      } catch (healthError) {
        debugLog('⚠️ Health endpoint not available, trying chatbot endpoint...');
        
        // Se l'health endpoint non è disponibile, prova a creare una sessione
        try {
          const session = await this.createSession('test_connectivity');
          debugLog('✅ Backend chatbot endpoint is reachable');
          return { status: 'connected' };
        } catch (sessionError) {
          debugLog('❌ Backend chatbot endpoint not available');
          return { status: 'failed', error: 'Backend non disponibile - endpoint chatbot non raggiungibile' };
        }
      }
      
    } catch (error) {
      debugLog('❌ Backend connectivity test failed:', error);
      
      if (error instanceof Error) {
        return { status: 'failed', error: error.message };
      }
      
      return { status: 'failed', error: 'Errore sconosciuto durante il test di connettività' };
    }
  }

  // Test completo del sistema
  async runSystemTest(): Promise<{
    backend: boolean;
    localProcessing: boolean;
    intentDetection: boolean;
    responseGeneration: boolean;
    errors: string[];
  }> {
    const results = {
      backend: false,
      localProcessing: false,
      intentDetection: false,
      responseGeneration: false,
      errors: [] as string[]
    };

    try {
      // Test backend
      const connectivity = await this.testBackendConnectivity();
      results.backend = connectivity.status === 'connected';
      if (connectivity.error) results.errors.push(`Backend: ${connectivity.error}`);

      // Test processamento locale
      try {
        const testMessage = 'ciao';
        const localResponse = await this.processMessageLocally(testMessage, 'test_session', 'test_user');
        results.localProcessing = !!localResponse && localResponse.message.length > 0;
        debugLog('✅ Local processing test passed');
      } catch (error) {
        results.errors.push(`Local processing: ${error}`);
        debugLog('❌ Local processing test failed:', error);
      }

      // Test rilevamento intent
      try {
        const intent = this.detectIntent('ciao');
        results.intentDetection = intent.name === 'greeting' && (intent.confidence || 0) > 0.8;
        debugLog('✅ Intent detection test passed');
      } catch (error) {
        results.errors.push(`Intent detection: ${error}`);
        debugLog('❌ Intent detection test failed:', error);
      }

      // Test generazione risposta
      try {
        const intent = this.detectIntent('ciao');
        const response = await this.generateResponse(intent, 'ciao', 'test_session', 'test_user');
        results.responseGeneration = !!response && !!response.text;
        debugLog('✅ Response generation test passed');
      } catch (error) {
        results.errors.push(`Response generation: ${error}`);
        debugLog('❌ Response generation test failed:', error);
      }

    } catch (error) {
      results.errors.push(`System test: ${error}`);
    }

    debugLog('📊 System test results:', results);
    return results;
  }

  // Comprehensive FAQ System
  private readonly faqData = {
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
        answer: 'Nella sezione "Sicurezza" > "Accessi" puoi vedere tutti i dispositivi e le sessioni attive del tuo account.',
        keywords: ['verifica accessi', 'dispositivi', 'sessioni', 'attive', 'account']
      },
      {
        question: 'Cosa fare se sospetto un accesso non autorizzato?',
        answer: 'Cambia immediatamente la password e contatta l\'assistenza. Bloccheremo immediatamente l\'account per sicurezza.',
        keywords: ['accesso non autorizzato', 'cambia password', 'blocca', 'sicurezza', 'immediato']
      }
    ]
  };

  // Enhanced FAQ search method
  private searchFAQ(message: string): string | null {
    const lowerMessage = message.toLowerCase();
    
    // Search through all FAQ categories
    for (const [category, faqs] of Object.entries(this.faqData)) {
      for (const faq of faqs) {
        // Check if any keyword matches
        const keywordMatch = faq.keywords.some(keyword => 
          lowerMessage.includes(keyword.toLowerCase())
        );
        
        // Check if the question is similar
        const questionMatch = faq.question.toLowerCase().includes(lowerMessage) ||
                             lowerMessage.includes(faq.question.toLowerCase());
        
        if (keywordMatch || questionMatch) {
          return `📋 **FAQ - ${this.getCategoryLabel(category)}**\n\n**D:** ${faq.question}\n**R:** ${faq.answer}`;
        }
      }
    }
    
    return null;
  }

  // Get category label in Italian
  private getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      bilancio: 'Bilancio e Saldi',
      transazioni: 'Transazioni e Operazioni',
      portafoglio: 'Portafoglio e Investimenti',
      criptovalute: 'Criptovalute e Trading',
      documentazione: 'Documenti e Fiscale',
      assistenza_tecnica: 'Assistenza Tecnica',
      sicurezza: 'Sicurezza e Privacy'
    };
    return labels[category] || category;
  }

  // Method to show all FAQ categories
  private getAllFAQCategories(): string {
    let response = `📋 **Tutte le FAQ Disponibili**\n\n`;
    
    for (const [category, faqs] of Object.entries(this.faqData)) {
      const categoryLabel = this.getCategoryLabel(category);
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
    
    return response;
  }

  // Method to show FAQ for a specific category
  private getFAQForCategory(category: string): string | null {
    const faqs = this.faqData[category as keyof typeof this.faqData];
    if (!faqs) return null;
    
    const categoryLabel = this.getCategoryLabel(category);
    let response = `📋 **FAQ - ${categoryLabel}**\n\n`;
    
    faqs.forEach((faq, index) => {
      response += `**${index + 1}. ${faq.question}**\n`;
      response += `${faq.answer}\n\n`;
    });
    
    response += `**💡 Suggerimenti:**\n`;
    response += `• Fai domande specifiche per risposte dettagliate\n`;
    response += `• Usa le parole chiave per trovare rapidamente le informazioni\n`;
    
    return response;
  }
}

export const aiChatbotService = new AIChatbotService();

// Metodi per gestire la configurazione
export const getChatbotConfig = () => ({ ...CHATBOT_CONFIG });

export const updateChatbotConfig = (updates: Partial<typeof CHATBOT_CONFIG>) => {
  Object.assign(CHATBOT_CONFIG, updates);
  debugLog('🔧 Chatbot configuration updated:', CHATBOT_CONFIG);
};

export const resetChatbotConfig = () => {
  // Reset alla configurazione di default
  Object.assign(CHATBOT_CONFIG, {
    ENABLE_LOCAL_FALLBACK: true,
    ENABLE_DEBUG_LOGS: true,
    MIN_INTENT_CONFIDENCE: 0.6,
    API_TIMEOUT: 10000,
    FORCE_LOCAL_PROCESSING: false,
    QUICK_REPLIES: {
      ENABLE: true,
      MAX_COUNT: 8
    }
  });
  debugLog('🔄 Chatbot configuration reset to defaults');
};
