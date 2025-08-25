import { FAQData, FAQItem } from './FAQData';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'solution' | 'error' | 'guide';
  metadata?: any;
}

export class AIResponseGenerator {
  private knowledgeBase = {
    // Comandi e azioni comuni
    commands: {
      'login': 'Per accedere al sistema, utilizza le tue credenziali nella schermata di login. Se hai problemi, clicca su "Password dimenticata".',
      'dashboard': 'La dashboard è la tua home page principale. Mostra un riepilogo completo delle tue finanze con widget personalizzabili.',
      'transactions': 'Le transazioni si gestiscono nella sezione dedicata. Puoi creare, modificare e annullare transazioni.',
      'accounts': 'I conti si gestiscono nella sezione Conti. Puoi creare nuovi conti e visualizzare saldi e movimenti.',
      'reports': 'I report sono disponibili nella sezione Report. Puoi generare report personalizzati e esportarli.',
      'crypto': 'Le criptovalute si gestiscono in Criptovalute > Portafogli. Puoi creare portafogli e tracciare transazioni.',
      'insurance': 'Le assicurazioni si gestiscono nella sezione Assicurazioni. Puoi registrare polizze e tracciare scadenze.',
      'settings': 'Le impostazioni si trovano nel menu principale. Puoi configurare notifiche, sicurezza e preferenze.',
      'help': 'L\'aiuto è sempre disponibile. Puoi consultare le FAQ, la guida o chattare con me per assistenza.'
    },

    // Problemi comuni e soluzioni
    problems: {
      'lento': 'Se il sistema è lento, prova a ricaricare la pagina, pulire la cache del browser o verificare la connessione internet.',
      'errore': 'Se ricevi errori, prova a ricaricare la pagina. Se persistono, contatta il supporto tecnico.',
      'password': 'Per problemi con la password, usa "Password dimenticata" o contatta l\'amministratore.',
      'accesso': 'Se non riesci ad accedere, verifica le credenziali e contatta l\'amministratore se necessario.',
      'dati': 'Se non vedi i dati, verifica i permessi e le impostazioni. Contatta l\'amministratore se necessario.',
      'caricamento': 'Se le pagine non si caricano, verifica la connessione internet e prova a ricaricare.'
    },

    // Suggerimenti e best practices
    tips: {
      'sicurezza': 'Per la sicurezza: usa password forti, cambiale regolarmente, effettua sempre il logout e non condividere le credenziali.',
      'backup': 'Fai backup regolari dei tuoi dati importanti. Il sistema salva automaticamente, ma è meglio essere sicuri.',
      'organizzazione': 'Organizza bene i tuoi conti e transazioni. Usa descrizioni chiare e categorizza tutto correttamente.',
      'monitoraggio': 'Monitora regolarmente la dashboard e i report per tenere sotto controllo le tue finanze.',
      'notifiche': 'Configura le notifiche per non perdere scadenze importanti e aggiornamenti del sistema.'
    }
  };

  async generateResponse(userInput: string, conversationHistory: Message[]): Promise<string> {
    const input = userInput.toLowerCase();
    
    // Cerca nelle FAQ
    const faqMatch = this.findFAQMatch(input);
    if (faqMatch) {
      return this.formatFAQResponse(faqMatch);
    }

    // Cerca nei comandi
    const commandMatch = this.findCommandMatch(input);
    if (commandMatch) {
      return commandMatch;
    }

    // Cerca nei problemi
    const problemMatch = this.findProblemMatch(input);
    if (problemMatch) {
      return problemMatch;
    }

    // Cerca nei suggerimenti
    const tipMatch = this.findTipMatch(input);
    if (tipMatch) {
      return tipMatch;
    }

    // Analisi del contesto della conversazione
    const contextualResponse = this.generateContextualResponse(input, conversationHistory);
    if (contextualResponse) {
      return contextualResponse;
    }

    // Risposta generica ma utile
    return this.generateGenericResponse(input);
  }

