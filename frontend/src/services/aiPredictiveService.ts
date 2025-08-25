import { api } from './api';

// Interfacce per Analisi Predittiva
export interface CashFlowPrediction {
  id: string;
  period: string;
  predictedInflow: number;
  predictedOutflow: number;
  netCashFlow: number;
  confidence: number;
  factors: string[];
  risk: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface CreditRiskAnalysis {
  customerId: string;
  customerName: string;
  creditScore: number;
  riskLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  probabilityDefault: number;
  factors: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
  recommendations: string[];
  maxCreditLimit: number;
  suggestedTerms: {
    interestRate: number;
    term: number;
    collateral: boolean;
  };
}

export interface MarketTrendAnalysis {
  asset: string;
  assetType: 'stock' | 'crypto' | 'commodity' | 'currency' | 'bond';
  currentPrice: number;
  predictedPrice: {
    shortTerm: number; // 1 week
    mediumTerm: number; // 1 month
    longTerm: number; // 3 months
  };
  trendDirection: 'bullish' | 'bearish' | 'neutral';
  volatility: number;
  supportLevels: number[];
  resistanceLevels: number[];
  signals: {
    technical: string[];
    fundamental: string[];
    sentiment: string[];
  };
  confidence: number;
}

export interface InterestRateInflationForecast {
  period: string;
  interestRate: {
    current: number;
    predicted: number;
    change: number;
    direction: 'rising' | 'falling' | 'stable';
  };
  inflation: {
    current: number;
    predicted: number;
    change: number;
    direction: 'rising' | 'falling' | 'stable';
  };
  economicIndicators: {
    gdpGrowth: number;
    unemployment: number;
    consumerConfidence: number;
  };
  impact: {
    banking: string[];
    investments: string[];
    loans: string[];
  };
  confidence: number;
}

// Interfacce per Rilevamento Frodi
export interface FraudDetectionResult {
  transactionId: string;
  customerId: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  fraudProbability: number;
  anomalies: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    value: any;
    threshold: any;
  }[];
  behavioralFlags: string[];
  recommendations: string[];
  requiresReview: boolean;
  blockedTransaction: boolean;
}

export interface BehavioralPattern {
  customerId: string;
  pattern: {
    avgTransactionAmount: number;
    transactionFrequency: number;
    preferredTime: string;
    preferredDays: string[];
    geographicPattern: string[];
    merchantCategories: string[];
  };
  deviations: {
    amount: boolean;
    frequency: boolean;
    time: boolean;
    location: boolean;
    merchant: boolean;
  };
  riskScore: number;
}

// Interfacce per Ottimizzazione Investimenti
export interface PortfolioOptimization {
  customerId: string;
  currentPortfolio: {
    asset: string;
    allocation: number;
    currentValue: number;
  }[];
  optimizedPortfolio: {
    asset: string;
    targetAllocation: number;
    suggestedAction: 'buy' | 'sell' | 'hold';
    amount: number;
  }[];
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  expectedReturn: number;
  riskMetrics: {
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  rebalancingNeeded: boolean;
  suggestedActions: string[];
}

export interface EconomicScenario {
  id: string;
  name: string;
  description: string;
  probability: number;
  impact: {
    stocks: number;
    bonds: number;
    crypto: number;
    commodities: number;
    cash: number;
  };
  duration: string;
  factors: string[];
}

class AIPredictiveService {
  // Analisi Predittiva - Flussi di Cassa
  async predictCashFlow(accountId: string, timeframe: '1M' | '3M' | '6M' | '1Y'): Promise<CashFlowPrediction[]> {
    try {
      const response = await api.post('/ai/predict/cashflow', {
        accountId,
        timeframe
      });
      return response.data as CashFlowPrediction[];
    } catch (error) {
      console.error('Error predicting cash flow:', error);
      return this.mockCashFlowPrediction(timeframe);
    }
  }

