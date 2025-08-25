import { FAQData, FAQItem } from './FAQData';

export interface LearningData {
  question: string;
  userFeedback: 'positive' | 'negative' | 'neutral';
  responseQuality: number; // 1-10
  userSatisfaction: number; // 1-5
  timestamp: Date;
  context: string;
  keywords: string[];
  category: string;
  responseTime: number; // in millisecondi
  followUpQuestions: string[];
  resolutionSuccess: boolean;
}

export interface AIPattern {
  pattern: string;
  confidence: number; // 0-1
  successRate: number; // 0-1
  usageCount: number;
  lastUsed: Date;
  relatedPatterns: string[];
  category: string;
  keywords: string[];
}

export interface LearningMetrics {
  totalInteractions: number;
  positiveFeedback: number;
  negativeFeedback: number;
  averageSatisfaction: number;
  responseAccuracy: number;
  popularQuestions: Array<{ question: string; count: number }>;
  problemCategories: Array<{ category: string; count: number; avgSatisfaction: number }>;
  userBehavior: {
    commonKeywords: Array<{ keyword: string; frequency: number }>;
    sessionPatterns: Array<{ pattern: string; frequency: number }>;
    timeOfDay: Array<{ hour: number; activity: number }>;
  };
}

export class AILearningEngine {
  private learningData: LearningData[] = [];
  private patterns: AIPattern[] = [];
  private knowledgeBase: Map<string, any> = new Map();
  private userPreferences: Map<string, any> = new Map();
  private sessionContext: Map<string, any> = new Map();

  constructor() {
    this.initializePatterns();
    this.loadLearningData();
  }

  /**
   * Inizializza i pattern base per l'apprendimento
   */
  private initializePatterns(): void {
    // Pattern per problemi comuni
    const basePatterns = [
      {
        pattern: 'login|accesso|entrare',
        confidence: 0.8,
        successRate: 0.9,
        usageCount: 0,
        lastUsed: new Date(),
        relatedPatterns: ['password', 'credenziali', 'autenticazione'],
        category: 'Accesso',
        keywords: ['login', 'accesso', 'entrare', 'autenticazione']
      },
      {
        pattern: 'transazione|pagamento|bonifico',
        confidence: 0.7,
        successRate: 0.85,
        usageCount: 0,
        lastUsed: new Date(),
        relatedPatterns: ['conto', 'saldo', 'movimento'],
        category: 'Transazioni',
        keywords: ['transazione', 'pagamento', 'bonifico', 'conto']
      },
      {
        pattern: 'errore|problema|non funziona',
        confidence: 0.6,
        successRate: 0.75,
        usageCount: 0,
        lastUsed: new Date(),
        relatedPatterns: ['sistema', 'applicazione', 'bug'],
        category: 'Problemi Tecnici',
        keywords: ['errore', 'problema', 'bug', 'sistema']
      }
    ];

    this.patterns = basePatterns;
  }

