export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  steps?: string[];
  tips?: string;
  tags: string[];
}

export const FAQData: FAQItem[] = [
  // Accesso e Autenticazione
  {
    id: 'login-1',
    category: 'Accesso e Autenticazione',
    question: 'Come posso accedere al sistema?',
    answer: 'Per accedere al sistema, utilizza le tue credenziali (username e password) nella schermata di login. Se è la prima volta, contatta l\'amministratore per ricevere le credenziali iniziali.',
    steps: [
      'Vai alla pagina di login',
      'Inserisci il tuo username',
      'Inserisci la tua password',
      'Clicca su "Accedi"'
    ],
    tags: ['login', 'accesso', 'autenticazione']
  },
  {
    id: 'login-2',
    category: 'Accesso e Autenticazione',
    question: 'Ho dimenticato la password, cosa devo fare?',
    answer: 'Se hai dimenticato la password, clicca su "Password dimenticata" nella schermata di login. Riceverai un link per reimpostare la password via email. Se non ricevi l\'email, contatta il supporto tecnico.',
    steps: [
      'Clicca su "Password dimenticata"',
      'Inserisci il tuo username o email',
      'Controlla la tua email per il link di reset',
      'Clicca sul link e imposta una nuova password'
    ],
    tags: ['password', 'reset', 'recupero']
  },
  {
    id: 'login-3',
    category: 'Accesso e Autenticazione',
    question: 'Il sistema non riconosce le mie credenziali',
    answer: 'Verifica di aver inserito correttamente username e password. Controlla che il Caps Lock sia disattivato. Se il problema persiste, contatta l\'amministratore del sistema.',
    tips: 'Prova a copiare e incollare le credenziali per evitare errori di digitazione.',
    tags: ['credenziali', 'errore', 'accesso']
  },

  // Dashboard
  {
    id: 'dashboard-1',
    category: 'Dashboard',
    question: 'Come personalizzare la dashboard?',
    answer: 'Puoi personalizzare la dashboard aggiungendo, rimuovendo o riorganizzando i widget. Clicca sull\'icona delle impostazioni nella dashboard per accedere alle opzioni di personalizzazione.',
    steps: [
      'Clicca sull\'icona delle impostazioni (⚙️)',
      'Seleziona "Personalizza Dashboard"',
      'Trascina i widget per riorganizzarli',
      'Aggiungi o rimuovi widget secondo le tue preferenze',
      'Salva le modifiche'
    ],
    tags: ['dashboard', 'personalizzazione', 'widget']
  },
  {
    id: 'dashboard-2',
    category: 'Dashboard',
    question: 'Non vedo tutti i dati nella dashboard',
    answer: 'La dashboard mostra i dati in base ai tuoi permessi e alle impostazioni. Verifica di avere i permessi necessari per visualizzare tutte le sezioni. Contatta l\'amministratore se ritieni di avere permessi insufficienti.',
    tags: ['dashboard', 'permessi', 'dati']
  },

  // Transazioni
  {
    id: 'transactions-1',
    category: 'Transazioni',
    question: 'Come registrare una nuova transazione?',
    answer: 'Per registrare una nuova transazione, vai nella sezione Transazioni e clicca su "Nuova Transazione". Compila tutti i campi richiesti e salva.',
    steps: [
      'Vai su Transazioni > Nuova Transazione',
      'Seleziona il tipo di transazione',
      'Inserisci l\'importo',
      'Seleziona la data',
      'Inserisci la descrizione',
      'Seleziona il conto di origine e destinazione',
      'Clicca su "Salva"'
    ],
    tags: ['transazioni', 'nuova', 'registrazione']
  },
  {
    id: 'transactions-2',
    category: 'Transazioni',
    question: 'Come modificare una transazione esistente?',
    answer: 'Per modificare una transazione, vai nella lista delle transazioni, trova quella da modificare e clicca sull\'icona di modifica (✏️). Apporta le modifiche necessarie e salva.',
    steps: [
      'Vai su Transazioni > Lista Transazioni',
      'Trova la transazione da modificare',
      'Clicca sull\'icona di modifica',
      'Apporta le modifiche',
      'Clicca su "Salva"'
    ],
    tags: ['transazioni', 'modifica', 'aggiornamento']
  },
  {
    id: 'transactions-3',
    category: 'Transazioni',
    question: 'Come annullare una transazione?',
    answer: 'Per annullare una transazione, vai nella lista delle transazioni, trova quella da annullare e clicca sull\'icona di annullamento (❌). Conferma l\'operazione.',
    steps: [
      'Vai su Transazioni > Lista Transazioni',
      'Trova la transazione da annullare',
      'Clicca sull\'icona di annullamento',
      'Conferma l\'operazione',
      'La transazione verrà marcata come annullata'
    ],
    tips: 'Le transazioni annullate rimangono visibili per motivi di audit, ma non influenzano i saldi.',
    tags: ['transazioni', 'annullamento', 'cancellazione']
  },

  // Conti
  {
    id: 'accounts-1',
    category: 'Conti',
    question: 'Come creare un nuovo conto?',
    answer: 'Per creare un nuovo conto, vai nella sezione Conti e clicca su "Nuovo Conto". Compila le informazioni richieste e salva.',
    steps: [
      'Vai su Conti > Nuovo Conto',
      'Inserisci il nome del conto',
      'Seleziona il tipo di conto',
      'Inserisci la valuta',
      'Imposta il saldo iniziale (se applicabile)',
      'Clicca su "Salva"'
    ],
    tags: ['conti', 'nuovo', 'creazione']
  },
  {
    id: 'accounts-2',
    category: 'Conti',
    question: 'Come visualizzare il saldo di un conto?',
    answer: 'Il saldo di ogni conto è visibile nella sezione Conti. Puoi anche vedere i movimenti dettagliati cliccando sul nome del conto.',
    tags: ['conti', 'saldo', 'visualizzazione']
  },

  // Criptovalute
  {
    id: 'crypto-1',
    category: 'Criptovalute',
    question: 'Come creare un portafoglio di criptovalute?',
    answer: 'Per creare un portafoglio di criptovalute, vai nella sezione Criptovalute > Portafogli e clicca su "Nuovo Portafoglio". Seleziona la criptovaluta e inserisci le informazioni richieste.',
    steps: [
      'Vai su Criptovalute > Portafogli',
      'Clicca su "Nuovo Portafoglio"',
      'Seleziona la criptovaluta',
      'Inserisci il nome del portafoglio',
      'Inserisci l\'indirizzo del wallet (opzionale)',
      'Clicca su "Salva"'
    ],
    tags: ['criptovalute', 'portafoglio', 'nuovo']
  },
  {
    id: 'crypto-2',
    category: 'Criptovalute',
    question: 'Come tracciare le transazioni crypto?',
    answer: 'Le transazioni crypto vengono tracciate automaticamente quando le registri. Puoi visualizzarle nella sezione Criptovalute > Transazioni.',
    steps: [
      'Vai su Criptovalute > Transazioni',
      'Clicca su "Nuova Transazione"',
      'Seleziona il tipo (acquisto, vendita, trasferimento)',
      'Inserisci l\'importo e la criptovaluta',
      'Seleziona il portafoglio',
      'Clicca su "Salva"'
    ],
    tags: ['criptovalute', 'transazioni', 'tracciamento']
  },

  // Report
  {
    id: 'reports-1',
    category: 'Report',
    question: 'Come generare un report personalizzato?',
    answer: 'Per generare un report personalizzato, vai nella sezione Report e clicca su "Nuovo Report". Seleziona i parametri desiderati e genera il report.',
    steps: [
      'Vai su Report > Nuovo Report',
      'Seleziona il tipo di report',
      'Imposta il periodo di riferimento',
      'Seleziona i conti da includere',
      'Configura i filtri desiderati',
      'Clicca su "Genera Report"'
    ],
    tags: ['report', 'personalizzato', 'generazione']
  },
  {
    id: 'reports-2',
    category: 'Report',
    question: 'In quali formati posso esportare i report?',
    answer: 'I report possono essere esportati in diversi formati: PDF, Excel (XLSX), CSV e HTML. Seleziona il formato desiderato quando generi il report.',
    tags: ['report', 'esportazione', 'formati']
  },

  // Assicurazioni
  {
    id: 'insurance-1',
    category: 'Assicurazioni',
    question: 'Come registrare una nuova polizza assicurativa?',
    answer: 'Per registrare una nuova polizza, vai nella sezione Assicurazioni e clicca su "Nuova Polizza". Compila tutti i dettagli della polizza e salva.',
    steps: [
      'Vai su Assicurazioni > Nuova Polizza',
      'Seleziona il tipo di assicurazione',
      'Inserisci i dati della compagnia assicurativa',
      'Inserisci i dettagli della polizza',
      'Imposta le date di inizio e fine',
      'Inserisci il premio e la franchigia',
      'Clicca su "Salva"'
    ],
    tags: ['assicurazioni', 'polizza', 'nuova']
  },
  {
    id: 'insurance-2',
    category: 'Assicurazioni',
    question: 'Come gestire le scadenze delle polizze?',
    answer: 'Le scadenze delle polizze vengono tracciate automaticamente. Puoi visualizzarle nella dashboard e ricevere notifiche quando si avvicinano le scadenze.',
    steps: [
      'Configura le notifiche nelle impostazioni',
      'Imposta i giorni di preavviso per le scadenze',
      'Controlla regolarmente la dashboard per le scadenze imminenti'
    ],
    tags: ['assicurazioni', 'scadenze', 'notifiche']
  },

  // Fondi
  {
    id: 'funds-1',
    category: 'Fondi',
    question: 'Come monitorare la performance dei fondi?',
    answer: 'La performance dei fondi è visibile nella sezione Fondi. Puoi visualizzare grafici, statistiche e confronti tra diversi fondi.',
    steps: [
      'Vai su Fondi > Performance',
      'Seleziona i fondi da monitorare',
      'Imposta il periodo di riferimento',
      'Visualizza i grafici e le statistiche'
    ],
    tags: ['fondi', 'performance', 'monitoraggio']
  },

  // Problemi Tecnici
  {
    id: 'technical-1',
    category: 'Problemi Tecnici',
    question: 'La pagina si carica lentamente, cosa posso fare?',
    answer: 'Se la pagina si carica lentamente, prova a ricaricare la pagina, pulire la cache del browser o verificare la connessione internet. Se il problema persiste, contatta il supporto tecnico.',
    steps: [
      'Ricarica la pagina (F5 o Ctrl+R)',
      'Pulisci la cache del browser',
      'Verifica la connessione internet',
      'Prova con un browser diverso',
      'Contatta il supporto se il problema persiste'
    ],
    tags: ['tecnico', 'lentezza', 'caricamento']
  },
  {
    id: 'technical-2',
    category: 'Problemi Tecnici',
    question: 'Ricevo errori JavaScript, come risolverli?',
    answer: 'Gli errori JavaScript possono essere risolti ricaricando la pagina o pulendo la cache del browser. Se persistono, prova con un browser diverso o contatta il supporto.',
    steps: [
      'Ricarica la pagina',
      'Pulisci la cache del browser',
      'Disabilita temporaneamente le estensioni',
      'Prova con un browser diverso'
    ],
    tags: ['tecnico', 'javascript', 'errori']
  },

  // Sicurezza
  {
    id: 'security-1',
    category: 'Sicurezza',
    question: 'Come proteggere il mio account?',
    answer: 'Per proteggere il tuo account, utilizza una password forte, cambiala regolarmente e non condividerla con altri. Abilita l\'autenticazione a due fattori se disponibile.',
    steps: [
      'Utilizza una password forte (almeno 8 caratteri)',
      'Cambia la password regolarmente',
      'Non condividere le credenziali',
      'Abilita l\'autenticazione a due fattori',
      'Effettua sempre il logout quando hai finito'
    ],
    tags: ['sicurezza', 'password', 'protezione']
  },

  // Backup e Sincronizzazione
  {
    id: 'backup-1',
    category: 'Backup e Sincronizzazione',
    question: 'I miei dati vengono salvati automaticamente?',
    answer: 'Sì, i tuoi dati vengono salvati automaticamente quando effettui operazioni come salvare transazioni, creare conti, ecc. È comunque consigliabile effettuare backup regolari.',
    tags: ['backup', 'salvataggio', 'automatico']
  },

  // Notifiche
  {
    id: 'notifications-1',
    category: 'Notifiche',
    question: 'Come configurare le notifiche?',
    answer: 'Per configurare le notifiche, vai nelle Impostazioni > Notifiche. Puoi scegliere quali notifiche ricevere e come riceverle (email, push, ecc.).',
    steps: [
      'Vai su Impostazioni > Notifiche',
      'Seleziona i tipi di notifica desiderati',
      'Configura i canali di notifica',
      'Imposta le preferenze per ogni tipo',
      'Salva le impostazioni'
    ],
    tags: ['notifiche', 'configurazione', 'impostazioni']
  },

  // Importazione/Esportazione
  {
    id: 'import-export-1',
    category: 'Importazione/Esportazione',
    question: 'Posso importare dati da altri sistemi?',
    answer: 'Sì, puoi importare dati da altri sistemi utilizzando i formati supportati (CSV, Excel). Vai su Impostazioni > Importazione per iniziare il processo.',
    steps: [
      'Vai su Impostazioni > Importazione',
      'Seleziona il tipo di dati da importare',
      'Carica il file (CSV o Excel)',
      'Mappa i campi correttamente',
      'Rivedi i dati prima dell\'importazione',
      'Conferma l\'importazione'
    ],
    tags: ['importazione', 'dati', 'sistemi']
  },

  // Permessi e Ruoli
  {
    id: 'permissions-1',
    category: 'Permessi e Ruoli',
    question: 'Come gestire i permessi degli utenti?',
    answer: 'La gestione dei permessi è disponibile per gli amministratori. Puoi assegnare ruoli e permessi specifici a ogni utente nelle Impostazioni > Utenti e Permessi.',
    tags: ['permessi', 'ruoli', 'amministrazione']
  },

  // Supporto e Contatti
  {
    id: 'support-1',
    category: 'Supporto e Contatti',
    question: 'Come contattare il supporto tecnico?',
    answer: 'Puoi contattare il supporto tecnico in diversi modi:\n\n• **Call Center**: +39 800 123 456 (Lun-Ven 8:00-20:00, Sab 9:00-17:00)\n• **Chat AI**: Utilizza questo assistente per domande comuni\n• **Email**: support@gestionale-finanziario.com\n• **Ticket**: Crea un ticket di supporto nelle Impostazioni',
    steps: [
      'Per problemi urgenti, chiama il call center',
      'Per domande generali, usa l\'assistente AI',
      'Per problemi complessi, invia una email',
      'Per richieste specifiche, crea un ticket'
    ],
    tips: 'Il call center è disponibile anche per assistenza in tempo reale e supporto operativo.',
    tags: ['supporto', 'contatti', 'call center', 'assistenza']
  },
  {
    id: 'support-2',
    category: 'Supporto e Contatti',
    question: 'Quali sono gli orari del call center?',
    answer: 'Il call center è disponibile nei seguenti orari:\n\n• **Lunedì - Venerdì**: 8:00 - 20:00\n• **Sabato**: 9:00 - 17:00\n• **Domenica**: Chiuso\n\nPer assistenza fuori orario, puoi utilizzare l\'assistente AI o inviare una email.',
    tags: ['call center', 'orari', 'supporto', 'assistenza']
  },
  {
    id: 'support-3',
    category: 'Supporto e Contatti',
    question: 'Quando devo chiamare il call center invece di usare l\'AI?',
    answer: 'Chiama il call center quando:\n\n• Hai problemi urgenti che bloccano il lavoro\n• Devi parlare con un operatore specializzato\n• Hai richieste complesse che richiedono assistenza umana\n• Devi segnalare bug o problemi tecnici critici\n• Hai bisogno di supporto per configurazioni avanzate\n\nUsa l\'assistente AI per:\n\n• Domande generali sul funzionamento\n• Guide passo-passo per operazioni comuni\n• Consultazione delle FAQ\n• Risoluzione di problemi semplici',
    tags: ['call center', 'ai', 'supporto', 'quando chiamare']
  }
];