  private mockCashFlowPrediction(timeframe: string): CashFlowPrediction[] {
    const periods = this.generatePeriods(timeframe);
    return periods.map((period, index) => ({
      id: `cf_${index}`,
      period,
      predictedInflow: 45000 + Math.random() * 10000,
      predictedOutflow: 38000 + Math.random() * 8000,
      netCashFlow: 7000 + Math.random() * 5000,
      confidence: 0.75 + Math.random() * 0.2,
      factors: [
        'Andamento stagionale storico',
        'Trend economico generale',
        'Contratti ricorrenti',
        'Investimenti programmati'
      ],
      risk: index % 3 === 0 ? 'high' : index % 2 === 0 ? 'medium' : 'low',
      recommendations: [
        'Mantenere riserva di liquidità del 15%',
        'Ottimizzare tempi di incasso',
        'Valutare linea di credito aggiuntiva'
      ]
    }));
  }

  private generatePeriods(timeframe: string): string[] {
    const periods: string[] = [];
    const monthsMap = { '1M': 1, '3M': 3, '6M': 6, '1Y': 12 };
    const months = monthsMap[timeframe as keyof typeof monthsMap] || 3;
    
    for (let i = 1; i <= months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      periods.push(date.toLocaleDateString('it-IT', { year: 'numeric', month: 'long' }));
    }
    return periods;
  }

  // Analisi del Rischio di Credito
  async analyzeCreditRisk(customerId: string): Promise<CreditRiskAnalysis> {
    try {
      const response = await api.post('/ai/analyze/credit-risk', { customerId });
      return response.data as CreditRiskAnalysis;
    } catch (error) {
      console.error('Error analyzing credit risk:', error);
      return this.mockCreditRiskAnalysis(customerId);
    }
  }

  private mockCreditRiskAnalysis(customerId: string): CreditRiskAnalysis {
    const score = Math.floor(300 + Math.random() * 550); // Credit score 300-850
    return {
      customerId,
      customerName: `Cliente ${customerId}`,
      creditScore: score,
      riskLevel: score > 750 ? 'very_low' : score > 650 ? 'low' : score > 550 ? 'medium' : score > 450 ? 'high' : 'very_high',
      probabilityDefault: score > 700 ? 0.02 : score > 600 ? 0.08 : score > 500 ? 0.15 : 0.25,
      factors: {
        positive: [
          'Storia creditizia positiva',
          'Reddito stabile e verificato',
          'Rapporto debito/reddito ottimale'
        ],
        negative: [
          'Recenti ritardi nei pagamenti',
          'Utilizzo elevato delle carte di credito'
        ],
        neutral: [
          'Prima richiesta di credito con la banca',
          'Settore di attività standard'
        ]
      },
      recommendations: [
        score > 650 ? 'Approvazione consigliata' : 'Valutazione aggiuntiva necessaria',
        'Richiedere garanzie aggiuntive per importi elevati',
        'Monitoraggio trimestrale del profilo'
      ],
      maxCreditLimit: score * 100,
      suggestedTerms: {
        interestRate: score > 700 ? 4.5 : score > 600 ? 6.0 : 8.5,
        term: score > 650 ? 60 : 36,
        collateral: score < 600
      }
    };
  }

  // Analisi Trend di Mercato
  async analyzeMarketTrend(asset: string): Promise<MarketTrendAnalysis> {
    try {
      const response = await api.post('/ai/analyze/market-trend', { asset });
      return response.data as MarketTrendAnalysis;
    } catch (error) {
      console.error('Error analyzing market trend:', error);
      return this.mockMarketTrendAnalysis(asset);
    }
  }