  /**
   * Carica i dati di apprendimento dal localStorage
   */
  private loadLearningData(): void {
    try {
      const savedData = localStorage.getItem('ai_learning_data');
      if (savedData) {
        this.learningData = JSON.parse(savedData).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      }

      const savedPatterns = localStorage.getItem('ai_patterns');
      if (savedPatterns) {
        this.patterns = JSON.parse(savedPatterns).map((pattern: any) => ({
          ...pattern,
          lastUsed: new Date(pattern.lastUsed)
        }));
      }

      const savedKnowledge = localStorage.getItem('ai_knowledge_base');
      if (savedKnowledge) {
        this.knowledgeBase = new Map(JSON.parse(savedKnowledge));
      }

      const savedPreferences = localStorage.getItem('ai_user_preferences');
      if (savedPreferences) {
        this.userPreferences = new Map(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.warn('Errore nel caricamento dei dati di apprendimento:', error);
    }
  }

  /**
   * Salva i dati di apprendimento nel localStorage
   */
  private saveLearningData(): void {
    try {
      localStorage.setItem('ai_learning_data', JSON.stringify(this.learningData));
      localStorage.setItem('ai_patterns', JSON.stringify(this.patterns));
      localStorage.setItem('ai_knowledge_base', JSON.stringify(Array.from(this.knowledgeBase.entries())));
      localStorage.setItem('ai_user_preferences', JSON.stringify(Array.from(this.userPreferences.entries())));
    } catch (error) {
      console.warn('Errore nel salvataggio dei dati di apprendimento:', error);
    }
  }

  /**
   * Registra un'interazione dell'utente per l'apprendimento
   */
  public recordInteraction(
    question: string,
    response: string,
    userFeedback: 'positive' | 'negative' | 'neutral',
    context: string = '',
    responseTime: number = 0
  ): void {
    const interaction: LearningData = {
      question: question.toLowerCase(),
      userFeedback,
      responseQuality: this.calculateResponseQuality(response, userFeedback),
      userSatisfaction: this.mapFeedbackToSatisfaction(userFeedback),
      timestamp: new Date(),
      context,
      keywords: this.extractKeywords(question),
      category: this.categorizeQuestion(question),
      responseTime,
      followUpQuestions: this.generateFollowUpQuestions(question, response),
      resolutionSuccess: userFeedback === 'positive'
    };

    this.learningData.push(interaction);
    this.updatePatterns(interaction);
    this.updateKnowledgeBase(interaction);
    this.saveLearningData();
  }

  /**
   * Calcola la qualità della risposta basandosi sul feedback
   */
  private calculateResponseQuality(response: string, feedback: 'positive' | 'negative' | 'neutral'): number {
    let baseQuality = 5; // Qualità base media

    switch (feedback) {
      case 'positive':
        baseQuality += 3;
        break;
      case 'negative':
        baseQuality -= 3;
        break;
      case 'neutral':
        baseQuality += 0;
        break;
    }

    // Fattori aggiuntivi per la qualità
    if (response.length > 100) baseQuality += 1; // Risposta dettagliata
    if (response.includes('passo') || response.includes('step')) baseQuality += 1; // Include passi
    if (response.includes('💡') || response.includes('suggerimento')) baseQuality += 1; // Include suggerimenti

    return Math.max(1, Math.min(10, baseQuality));
  }

  /**
   * Mappa il feedback a un livello di soddisfazione
   */
  private mapFeedbackToSatisfaction(feedback: 'positive' | 'negative' | 'neutral'): number {
    switch (feedback) {
      case 'positive': return 5;
      case 'neutral': return 3;
      case 'negative': return 1;
      default: return 3;
    }
  }

  /**
   * Estrae parole chiave dalla domanda
   */
  private extractKeywords(question: string): string[] {
    const stopWords = ['come', 'cosa', 'quando', 'dove', 'perché', 'chi', 'quale', 'quali', 'il', 'la', 'lo', 'gli', 'le', 'di', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra', 'a', 'e', 'o', 'ma', 'se', 'che', 'non', 'sono', 'essere', 'avere', 'fare', 'dire', 'andare', 'venire', 'stare', 'potere', 'volere', 'dovere'];
    
    return question
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 5); // Massimo 5 parole chiave
  }

  /**
   * Categorizza la domanda
   */
  private categorizeQuestion(question: string): string {
    const categories = {
      'Accesso': ['login', 'accesso', 'password', 'credenziali'],
      'Transazioni': ['transazione', 'pagamento', 'bonifico', 'conto', 'saldo'],
      'Criptovalute': ['crypto', 'bitcoin', 'wallet', 'portafoglio'],
      'Assicurazioni': ['assicurazione', 'polizza', 'scadenza'],
      'Report': ['report', 'grafico', 'statistica', 'analisi'],
      'Problemi Tecnici': ['errore', 'problema', 'bug', 'lento', 'non funziona'],
      'Supporto': ['aiuto', 'supporto', 'contatto', 'call center']
    };

    const questionLower = question.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => questionLower.includes(keyword))) {
        return category;
      }
    }

