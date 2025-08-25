import { api } from './api';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  publishedAt: string;
  url: string;
  category: 'financial' | 'crypto' | 'market' | 'economic' | 'political';
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  impact: 'high' | 'medium' | 'low';
  keywords: string[];
  entities: string[];
  marketRelevance: number;
}

export interface SentimentAnalysis {
  overall: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  };
  keywords: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
}

export interface MarketAlert {
  id: string;
  type: 'price_movement' | 'news_impact' | 'risk_warning' | 'opportunity';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedAssets: string[];
  impact: string;
  recommendations: string[];
  timestamp: string;
  isRead: boolean;
}

export interface InvestmentRecommendation {
  id: string;
  asset: string;
  action: 'buy' | 'sell' | 'hold' | 'monitor';
  confidence: number;
  reasoning: string[];
  riskLevel: 'low' | 'medium' | 'high';
  timeHorizon: 'short' | 'medium' | 'long';
  expectedReturn: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface RiskAssessment {
  asset: string;
  riskScore: number;
  riskFactors: string[];
  volatility: number;
  correlation: number;
  marketExposure: number;
  recommendations: string[];
}

class AINewsService {
  // Analisi del sentiment delle notizie
  async analyzeNewsSentiment(newsContent: string): Promise<SentimentAnalysis> {
    try {
      const response = await api.post('/ai/news/sentiment', {
        content: newsContent,
        language: 'it'
      });
      return response.data as SentimentAnalysis;
    } catch (error) {
      console.error('Error analyzing news sentiment:', error);
      // Fallback: analisi locale semplificata
      return this.localSentimentAnalysis(newsContent);
    }
  }

  // Analisi locale semplificata del sentiment
  private localSentimentAnalysis(content: string): SentimentAnalysis {
    const positiveWords = [
      'crescita', 'aumento', 'miglioramento', 'successo', 'profitto', 'guadagno',
      'stabile', 'forte', 'positivo', 'ottimo', 'eccellente', 'boom', 'rally'
    ];
    
    const negativeWords = [
      'calo', 'diminuzione', 'perdita', 'crisi', 'problema', 'rischio',
      'debole', 'negativo', 'pessimo', 'crollo', 'recessione', 'fallimento'
    ];

    const contentLower = content.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      const matches = contentLower.match(regex);
      if (matches) positiveCount += matches.length;
    });

    negativeWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      const matches = contentLower.match(regex);
      if (matches) negativeCount += matches.length;
    });

    let overall: 'positive' | 'negative' | 'neutral' = 'neutral';
    let score = 0;

    if (positiveCount > negativeCount) {
      overall = 'positive';
      score = Math.min(0.9, 0.5 + (positiveCount - negativeCount) * 0.1);
    } else if (negativeCount > positiveCount) {
      overall = 'negative';
      score = Math.max(0.1, 0.5 - (negativeCount - positiveCount) * 0.1);
    } else {
      score = 0.5;
    }

    return {
      overall,
      score,
      confidence: 0.7,
      emotions: {
        joy: positiveCount > negativeCount ? 0.6 : 0.2,
        sadness: negativeCount > positiveCount ? 0.6 : 0.2,
        anger: negativeCount > positiveCount ? 0.4 : 0.1,
        fear: negativeCount > positiveCount ? 0.5 : 0.2,
        surprise: Math.abs(positiveCount - negativeCount) > 2 ? 0.4 : 0.2
      },
      keywords: {
        positive: positiveWords.filter(word => contentLower.includes(word)),
        negative: negativeWords.filter(word => contentLower.includes(word)),
        neutral: []
      }
    };
  }

  // Generazione di alert automatici basati su notizie
  async generateMarketAlerts(newsItems: NewsItem[]): Promise<MarketAlert[]> {
    const alerts: MarketAlert[] = [];

    for (const news of newsItems) {
      if (news.sentimentScore < 0.3 && news.impact === 'high') {
        alerts.push({
          id: `alert_${news.id}`,
          type: 'risk_warning',
          severity: 'high',
          title: `⚠️ Allerta Rischio: ${news.title}`,
          description: `Notizia negativa ad alto impatto rilevata: ${news.title}`,
          affectedAssets: this.extractAssetsFromNews(news.content),
          impact: 'Possibile impatto negativo sui mercati correlati',
          recommendations: [
            'Monitorare attentamente le posizioni aperte',
            'Considerare la riduzione dell\'esposizione al rischio',
            'Verificare le coperture assicurative'
          ],
          timestamp: new Date().toISOString(),
          isRead: false
        });
      }

      if (news.sentimentScore > 0.7 && news.impact === 'high') {
        alerts.push({
          id: `alert_${news.id}`,
          type: 'opportunity',
          severity: 'medium',
          title: `💡 Opportunità: ${news.title}`,
          description: `Notizia positiva ad alto impatto rilevata: ${news.title}`,
          affectedAssets: this.extractAssetsFromNews(news.content),
          impact: 'Possibile opportunità di investimento',
          recommendations: [
            'Valutare nuove posizioni di investimento',
            'Analizzare la correlazione con il portafoglio esistente',
            'Considerare l\'aumento dell\'esposizione'
          ],
          timestamp: new Date().toISOString(),
          isRead: false
        });
      }
    }

    return alerts;
  }

  // Estrazione di asset finanziari dalle notizie
  private extractAssetsFromNews(content: string): string[] {
    const assets: string[] = [];
    
    // Pattern per azioni italiane
    const stockPatterns = [
      /(?:azioni|titoli|azioni ordinarie|azioni privilegiate)\s+(?:di\s+)?([A-Z]{3,})/gi,
      /([A-Z]{3,})\s+(?:spa|s\.p\.a|srl|s\.r\.l)/gi
    ];

    // Pattern per criptovalute
    const cryptoPatterns = [
      /(?:bitcoin|btc|ethereum|eth|cardano|ada|solana|sol)/gi,
      /([A-Z]{3,4})\s+(?:token|coin)/gi
    ];

    // Pattern per indici e valute
    const marketPatterns = [
      /(?:indice|index)\s+(?:ftse\s+)?mib/gi,
      /(?:euro|eur|dollaro|usd|sterlina|gbp)/gi
    ];

    [...stockPatterns, ...cryptoPatterns, ...marketPatterns].forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        assets.push(...matches.map(match => match.toUpperCase()));
      }
    });

    return Array.from(new Set(assets));
  }

  // Collegamento ai moduli di investimento e rischio
  async generateInvestmentRecommendations(
    newsItems: NewsItem[], 
    portfolioData: any
  ): Promise<InvestmentRecommendation[]> {
    const recommendations: InvestmentRecommendation[] = [];

    for (const news of newsItems) {
      if (news.impact === 'high' && news.sentimentScore > 0.6) {
        const affectedAssets = this.extractAssetsFromNews(news.content);
        
        for (const asset of affectedAssets) {
          recommendations.push({
            id: `rec_${news.id}_${asset}`,
            asset,
            action: 'buy',
            confidence: Math.min(0.9, news.sentimentScore + 0.2),
            reasoning: [
              `Notizia positiva: ${news.title}`,
              `Sentiment score: ${(news.sentimentScore * 100).toFixed(1)}%`,
              `Impatto di mercato: ${news.impact}`,
              `Rilevanza: ${news.marketRelevance}/10`
            ],
            riskLevel: news.sentimentScore > 0.8 ? 'low' : 'medium',
            timeHorizon: 'medium',
            expectedReturn: Math.round((news.sentimentScore * 15 + 5) * 100) / 100,
            stopLoss: Math.round((1 - news.sentimentScore * 0.1) * 100 * 100) / 100,
            takeProfit: Math.round((1 + news.sentimentScore * 0.2) * 100 * 100) / 100
          });
        }
      }

      if (news.impact === 'high' && news.sentimentScore < 0.4) {
        const affectedAssets = this.extractAssetsFromNews(news.content);
        
        for (const asset of affectedAssets) {
          recommendations.push({
            id: `rec_${news.id}_${asset}`,
            asset,
            action: 'sell',
            confidence: Math.min(0.9, (1 - news.sentimentScore) + 0.2),
            reasoning: [
              `Notizia negativa: ${news.title}`,
              `Sentiment score: ${(news.sentimentScore * 100).toFixed(1)}%`,
              `Impatto di mercato: ${news.impact}`,
              `Rilevanza: ${news.marketRelevance}/10`
            ],
            riskLevel: 'high',
            timeHorizon: 'short',
            expectedReturn: -Math.round((1 - news.sentimentScore) * 10 * 100) / 100
          });
        }
      }
    }

    return recommendations;
  }

  // Valutazione del rischio basata su notizie
  async assessRiskFromNews(
    newsItems: NewsItem[], 
    asset: string
  ): Promise<RiskAssessment> {
    const relevantNews = newsItems.filter(news => 
      news.content.toLowerCase().includes(asset.toLowerCase()) ||
      this.extractAssetsFromNews(news.content).some(a => 
        a.toLowerCase() === asset.toLowerCase()
      )
    );

    let riskScore = 0.5; // Base neutrale
    let volatility = 0.3;
    let negativeCount = 0;
    let positiveCount = 0;

    relevantNews.forEach(news => {
      if (news.sentiment === 'negative') {
        negativeCount++;
        riskScore += 0.1;
        volatility += 0.1;
      } else if (news.sentiment === 'positive') {
        positiveCount++;
        riskScore -= 0.05;
        volatility += 0.05;
      }
    });

    riskScore = Math.max(0.1, Math.min(0.9, riskScore));
    volatility = Math.max(0.1, Math.min(0.9, volatility));

    const riskFactors: string[] = [];
    if (negativeCount > positiveCount) {
      riskFactors.push('Prevalenza di notizie negative');
    }
    if (volatility > 0.5) {
      riskFactors.push('Elevata volatilità di mercato');
    }
    if (relevantNews.length === 0) {
      riskFactors.push('Mancanza di informazioni recenti');
    }

    return {
      asset,
      riskScore,
      riskFactors,
      volatility,
      correlation: 0.6,
      marketExposure: 0.7,
      recommendations: [
        negativeCount > positiveCount ? 'Considerare la riduzione dell\'esposizione' : 'Monitorare attentamente',
        volatility > 0.5 ? 'Implementare strategie di copertura' : 'Mantenere le posizioni attuali',
        'Diversificare il portafoglio per ridurre il rischio'
      ]
    };
  }

  // Feed RSS simulato per test
  async getMockNewsFeed(): Promise<NewsItem[]> {
    return [
      {
        id: '1',
        title: 'FTSE MIB in forte crescita: +2.5% in apertura',
        content: 'Il principale indice della Borsa Italiana registra una forte crescita in apertura, sostenuto dai dati positivi sull\'economia italiana e dalla ripresa dei settori bancario e industriale.',
        source: 'Reuters Italia',
        publishedAt: new Date().toISOString(),
        url: 'https://example.com/news1',
        category: 'financial',
        sentiment: 'positive',
        sentimentScore: 0.8,
        impact: 'high',
        keywords: ['FTSE MIB', 'Borsa Italiana', 'crescita', 'bancario', 'industriale'],
        entities: ['Borsa Italiana', 'Reuters'],
        marketRelevance: 9
      },
      {
        id: '2',
        title: 'Bitcoin scende sotto i 40.000 dollari',
        content: 'La criptovaluta leader ha perso terreno nelle ultime ore, scendendo sotto la soglia psicologica dei 40.000 dollari. Gli analisti attribuiscono il calo alle preoccupazioni normative e alla volatilità di mercato.',
        source: 'CoinDesk',
        publishedAt: new Date().toISOString(),
        url: 'https://example.com/news2',
        category: 'crypto',
        sentiment: 'negative',
        sentimentScore: 0.2,
        impact: 'high',
        keywords: ['Bitcoin', 'criptovaluta', 'calo', 'volatilità', 'normative'],
        entities: ['Bitcoin', 'CoinDesk'],
        marketRelevance: 8
      },
      {
        id: '3',
        title: 'Banca d\'Italia: inflazione sotto controllo',
        content: 'La Banca d\'Italia conferma che l\'inflazione rimane sotto controllo e si prevede un ritorno ai livelli target entro la fine dell\'anno. Buone notizie per i consumatori e gli investitori.',
        source: 'Il Sole 24 Ore',
        publishedAt: new Date().toISOString(),
        url: 'https://example.com/news3',
        category: 'economic',
        sentiment: 'positive',
        sentimentScore: 0.7,
        impact: 'medium',
        keywords: ['Banca d\'Italia', 'inflazione', 'controllo', 'consumatori', 'investitori'],
        entities: ['Banca d\'Italia', 'Il Sole 24 Ore'],
        marketRelevance: 7
      }
    ];
  }

  // Aggiornamento in tempo reale delle notizie
  async subscribeToNewsUpdates(callback: (news: NewsItem) => void): Promise<void> {
    // Simulazione di aggiornamenti in tempo reale
    setInterval(async () => {
      const mockNews = await this.getMockNewsFeed();
      const randomNews = mockNews[Math.floor(Math.random() * mockNews.length)];
      callback(randomNews);
    }, 30000); // Ogni 30 secondi per demo
  }
}

export const aiNewsService = new AINewsService();
