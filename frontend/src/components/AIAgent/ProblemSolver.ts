interface ProblemSolution {
  problem: string;
  solution: string;
  steps: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  estimatedTime: string;
  requiresAdmin?: boolean;
}

interface ProblemData {
  patterns: string[];
  solutions: ProblemSolution[];
}

export class ProblemSolver {
  private problemPatterns: Record<string, ProblemData> = {
    // Problemi di accesso
    access: {
      patterns: ['non riesco ad accedere', 'accesso negato', 'login fallito', 'credenziali errate'],
      solutions: [
        {
          problem: 'Problema di accesso al sistema',
          solution: 'Verifica le credenziali e riprova l\'accesso',
          steps: [
            'Controlla di aver inserito username e password corretti',
            'Verifica che il Caps Lock sia disattivato',
            'Prova a copiare e incollare le credenziali',
            'Se il problema persiste, usa "Password dimenticata"'
          ],
          priority: 'high' as const,
          category: 'Accesso',
          estimatedTime: '2-5 minuti'
        }
      ]
    },

    // Problemi di performance
    performance: {
      patterns: ['lento', 'carica lentamente', 'performance scadente', 'blocchi'],
      solutions: [
        {
          problem: 'Sistema lento o che si blocca',
          solution: 'Ottimizza le prestazioni del browser e verifica la connessione',
          steps: [
            'Ricarica la pagina (F5 o Ctrl+R)',
            'Pulisci la cache del browser',
            'Chiudi altre schede non necessarie',
            'Verifica la connessione internet',
            'Prova con un browser diverso'
          ],
          priority: 'medium' as const,
          category: 'Performance',
          estimatedTime: '5-10 minuti'
        }
      ]
    },

    // Problemi di dati
    data: {
      patterns: ['dati mancanti', 'non vedo i dati', 'dati sbagliati', 'salvataggio fallito'],
      solutions: [
        {
          problem: 'Dati mancanti o non visualizzati',
          solution: 'Verifica i permessi e le impostazioni di visualizzazione',
          steps: [
            'Controlla di avere i permessi necessari',
            'Verifica i filtri applicati',
            'Controlla le impostazioni di visualizzazione',
            'Ricarica la pagina',
            'Contatta l\'amministratore se necessario'
          ],
          priority: 'medium' as const,
          category: 'Dati',
          estimatedTime: '3-8 minuti'
        }
      ]
    },

    // Problemi di transazioni
    transactions: {
      patterns: ['transazione non salvata', 'errore transazione', 'transazione duplicata'],
      solutions: [
        {
          problem: 'Problema con le transazioni',
          solution: 'Verifica i dati inseriti e riprova il salvataggio',
          steps: [
            'Controlla che tutti i campi obbligatori siano compilati',
            'Verifica che l\'importo sia corretto',
            'Controlla le date e i conti selezionati',
            'Riprova a salvare la transazione',
            'Se l\'errore persiste, contatta il supporto'
          ],
          priority: 'medium',
          category: 'Transazioni',
          estimatedTime: '5-15 minuti'
        }
      ]
    },

    // Problemi di report
    reports: {
      patterns: ['report non generato', 'errore report', 'dati report sbagliati'],
      solutions: [
        {
          problem: 'Problema con la generazione dei report',
          solution: 'Verifica i parametri e riprova la generazione',
          steps: [
            'Controlla i parametri del report',
            'Verifica il periodo selezionato',
            'Controlla i filtri applicati',
            'Riprova a generare il report',
            'Se il problema persiste, prova con parametri diversi'
          ],
          priority: 'low' as const,
          category: 'Report',
          estimatedTime: '3-10 minuti'
        }
      ]
    },

    // Problemi di criptovalute
    crypto: {
      patterns: ['wallet non creato', 'transazione crypto fallita', 'prezzo crypto sbagliato'],
      solutions: [
        {
          problem: 'Problema con le criptovalute',
          solution: 'Verifica i dati del wallet e riprova l\'operazione',
          steps: [
            'Controlla i dati del wallet inseriti',
            'Verifica la connessione ai servizi crypto',
            'Controlla che la criptovaluta sia supportata',
            'Riprova l\'operazione',
            'Se il problema persiste, contatta il supporto'
          ],
          priority: 'medium' as const,
          category: 'Criptovalute',
          estimatedTime: '5-15 minuti'
        }
      ]
    },

    // Problemi di assicurazioni
    insurance: {
      patterns: ['polizza non salvata', 'scadenza non tracciata', 'errore assicurazione'],
      solutions: [
        {
          problem: 'Problema con le assicurazioni',
          solution: 'Verifica i dati della polizza e riprova il salvataggio',
          steps: [
            'Controlla tutti i dati della polizza',
            'Verifica le date di inizio e fine',
            'Controlla i premi e le franchigie',
            'Riprova a salvare la polizza',
            'Se l\'errore persiste, contatta il supporto'
          ],
          priority: 'medium' as const,
          category: 'Assicurazioni',
          estimatedTime: '5-15 minuti'
        }
      ]
    },

    // Problemi di notifiche
    notifications: {
      patterns: ['non ricevo notifiche', 'notifiche sbagliate', 'troppe notifiche'],
      solutions: [
        {
          problem: 'Problema con le notifiche',
          solution: 'Configura correttamente le impostazioni delle notifiche',
          steps: [
            'Vai su Impostazioni > Notifiche',
            'Verifica i tipi di notifica abilitati',
            'Controlla i canali di notifica',
            'Imposta le preferenze per ogni tipo',
            'Salva le impostazioni'
          ],
          priority: 'low' as const,
          category: 'Notifiche',
          estimatedTime: '3-8 minuti'
        }
      ]
    },

    // Problemi di sicurezza
    security: {
      patterns: ['account bloccato', 'sospetta attività', 'password non sicura'],
      solutions: [
        {
          problem: 'Problema di sicurezza',
          solution: 'Verifica la sicurezza dell\'account e contatta l\'amministratore',
          steps: [
            'Cambia immediatamente la password',
            'Verifica le attività recenti dell\'account',
            'Contatta l\'amministratore del sistema',
            'Abilita l\'autenticazione a due fattori se disponibile',
            'Monitora l\'account per attività sospette'
          ],
          priority: 'critical' as const,
          category: 'Sicurezza',
          estimatedTime: '10-30 minuti',
          requiresAdmin: true
        }
      ]
    }
  };