    return 'Generale';
  }

  /**
   * Genera domande di follow-up
   */
  private generateFollowUpQuestions(question: string, response: string): string[] {
    const followUps: string[] = [];
    
    if (question.includes('come')) {
      followUps.push('Hai bisogno di ulteriori chiarimenti?');
      followUps.push('Vuoi che ti mostri un esempio pratico?');
    }
    
    if (question.includes('problema') || question.includes('errore')) {
      followUps.push('Il problema è stato risolto?');
      followUps.push('Hai bisogno di assistenza tecnica?');
    }
    
    if (response.includes('passo')) {
      followUps.push('Hai completato tutti i passi?');
      followUps.push('Quale passo ti sembra più difficile?');
    }
    
    return followUps.slice(0, 3); // Massimo 3 follow-up
  }

  /**
   * Aggiorna i pattern basandosi sulle interazioni
   */
  private updatePatterns(interaction: LearningData): void {
    const question = interaction.question;
    
    // Cerca pattern esistenti
    let patternFound = false;
    
    for (const pattern of this.patterns) {
      if (this.matchesPattern(question, pattern.pattern)) {
        pattern.usageCount++;
        pattern.lastUsed = new Date();
        pattern.successRate = this.calculateNewSuccessRate(pattern, interaction);
        pattern.confidence = this.calculateNewConfidence(pattern, interaction);
        patternFound = true;
        break;
      }
    }
    
    // Se non trova pattern, crea uno nuovo
    if (!patternFound) {
      const newPattern: AIPattern = {
        pattern: this.createPatternFromQuestion(question),
        confidence: 0.5,
        successRate: interaction.resolutionSuccess ? 1 : 0,
        usageCount: 1,
        lastUsed: new Date(),
        relatedPatterns: this.findRelatedPatterns(question),
        category: interaction.category,
        keywords: interaction.keywords
      };
      
      this.patterns.push(newPattern);
    }
  }

  /**
   * Verifica se una domanda corrisponde a un pattern
   */
  private matchesPattern(question: string, pattern: string): boolean {
    const keywords = pattern.split('|');
    return keywords.some(keyword => question.includes(keyword));
  }

  /**
   * Calcola il nuovo tasso di successo
   */
  private calculateNewSuccessRate(pattern: AIPattern, interaction: LearningData): number {
    const totalInteractions = pattern.usageCount;
    const currentSuccess = pattern.successRate * (totalInteractions - 1);
    const newSuccess = interaction.resolutionSuccess ? 1 : 0;
    
    return (currentSuccess + newSuccess) / totalInteractions;
  }

  /**
   * Calcola la nuova confidenza
   */
  private calculateNewConfidence(pattern: AIPattern, interaction: LearningData): number {
    const baseConfidence = pattern.confidence;
    const feedbackMultiplier = interaction.userFeedback === 'positive' ? 1.1 : 0.9;
    const usageMultiplier = Math.min(1.2, 1 + (pattern.usageCount * 0.01));
    
    return Math.min(1, Math.max(0, baseConfidence * feedbackMultiplier * usageMultiplier));
  }

  /**
   * Crea un nuovo pattern da una domanda
   */
  private createPatternFromQuestion(question: string): string {
    const words = question.split(/\s+/).filter(word => word.length > 3);
    return words.slice(0, 3).join('|'); // Massimo 3 parole chiave
  }

  /**
   * Trova pattern correlati
   */
  private findRelatedPatterns(question: string): string[] {
    return this.patterns
      .filter(pattern => 
        pattern.keywords.some(keyword => question.includes(keyword)) ||
        pattern.category === this.categorizeQuestion(question)
      )
      .map(pattern => pattern.pattern)
      .slice(0, 3);
  }

  /**
   * Aggiorna la knowledge base
   */
  private updateKnowledgeBase(interaction: LearningData): void {
    const key = `${interaction.category}:${interaction.keywords.join(',')}`;
    
    if (this.knowledgeBase.has(key)) {
      const existing = this.knowledgeBase.get(key);
      existing.count++;
      existing.avgSatisfaction = (existing.avgSatisfaction + interaction.userSatisfaction) / 2;
      existing.lastUsed = new Date();
    } else {
      this.knowledgeBase.set(key, {
        count: 1,
        avgSatisfaction: interaction.userSatisfaction,
        firstUsed: new Date(),
        lastUsed: new Date(),
        category: interaction.category,
        keywords: interaction.keywords
      });
    }
  }

  /**
   * Ottiene suggerimenti per migliorare le risposte
   */
  public getImprovementSuggestions(): string[] {
    const suggestions: string[] = [];
    
    // Analizza i pattern con bassa confidenza
    const lowConfidencePatterns = this.patterns.filter(p => p.confidence < 0.6);
    if (lowConfidencePatterns.length > 0) {
      suggestions.push(`Considera di migliorare le risposte per: ${lowConfidencePatterns.map(p => p.category).join(', ')}`);
    }
    
    // Analizza le categorie con bassa soddisfazione
    const categorySatisfaction = this.calculateCategorySatisfaction();
    const lowSatisfactionCategories = Object.entries(categorySatisfaction)
      .filter(([_, satisfaction]) => satisfaction < 3)
      .map(([category, _]) => category);
    
    if (lowSatisfactionCategories.length > 0) {
      suggestions.push(`Le categorie ${lowSatisfactionCategories.join(', ')} potrebbero beneficiare di risposte più dettagliate`);
    }
    
    // Suggerimenti basati sui dati
    if (this.learningData.length > 0) {
      const avgResponseTime = this.learningData.reduce((sum, item) => sum + item.responseTime, 0) / this.learningData.length;
      if (avgResponseTime > 5000) {
        suggestions.push('Considera di ottimizzare i tempi di risposta per migliorare l\'esperienza utente');
      }
    }
    
    return suggestions;
  }

  /**
   * Calcola la soddisfazione per categoria
   */
  private calculateCategorySatisfaction(): Record<string, number> {
    const categoryData: Record<string, { total: number; satisfaction: number }> = {};
    
    for (const interaction of this.learningData) {
      if (!categoryData[interaction.category]) {
        categoryData[interaction.category] = { total: 0, satisfaction: 0 };
      }
      
      categoryData[interaction.category].total++;
      categoryData[interaction.category].satisfaction += interaction.userSatisfaction;
    }
    
    const result: Record<string, number> = {};
    for (const [category, data] of Object.entries(categoryData)) {
      result[category] = data.satisfaction / data.total;
    }
    
    return result;
  }

  /**
   * Ottiene le metriche di apprendimento
   */
  public getLearningMetrics(): LearningMetrics {
    const totalInteractions = this.learningData.length;
    const positiveFeedback = this.learningData.filter(i => i.userFeedback === 'positive').length;
    const negativeFeedback = this.learningData.filter(i => i.userFeedback === 'negative').length;
    
    const avgSatisfaction = totalInteractions > 0 
      ? this.learningData.reduce((sum, i) => sum + i.userSatisfaction, 0) / totalInteractions 
      : 0;
    
    const responseAccuracy = totalInteractions > 0 
      ? this.learningData.reduce((sum, i) => sum + i.responseQuality, 0) / totalInteractions / 10 
      : 0;
    
    // Domande popolari
    const questionCounts: Record<string, number> = {};
    for (const interaction of this.learningData) {
      const question = interaction.question;
      questionCounts[question] = (questionCounts[question] || 0) + 1;
    }
    
    const popularQuestions = Object.entries(questionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([question, count]) => ({ question, count }));
    
    // Categorie di problemi
    const categoryData: Record<string, { count: number; satisfaction: number }> = {};
    for (const interaction of this.learningData) {
      if (!categoryData[interaction.category]) {
        categoryData[interaction.category] = { count: 0, satisfaction: 0 };
      }
      categoryData[interaction.category].count++;
      categoryData[interaction.category].satisfaction += interaction.userSatisfaction;
    }
    
    const problemCategories = Object.entries(categoryData)
      .map(([category, data]) => ({
        category,
        count: data.count,
        avgSatisfaction: data.satisfaction / data.count
      }))
      .sort((a, b) => b.count - a.count);
    
    // Comportamento utente
    const keywordCounts: Record<string, number> = {};
    for (const interaction of this.learningData) {
      for (const keyword of interaction.keywords) {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      }
    }
    
    const commonKeywords = Object.entries(keywordCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([keyword, frequency]) => ({ keyword, frequency }));
    
    // Pattern di sessione
    const sessionPatterns: Record<string, number> = {};
    for (const interaction of this.learningData) {
      const pattern = this.categorizeQuestion(interaction.question);
      sessionPatterns[pattern] = (sessionPatterns[pattern] || 0) + 1;
    }
    
    const sessionPatternsArray = Object.entries(sessionPatterns)
      .map(([pattern, frequency]) => ({ pattern, frequency }))
      .sort((a, b) => b.frequency - a.frequency);
    
    // Attività per ora del giorno
    const hourlyActivity: Record<number, number> = {};
    for (const interaction of this.learningData) {
      const hour = interaction.timestamp.getHours();
      hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
    }
    
    const timeOfDay = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      activity: hourlyActivity[hour] || 0
    }));
    
    return {
      totalInteractions,
      positiveFeedback,
      negativeFeedback,
      averageSatisfaction: avgSatisfaction,
      responseAccuracy,
      popularQuestions,
      problemCategories,
      userBehavior: {
        commonKeywords,
        sessionPatterns: sessionPatternsArray,
        timeOfDay
      }
    };
  }

  /**
   * Ottiene raccomandazioni personalizzate per l'utente
   */
  public getPersonalizedRecommendations(userId: string): string[] {
    const userData = this.userPreferences.get(userId) || {};
    const recommendations: string[] = [];
    
    // Basato sulla categoria preferita
    if (userData.preferredCategory) {
      recommendations.push(`Hai mostrato interesse per ${userData.preferredCategory}. Considera di esplorare le funzionalità correlate.`);
    }
    
    // Basato sui problemi frequenti
    if (userData.commonIssues && userData.commonIssues.length > 0) {
      recommendations.push(`Per i problemi frequenti con ${userData.commonIssues.join(', ')}, consulta le FAQ specifiche.`);
    }
    
    // Basato sul livello di esperienza
    if (userData.experienceLevel === 'beginner') {
      recommendations.push('Come nuovo utente, inizia con la guida rapida e le FAQ di base.');
    } else if (userData.experienceLevel === 'advanced') {
      recommendations.push('Per utenti esperti, esplora le funzionalità avanzate e i report personalizzati.');
    }
    
    return recommendations;
  }

  /**
   * Aggiorna le preferenze dell'utente
   */
  public updateUserPreferences(userId: string, preferences: any): void {
    const existing = this.userPreferences.get(userId) || {};
    this.userPreferences.set(userId, { ...existing, ...preferences });
    this.saveLearningData();
  }

  /**
   * Esporta i dati di apprendimento per analisi
   */
  public exportLearningData(): string {
    return JSON.stringify({
      learningData: this.learningData,
      patterns: this.patterns,
      knowledgeBase: Array.from(this.knowledgeBase.entries()),
      userPreferences: Array.from(this.userPreferences.entries()),
      metrics: this.getLearningMetrics()
    }, null, 2);
  }

  /**
   * Resetta i dati di apprendimento (per testing)
   */
  public resetLearningData(): void {
    this.learningData = [];
    this.patterns = [];
    this.knowledgeBase.clear();
    this.userPreferences.clear();
    this.initializePatterns();
    this.saveLearningData();
  }
}