  private findFAQMatch(input: string): FAQItem | null {
    // Cerca per parole chiave nelle domande e risposte
    const keywords = input.split(' ').filter(word => word.length > 2);
    
    let bestMatch: FAQItem | null = null;
    let bestScore = 0;

    for (const faq of FAQData) {
      let score = 0;
      
      // Controlla le parole chiave nelle domande
      for (const keyword of keywords) {
        if (faq.question.toLowerCase().includes(keyword)) {
          score += 3; // Peso alto per le domande
        }
        if (faq.answer.toLowerCase().includes(keyword)) {
          score += 2; // Peso medio per le risposte
        }
        if (faq.tags.some(tag => tag.includes(keyword))) {
          score += 1; // Peso basso per i tag
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = faq;
      }
    }

    return bestScore > 2 ? bestMatch : null;
  }

  private findCommandMatch(input: string): string | null {
    for (const [command, response] of Object.entries(this.knowledgeBase.commands)) {
      if (input.includes(command)) {
        return response;
      }
    }
    return null;
  }

  private findProblemMatch(input: string): string | null {
    for (const [problem, solution] of Object.entries(this.knowledgeBase.problems)) {
      if (input.includes(problem)) {
        return solution;
      }
    }
    return null;
  }

  private findTipMatch(input: string): string | null {
    for (const [tip, advice] of Object.entries(this.knowledgeBase.tips)) {
      if (input.includes(tip)) {
        return advice;
      }
    }
    return null;
  }

  private generateContextualResponse(input: string, conversationHistory: Message[]): string | null {
    // Analizza il contesto della conversazione
    const recentMessages = conversationHistory.slice(-3); // Ultimi 3 messaggi
    
    // Se l'utente sta chiedendo chiarimenti
    if (input.includes('cosa') || input.includes('come') || input.includes('quando') || input.includes('dove')) {
      const lastAIMessage = recentMessages.slice().reverse().find(msg => msg.sender === 'ai');
      if (lastAIMessage) {
        return `Per quanto riguarda la tua domanda precedente: ${lastAIMessage.text}\n\nPosso aiutarti con qualcos'altro?`;
      }
    }

    // Se l'utente sta chiedendo aiuto generico
    if (input.includes('aiuto') || input.includes('aiutami') || input.includes('supporto')) {
      return 'Sono qui per aiutarti! Puoi:\n\n• Fare domande specifiche su funzionalità\n• Descrivere problemi che stai riscontrando\n• Chiedere guide passo-passo\n• Consultare le FAQ per domande comuni\n\nCosa ti serve di preciso?';
    }

    return null;
  }

  private generateGenericResponse(input: string): string {
    // Analizza il tipo di input per dare una risposta appropriata
    if (input.includes('grazie') || input.includes('grazie mille')) {
      return 'Prego! Sono felice di aver potuto aiutarti. Se hai altre domande, non esitare a chiedere.';
    }

    if (input.includes('ciao') || input.includes('buongiorno') || input.includes('buonasera')) {
      return 'Ciao! Come posso aiutarti oggi con il Gestionale Finanziario?';
    }

    if (input.includes('funziona') || input.includes('come funziona')) {
      return 'Il Gestionale Finanziario è un sistema completo per gestire:\n\n• Conti e transazioni\n• Criptovalute e investimenti\n• Assicurazioni e scadenze\n• Report e analisi\n\nDimmi su cosa vuoi saperne di più!';
    }

    if (input.includes('difficile') || input.includes('complicato')) {
      return 'Capisco che possa sembrare complicato all\'inizio! Inizia dalle funzionalità base come la dashboard e le transazioni. Posso guidarti passo-passo per qualsiasi operazione. Cosa ti sembra più difficile?';
    }

    if (input.includes('nuovo') || input.includes('prima volta')) {
      return 'Benvenuto! Per iniziare:\n\n1. Esplora la dashboard per familiarizzare\n2. Crea il tuo primo conto\n3. Registra alcune transazioni di prova\n4. Consulta la guida per ogni sezione\n\nPosso aiutarti con qualsiasi di questi passi!';
    }

    // Risposta generica ma utile
    return 'Interessante domanda! Per darti la risposta migliore, potresti:\n\n• Essere più specifico su cosa vuoi sapere\n• Descrivere il problema che stai riscontrando\n• Chiedere una guida per una funzionalità specifica\n\nOppure puoi consultare le FAQ per domande comuni. Come posso aiutarti meglio?';
  }

  private formatFAQResponse(faq: FAQItem): string {
    let response = `${faq.answer}\n\n`;
    
    if (faq.steps && faq.steps.length > 0) {
      response += 'Passi da seguire:\n';
      faq.steps.forEach((step, index) => {
        response += `${index + 1}. ${step}\n`;
      });
      response += '\n';
    }
    
    if (faq.tips) {
      response += `💡 Suggerimento: ${faq.tips}\n\n`;
    }
    
    response += 'Se hai bisogno di ulteriori chiarimenti, fammi sapere!';
    
    return response;
  }

  // Metodo per migliorare le risposte nel tempo
  public learnFromInteraction(userInput: string, userFeedback: 'positive' | 'negative'): void {
    // In un'implementazione reale, questo metodo potrebbe:
    // - Salvare le interazioni per migliorare le risposte future
    // - Aggiornare il knowledge base
    // - Adattare le risposte alle preferenze dell'utente
    console.log(`Learning from interaction: ${userInput} - Feedback: ${userFeedback}`);
  }

  // Metodo per ottenere suggerimenti di domande correlate
  public getRelatedQuestions(topic: string): string[] {
    const related = FAQData
      .filter(faq => 
        faq.question.toLowerCase().includes(topic.toLowerCase()) ||
        faq.tags.some(tag => tag.includes(topic.toLowerCase()))
      )
      .slice(0, 3)
      .map(faq => faq.question);
    
    return related;
  }
}