  async analyzeAndSolve(userInput: string): Promise<ProblemSolution | null> {
    const input = userInput.toLowerCase();
    
    // Cerca pattern di problemi
    for (const [category, problemData] of Object.entries(this.problemPatterns)) {
      for (const pattern of problemData.patterns) {
        if (input.includes(pattern)) {
          return problemData.solutions[0]; // Restituisce la prima soluzione per quel pattern
        }
      }
    }

    // Analisi avanzata del testo
    const advancedAnalysis = this.performAdvancedAnalysis(input);
    if (advancedAnalysis) {
      return advancedAnalysis;
    }

    return null; // Nessun problema identificato
  }

  private performAdvancedAnalysis(input: string): ProblemSolution | null {
    // Analisi basata su parole chiave e contesto
    const keywords = input.split(' ').filter(word => word.length > 3);
    
    // Problemi di sistema
    if (keywords.some(word => ['sistema', 'applicazione', 'programma'].includes(word)) &&
        keywords.some(word => ['non', 'non funziona', 'errore', 'problema'].includes(word))) {
      return {
        problem: 'Problema generico del sistema',
        solution: 'Ricarica l\'applicazione e verifica la connessione',
        steps: [
          'Ricarica la pagina (F5)',
          'Verifica la connessione internet',
          'Pulisci la cache del browser',
          'Prova con un browser diverso',
          'Contatta il supporto se il problema persiste'
        ],
        priority: 'medium' as const,
        category: 'Sistema',
        estimatedTime: '5-15 minuti'
      };
    }

    // Problemi di dati
    if (keywords.some(word => ['dati', 'informazioni', 'file'].includes(word)) &&
        keywords.some(word => ['persi', 'mancanti', 'sbagliati'].includes(word))) {
      return {
        problem: 'Problema con i dati',
        solution: 'Verifica i permessi e controlla le impostazioni',
        steps: [
          'Controlla i permessi dell\'utente',
          'Verifica le impostazioni di visualizzazione',
          'Controlla i filtri applicati',
          'Ricarica la pagina',
          'Contatta l\'amministratore se necessario'
        ],
        priority: 'high' as const,
        category: 'Dati',
        estimatedTime: '5-20 minuti'
      };
    }

    // Problemi di accesso
    if (keywords.some(word => ['accedere', 'entrare', 'login'].includes(word)) &&
        keywords.some(word => ['non', 'impossibile', 'bloccato'].includes(word))) {
      return {
        problem: 'Problema di accesso',
        solution: 'Verifica le credenziali e riprova l\'accesso',
        steps: [
          'Controlla username e password',
          'Verifica che il Caps Lock sia disattivato',
          'Prova a copiare e incollare le credenziali',
          'Usa "Password dimenticata" se necessario',
          'Contatta l\'amministratore se il problema persiste'
        ],
        priority: 'high' as const,
        category: 'Accesso',
        estimatedTime: '3-10 minuti'
      };
    }

    return null;
  }