  private mockMarketTrendAnalysis(asset: string): MarketTrendAnalysis {
    const currentPrice = 100 + Math.random() * 200;
    const volatility = 0.1 + Math.random() * 0.4;
    
    return {
      asset,
      assetType: this.detectAssetType(asset),
      currentPrice,
      predictedPrice: {
        shortTerm: currentPrice * (0.95 + Math.random() * 0.1),
        mediumTerm: currentPrice * (0.9 + Math.random() * 0.2),
        longTerm: currentPrice * (0.85 + Math.random() * 0.3)
      },
      trendDirection: Math.random() > 0.6 ? 'bullish' : Math.random() > 0.3 ? 'bearish' : 'neutral',
      volatility,
      supportLevels: [
        currentPrice * 0.9,
        currentPrice * 0.85,
        currentPrice * 0.8
      ],
      resistanceLevels: [
        currentPrice * 1.05,
        currentPrice * 1.1,
        currentPrice * 1.15
      ],
      signals: {
        technical: [
          'RSI indica ipervenduto',
          'Media mobile 50 giorni in crescita',
          'Volume superiore alla media'
        ],
        fundamental: [
          'Bilanci aziendali solidi',
          'Crescita settore positiva',
          'Outlook management ottimistico'
        ],
        sentiment: [
          'Sentiment analisti positivo',
          'Copertura mediatica favorevole',
          'Interesse istituzionale in crescita'
        ]
      },
      confidence: 0.65 + Math.random() * 0.3
    };
  }

  private detectAssetType(asset: string): 'stock' | 'crypto' | 'commodity' | 'currency' | 'bond' {
    if (asset.includes('BTC') || asset.includes('ETH') || asset.includes('crypto')) return 'crypto';
    if (asset.includes('USD') || asset.includes('EUR') || asset.includes('GBP')) return 'currency';
    if (asset.includes('Gold') || asset.includes('Oil') || asset.includes('Silver')) return 'commodity';
    if (asset.includes('Bond') || asset.includes('Treasury')) return 'bond';
    return 'stock';
  }

  // Previsioni Tassi d'Interesse e Inflazione
  async forecastInterestRateInflation(region: 'EU' | 'US' | 'Global' = 'EU'): Promise<InterestRateInflationForecast[]> {
    try {
      const response = await api.post('/ai/forecast/rates-inflation', { region });
      return response.data as InterestRateInflationForecast[];
    } catch (error) {
      console.error('Error forecasting rates and inflation:', error);
      return this.mockInterestRateInflationForecast();
    }
  }

  private mockInterestRateInflationForecast(): InterestRateInflationForecast[] {
    const periods = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];
    return periods.map((period, index) => {
      const currentRate = 4.0 + index * 0.25;
      const currentInflation = 2.1 + index * 0.1;
      
      return {
        period,
        interestRate: {
          current: currentRate,
          predicted: currentRate + (Math.random() - 0.5) * 0.5,
          change: (Math.random() - 0.5) * 0.5,
          direction: Math.random() > 0.5 ? 'rising' : 'falling'
        },
        inflation: {
          current: currentInflation,
          predicted: currentInflation + (Math.random() - 0.5) * 0.3,
          change: (Math.random() - 0.5) * 0.3,
          direction: Math.random() > 0.5 ? 'rising' : 'falling'
        },
        economicIndicators: {
          gdpGrowth: 1.5 + Math.random() * 2,
          unemployment: 3.5 + Math.random() * 2,
          consumerConfidence: 85 + Math.random() * 15
        },
        impact: {
          banking: [
            'Margini di interesse in aumento',
            'Maggiore attrattività depositi',
            'Possibile aumento NPL'
          ],
          investments: [
            'Bond più attrattivi',
            'Pressure su valutazioni equity',
            'Shift verso value stocks'
          ],
          loans: [
            'Costo del credito in aumento',
            'Domanda di mutui in calo',
            'Focus su clientela prime'
          ]
        },
        confidence: 0.7 + Math.random() * 0.25
      };
    });
  }

  // Rilevamento Frodi
  async detectFraud(transactionData: any): Promise<FraudDetectionResult> {
    try {
      const response = await api.post('/ai/detect/fraud', transactionData);
      return response.data as FraudDetectionResult;
    } catch (error) {
      console.error('Error detecting fraud:', error);
      return this.mockFraudDetection(transactionData);
    }
  }