  // Metodo per ottenere suggerimenti di prevenzione
  public getPreventionTips(category: string): string[] {
    const preventionTips = {
      'Accesso': [
        'Utilizza password forti e cambiale regolarmente',
        'Non condividere mai le credenziali',
        'Effettua sempre il logout quando hai finito',
        'Abilita l\'autenticazione a due fattori se disponibile'
      ],
      'Performance': [
        'Pulisci regolarmente la cache del browser',
        'Chiudi le schede non necessarie',
        'Utilizza una connessione internet stabile',
        'Aggiorna regolarmente il browser'
      ],
      'Dati': [
        'Fai backup regolari dei dati importanti',
        'Verifica regolarmente i permessi',
        'Controlla le impostazioni di visualizzazione',
        'Organizza bene i dati con categorie e tag'
      ],
      'Sicurezza': [
        'Cambia regolarmente la password',
        'Non accedere da dispositivi pubblici',
        'Monitora le attività dell\'account',
        'Segnala immediatamente attività sospette'
      ]
    };

    return preventionTips[category as keyof typeof preventionTips] || [
      'Mantieni il sistema aggiornato',
      'Consulta regolarmente la documentazione',
      'Contatta il supporto per problemi persistenti'
    ];
  }

  // Metodo per ottenere problemi correlati
  public getRelatedProblems(problem: string): string[] {
    const relatedProblems = {
      'Accesso': ['Password dimenticata', 'Account bloccato', 'Permessi insufficienti'],
      'Performance': ['Pagina lenta', 'Sistema che si blocca', 'Caricamento fallito'],
      'Dati': ['Dati mancanti', 'Salvataggio fallito', 'Sincronizzazione errori'],
      'Transazioni': ['Transazione non salvata', 'Dati errati', 'Duplicazione'],
      'Report': ['Generazione fallita', 'Dati incompleti', 'Formato non supportato']
    };

    return relatedProblems[problem as keyof typeof relatedProblems] || [
      'Problema generico del sistema',
      'Errore di connessione',
      'Problema di configurazione'
    ];
  }

  // Metodo per valutare la gravità del problema
  public assessProblemSeverity(input: string): 'low' | 'medium' | 'high' | 'critical' {
    const criticalKeywords = ['bloccato', 'critico', 'urgente', 'emergenza', 'sicurezza'];
    const highKeywords = ['non funziona', 'errore', 'fallito', 'impossibile'];
    const mediumKeywords = ['lento', 'problema', 'difficoltà', 'non riesco'];
    
    if (criticalKeywords.some(keyword => input.includes(keyword))) {
      return 'critical';
    } else if (highKeywords.some(keyword => input.includes(keyword))) {
      return 'high';
    } else if (mediumKeywords.some(keyword => input.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  }
}