  private mockFraudDetection(transactionData: any): FraudDetectionResult {
    const riskScore = Math.random() * 100;
    const anomalies = this.generateAnomalies(transactionData);
    
    return {
      transactionId: transactionData.id || 'TXN_' + Date.now(),
      customerId: transactionData.customerId || 'CUST_123',
      riskScore,
      riskLevel: riskScore > 80 ? 'critical' : riskScore > 60 ? 'high' : riskScore > 40 ? 'medium' : 'low',
      fraudProbability: riskScore / 100,
      anomalies,
      behavioralFlags: [
        'Transazione fuori orario abituale',
        'Importo superiore alla media',
        'Nuova geolocalizzazione'
      ],
      recommendations: [
        riskScore > 70 ? 'Bloccare transazione e richiedere verifica' : 'Monitoraggio enhanced',
        'Contattare cliente per conferma',
        'Aggiornare profilo comportamentale'
      ],
      requiresReview: riskScore > 60,
      blockedTransaction: riskScore > 85
    };
  }

  private generateAnomalies(transactionData: any): any[] {
    const anomalies = [];
    
    if (Math.random() > 0.7) {
      anomalies.push({
        type: 'amount_anomaly',
        severity: 'high' as const,
        description: 'Importo significativamente superiore alla media storica',
        value: transactionData.amount || 5000,
        threshold: 1000
      });
    }

    if (Math.random() > 0.8) {
      anomalies.push({
        type: 'time_anomaly',
        severity: 'medium' as const,
        description: 'Transazione effettuata in orario inusuale',
        value: '03:30',
        threshold: '08:00-22:00'
      });
    }

    if (Math.random() > 0.6) {
      anomalies.push({
        type: 'location_anomaly',
        severity: 'high' as const,
        description: 'Transazione da nuova geolocalizzazione',
        value: 'Singapore',
        threshold: 'Italia'
      });
    }

    return anomalies;
  }

  // Analisi Comportamentale
  async analyzeBehavioralPattern(customerId: string): Promise<BehavioralPattern> {
    try {
      const response = await api.post('/ai/analyze/behavioral', { customerId });
      return response.data as BehavioralPattern;
    } catch (error) {
      console.error('Error analyzing behavioral pattern:', error);
      return this.mockBehavioralPattern(customerId);
    }
  }

  private mockBehavioralPattern(customerId: string): BehavioralPattern {
    return {
      customerId,
      pattern: {
        avgTransactionAmount: 250 + Math.random() * 500,
        transactionFrequency: 15 + Math.random() * 20, // per month
        preferredTime: '14:30',
        preferredDays: ['Lunedì', 'Mercoledì', 'Venerdì'],
        geographicPattern: ['Milano', 'Roma', 'Torino'],
        merchantCategories: ['Supermercati', 'Carburanti', 'Ristoranti', 'Shopping Online']
      },
      deviations: {
        amount: Math.random() > 0.8,
        frequency: Math.random() > 0.7,
        time: Math.random() > 0.6,
        location: Math.random() > 0.9,
        merchant: Math.random() > 0.85
      },
      riskScore: Math.random() * 100
    };
  }

  // Ottimizzazione Portafoglio
  async optimizePortfolio(customerId: string, riskProfile: 'conservative' | 'moderate' | 'aggressive'): Promise<PortfolioOptimization> {
    try {
      const response = await api.post('/ai/optimize/portfolio', { customerId, riskProfile });
      return response.data as PortfolioOptimization;
    } catch (error) {
      console.error('Error optimizing portfolio:', error);
      return this.mockPortfolioOptimization(customerId, riskProfile);
    }
  }

  private mockPortfolioOptimization(customerId: string, riskProfile: 'conservative' | 'moderate' | 'aggressive'): PortfolioOptimization {
    const currentPortfolio = [
      { asset: 'Azioni Italiane', allocation: 30, currentValue: 30000 },
      { asset: 'Obbligazioni EUR', allocation: 40, currentValue: 40000 },
      { asset: 'ETF Globali', allocation: 20, currentValue: 20000 },
      { asset: 'Liquidità', allocation: 10, currentValue: 10000 }
    ];

    const riskProfiles = {
      conservative: { stocks: 25, bonds: 60, etf: 10, cash: 5 },
      moderate: { stocks: 45, bonds: 35, etf: 15, cash: 5 },
      aggressive: { stocks: 65, bonds: 15, etf: 15, cash: 5 }
    };

    const target = riskProfiles[riskProfile];

    return {
      customerId,
      currentPortfolio,
      optimizedPortfolio: [
        { asset: 'Azioni Italiane', targetAllocation: target.stocks, suggestedAction: 'buy', amount: 5000 },
        { asset: 'Obbligazioni EUR', targetAllocation: target.bonds, suggestedAction: 'sell', amount: 3000 },
        { asset: 'ETF Globali', targetAllocation: target.etf, suggestedAction: 'hold', amount: 0 },
        { asset: 'Liquidità', targetAllocation: target.cash, suggestedAction: 'hold', amount: 0 }
      ],
      riskProfile,
      expectedReturn: riskProfile === 'aggressive' ? 8.5 : riskProfile === 'moderate' ? 6.2 : 4.1,
      riskMetrics: {
        volatility: riskProfile === 'aggressive' ? 0.18 : riskProfile === 'moderate' ? 0.12 : 0.07,
        sharpeRatio: 1.2 + Math.random() * 0.5,
        maxDrawdown: riskProfile === 'aggressive' ? 0.25 : riskProfile === 'moderate' ? 0.15 : 0.08
      },
      rebalancingNeeded: true,
      suggestedActions: [
        'Aumentare esposizione azionaria',
        'Ridurre peso obbligazionario',
        'Diversificare geograficamente',
        'Considerare settori in crescita'
      ]
    };
  }

  // Simulazioni Scenari Economici
  async simulateEconomicScenarios(): Promise<EconomicScenario[]> {
    try {
      const response = await api.get('/ai/simulate/economic-scenarios');
      return response.data as EconomicScenario[];
    } catch (error) {
      console.error('Error simulating economic scenarios:', error);
      return this.mockEconomicScenarios();
    }
  }

  private mockEconomicScenarios(): EconomicScenario[] {
    return [
      {
        id: 'base_case',
        name: 'Scenario Base',
        description: 'Crescita economica stabile, inflazione sotto controllo',
        probability: 0.6,
        impact: {
          stocks: 0.08,
          bonds: 0.03,
          crypto: 0.15,
          commodities: 0.05,
          cash: 0.02
        },
        duration: '12-18 mesi',
        factors: ['Crescita PIL stabile', 'Politiche monetarie moderate', 'Stabilità geopolitica']
      },
      {
        id: 'recession',
        name: 'Recessione',
        description: 'Contrazione economica significativa',
        probability: 0.25,
        impact: {
          stocks: -0.20,
          bonds: 0.08,
          crypto: -0.35,
          commodities: -0.15,
          cash: 0.03
        },
        duration: '6-12 mesi',
        factors: ['Calo consumi', 'Aumento disoccupazione', 'Stretta creditizia']
      },
      {
        id: 'high_inflation',
        name: 'Inflazione Elevata',
        description: 'Spirale inflazionistica persistente',
        probability: 0.15,
        impact: {
          stocks: -0.10,
          bonds: -0.12,
          crypto: 0.25,
          commodities: 0.30,
          cash: -0.08
        },
        duration: '18-24 mesi',
        factors: ['Pressioni su materie prime', 'Aspettative inflazionistiche', 'Politiche fiscali espansive']
      }
    ];
  }
}

export const aiPredictiveService = new AIPredictiveService();
