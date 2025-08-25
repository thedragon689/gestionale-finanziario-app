import { api } from './api';

// Interfacce per Automazione Processi
export interface LoanApplication {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  purpose: string;
  term: number;
  submittedAt: string;
  status: 'pending' | 'auto_approved' | 'requires_review' | 'rejected';
  creditScore: number;
  riskAssessment: 'low' | 'medium' | 'high';
  documents: string[];
}

export interface AutoApprovalResult {
  applicationId: string;
  decision: 'approved' | 'rejected' | 'review_required';
  confidence: number;
  reasons: string[];
  suggestedTerms?: {
    amount: number;
    interestRate: number;
    term: number;
    conditions: string[];
  };
  requiredActions: string[];
}

export interface FinancialReport {
  id: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'regulatory';
  title: string;
  generatedAt: string;
  period: string;
  status: 'generating' | 'ready' | 'sent';
  sections: {
    name: string;
    data: any;
    charts: string[];
  }[];
  compliance: {
    regulation: string;
    status: 'compliant' | 'warning' | 'violation';
    notes: string[];
  }[];
  attachments: string[];
}

export interface IntelligentNotification {
  id: string;
  type: 'deadline' | 'anomaly' | 'opportunity' | 'risk' | 'compliance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  targetUsers: string[];
  scheduledFor?: string;
  actions: {
    label: string;
    action: string;
    primary: boolean;
  }[];
  metadata: any;
  read: boolean;
  createdAt: string;
}

// Interfacce per Compliance
export interface ComplianceCheck {
  id: string;
  regulation: string;
  description: string;
  status: 'compliant' | 'warning' | 'violation' | 'pending';
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastChecked: string;
  findings: {
    type: string;
    description: string;
    recommendation: string;
    deadline?: string;
  }[];
  autoRemediationAvailable: boolean;
}

export interface ComplianceAlert {
  id: string;
  regulation: string;
  violationType: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedEntities: string[];
  deadline: string;
  recommendations: string[];
  autoFixAvailable: boolean;
  status: 'active' | 'in_progress' | 'resolved';
}

export interface AuditTrail {
  id: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: string;
  module: string;
  entityType: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure' | 'warning';
}

// Interfacce per Personalizzazione
export interface UserProfile {
  userId: string;
  role: 'customer' | 'operator' | 'manager' | 'admin';
  preferences: {
    dashboardLayout: string;
    defaultCharts: string[];
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    themes: {
      colorScheme: 'light' | 'dark' | 'auto';
      language: 'it' | 'en' | 'de' | 'fr';
    };
  };
  behavior: {
    loginFrequency: number;
    mostUsedModules: string[];
    avgSessionDuration: number;
    preferredTimeRanges: string[];
  };
  goals: {
    financial: string[];
    educational: string[];
    investment: string[];
  };
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
}

export interface PersonalizedDashboard {
  userId: string;
  layout: {
    widgets: {
      id: string;
      type: string;
      position: { x: number; y: number; w: number; h: number };
      config: any;
      visible: boolean;
    }[];
    theme: string;
    autoRefresh: boolean;
  };
  recommendations: {
    widgets: string[];
    actions: string[];
    content: string[];
  };
}

export interface TargetedOffer {
  id: string;
  customerId: string;
  offerType: 'product' | 'service' | 'promotion' | 'education';
  title: string;
  description: string;
  conditions: string[];
  validUntil: string;
  score: number;
  reasons: string[];
  cta: {
    label: string;
    action: string;
  };
  category: string;
  priority: 'low' | 'medium' | 'high';
}

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

class AIAutomationService {
  // Approvazione Automatica Prestiti
  async processLoanApplication(application: LoanApplication): Promise<AutoApprovalResult> {
    try {
      const response = await api.post('/ai/loans/auto-approve', application);
      return response.data as AutoApprovalResult;
    } catch (error) {
      console.error('Error processing loan application:', error);
      return this.mockAutoApproval(application);
    }
  }

  private mockAutoApproval(application: LoanApplication): AutoApprovalResult {
    const riskScore = this.calculateRiskScore(application);
    const autoApprovalThreshold = 50000; // Soglia per auto-approvazione
    
    let decision: 'approved' | 'rejected' | 'review_required';
    let confidence: number;
    let reasons: string[] = [];

    if (application.amount <= autoApprovalThreshold && application.creditScore >= 650 && riskScore < 0.3) {
      decision = 'approved';
      confidence = 0.85 + Math.random() * 0.1;
      reasons = [
        'Credit score eccellente',
        'Importo entro soglia automatica',
        'Profilo di rischio basso',
        'Storia creditizia positiva'
      ];
    } else if (application.creditScore < 500 || riskScore > 0.7) {
      decision = 'rejected';
      confidence = 0.9;
      reasons = [
        'Credit score insufficiente',
        'Profilo di rischio elevato',
        'Reddito non adeguato all\'importo richiesto'
      ];
    } else {
      decision = 'review_required';
      confidence = 0.6 + Math.random() * 0.2;
      reasons = [
        'Importo superiore alla soglia automatica',
        'Valutazione manuale richiesta',
        'Documentazione aggiuntiva necessaria'
      ];
    }

    return {
      applicationId: application.id,
      decision,
      confidence,
      reasons,
      suggestedTerms: decision === 'approved' ? {
        amount: application.amount,
        interestRate: this.calculateInterestRate(application.creditScore),
        term: application.term,
        conditions: [
          'Assicurazione vita obbligatoria',
          'Domiciliazione stipendio',
          'Garanzia fideiussoria per importi > €30.000'
        ]
      } : undefined,
      requiredActions: decision === 'review_required' ? [
        'Verifica documentazione reddito',
        'Controllo centrale rischi',
        'Valutazione collaterale'
      ] : []
    };
  }

  private calculateRiskScore(application: LoanApplication): number {
    let score = 0;
    
    // Credit score impact
    if (application.creditScore < 500) score += 0.4;
    else if (application.creditScore < 650) score += 0.2;
    else if (application.creditScore < 750) score += 0.1;
    
    // Amount impact
    if (application.amount > 100000) score += 0.3;
    else if (application.amount > 50000) score += 0.2;
    else if (application.amount > 25000) score += 0.1;
    
    // Term impact
    if (application.term > 84) score += 0.2;
    else if (application.term > 60) score += 0.1;
    
    return Math.min(score, 1);
  }

  private calculateInterestRate(creditScore: number): number {
    if (creditScore >= 750) return 3.5;
    if (creditScore >= 700) return 4.2;
    if (creditScore >= 650) return 5.1;
    if (creditScore >= 600) return 6.5;
    return 8.2;
  }

  // Generazione Report Automatici
  async generateFinancialReport(type: 'monthly' | 'quarterly' | 'annual' | 'regulatory', period: string): Promise<FinancialReport> {
    try {
      const response = await api.post('/ai/reports/generate', { type, period });
      return response.data as FinancialReport;
    } catch (error) {
      console.error('Error generating financial report:', error);
      return this.mockFinancialReport(type, period);
    }
  }

  private mockFinancialReport(type: string, period: string): FinancialReport {
    const reportTypes = {
      monthly: 'Report Mensile Gestionale',
      quarterly: 'Report Trimestrale Stakeholders',
      annual: 'Bilancio Annuale',
      regulatory: 'Report Normativo BCE'
    };

    return {
      id: `RPT_${Date.now()}`,
      type: type as any,
      title: reportTypes[type as keyof typeof reportTypes],
      generatedAt: new Date().toISOString(),
      period,
      status: 'ready',
      sections: [
        {
          name: 'Executive Summary',
          data: {
            totalAssets: 125000000,
            netIncome: 8500000,
            roe: 12.5,
            cet1Ratio: 14.2
          },
          charts: ['assets_trend', 'profitability', 'capital_ratios']
        },
        {
          name: 'Risk Metrics',
          data: {
            creditRisk: 2.1,
            marketRisk: 1.8,
            operationalRisk: 0.9,
            liquidityRatio: 125
          },
          charts: ['risk_breakdown', 'var_analysis']
        },
        {
          name: 'Regulatory Compliance',
          data: {
            capitalAdequacy: 'Compliant',
            liquidityCoverage: 'Compliant',
            leverage: 'Compliant'
          },
          charts: ['compliance_status']
        }
      ],
      compliance: [
        {
          regulation: 'CRR/CRD IV',
          status: 'compliant',
          notes: ['Tutti i requisiti soddisfatti', 'Buffer di sicurezza adeguato']
        },
        {
          regulation: 'IFRS 9',
          status: 'compliant',
          notes: ['Modelli di impairment aggiornati', 'Provisioning adeguato']
        }
      ],
      attachments: ['financial_statements.pdf', 'risk_report.pdf', 'compliance_cert.pdf']
    };
  }

  // Notifiche Intelligenti
  async generateIntelligentNotifications(userId: string): Promise<IntelligentNotification[]> {
    try {
      const response = await api.post('/ai/notifications/generate', { userId });
      return response.data as IntelligentNotification[];
    } catch (error) {
      console.error('Error generating notifications:', error);
      return this.mockIntelligentNotifications(userId);
    }
  }

  private mockIntelligentNotifications(userId: string): IntelligentNotification[] {
    return [
      {
        id: 'notif_1',
        type: 'deadline',
        priority: 'high',
        title: 'Scadenza Report Trimestrale',
        message: 'Il report trimestrale deve essere completato entro il 15 del mese',
        targetUsers: [userId],
        scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        actions: [
          { label: 'Genera Report', action: 'generate_report', primary: true },
          { label: 'Rimanda', action: 'remind_later', primary: false }
        ],
        metadata: { reportType: 'quarterly', deadline: '2024-04-15' },
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif_2',
        type: 'anomaly',
        priority: 'critical',
        title: 'Anomalia Transazioni Rilevata',
        message: 'Rilevato picco inusuale di transazioni ad alto importo. Verifica necessaria.',
        targetUsers: [userId],
        actions: [
          { label: 'Investiga', action: 'investigate_anomaly', primary: true },
          { label: 'Ignora', action: 'dismiss', primary: false }
        ],
        metadata: { 
          anomalyType: 'transaction_spike', 
          affectedAccounts: ['ACC_001', 'ACC_002'], 
          timeWindow: '2024-03-15 14:00-16:00' 
        },
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif_3',
        type: 'opportunity',
        priority: 'medium',
        title: 'Opportunità Cross-selling',
        message: 'Cliente Mario Rossi è candidato ideale per polizza vita premium',
        targetUsers: [userId],
        actions: [
          { label: 'Contatta Cliente', action: 'contact_customer', primary: true },
          { label: 'Programma Follow-up', action: 'schedule_followup', primary: false }
        ],
        metadata: { 
          customerId: 'CUST_123', 
          product: 'vita_premium', 
          score: 0.85 
        },
        read: false,
        createdAt: new Date().toISOString()
      }
    ];
  }

  // Compliance Automatica
  async checkCompliance(): Promise<ComplianceCheck[]> {
    try {
      const response = await api.get('/ai/compliance/check');
      return response.data as ComplianceCheck[];
    } catch (error) {
      console.error('Error checking compliance:', error);
      return this.mockComplianceChecks();
    }
  }

  private mockComplianceChecks(): ComplianceCheck[] {
    return [
      {
        id: 'comp_1',
        regulation: 'CRR - Capital Requirements Regulation',
        description: 'Verifica requisiti patrimoniali minimi',
        status: 'compliant',
        severity: 'high',
        lastChecked: new Date().toISOString(),
        findings: [
          {
            type: 'capital_ratio',
            description: 'CET1 ratio superiore al minimo richiesto (4.5%)',
            recommendation: 'Mantenere buffer di sicurezza'
          }
        ],
        autoRemediationAvailable: false
      },
      {
        id: 'comp_2',
        regulation: 'GDPR - Data Protection',
        description: 'Protezione dati personali clienti',
        status: 'warning',
        severity: 'medium',
        lastChecked: new Date().toISOString(),
        findings: [
          {
            type: 'data_retention',
            description: 'Alcuni dati superano il periodo di conservazione',
            recommendation: 'Implementare processo di cancellazione automatica',
            deadline: '2024-05-01'
          }
        ],
        autoRemediationAvailable: true
      },
      {
        id: 'comp_3',
        regulation: 'AML - Anti Money Laundering',
        description: 'Controlli antiriciclaggio',
        status: 'compliant',
        severity: 'critical',
        lastChecked: new Date().toISOString(),
        findings: [
          {
            type: 'kyc_updates',
            description: 'Tutti i profili KYC sono aggiornati',
            recommendation: 'Continuare monitoraggio regolare'
          }
        ],
        autoRemediationAvailable: false
      }
    ];
  }

  async generateComplianceAlerts(): Promise<ComplianceAlert[]> {
    try {
      const response = await api.get('/ai/compliance/alerts');
      return response.data as ComplianceAlert[];
    } catch (error) {
      console.error('Error generating compliance alerts:', error);
      return this.mockComplianceAlerts();
    }
  }

  private mockComplianceAlerts(): ComplianceAlert[] {
    return [
      {
        id: 'alert_1',
        regulation: 'IFRS 9',
        violationType: 'Expected Credit Loss Model',
        description: 'Modello ECL necessita di aggiornamento con dati più recenti',
        severity: 'medium',
        affectedEntities: ['Portfolio Retail', 'Portfolio Corporate'],
        deadline: '2024-06-30',
        recommendations: [
          'Aggiornare modello con dati ultimi 12 mesi',
          'Rivalidare parametri di rischio',
          'Documentare cambiamenti metodologici'
        ],
        autoFixAvailable: false,
        status: 'active'
      },
      {
        id: 'alert_2',
        regulation: 'PCI DSS',
        violationType: 'Security Vulnerability',
        description: 'Vulnerabilità rilevata nel sistema di pagamento',
        severity: 'high',
        affectedEntities: ['Payment Gateway', 'Card Processing'],
        deadline: '2024-04-15',
        recommendations: [
          'Applicare patch di sicurezza',
          'Eseguire penetration test',
          'Aggiornare certificazioni'
        ],
        autoFixAvailable: true,
        status: 'in_progress'
      }
    ];
  }

  // Audit Trail
  async getAuditTrail(filters: any): Promise<AuditTrail[]> {
    try {
      const response = await api.post('/ai/audit/trail', filters);
      return response.data as AuditTrail[];
    } catch (error) {
      console.error('Error getting audit trail:', error);
      return this.mockAuditTrail();
    }
  }

  private mockAuditTrail(): AuditTrail[] {
    return [
      {
        id: 'audit_1',
        action: 'LOAN_APPROVAL',
        userId: 'user_123',
        userName: 'Mario Bianchi',
        timestamp: new Date().toISOString(),
        module: 'Lending',
        entityType: 'Loan',
        entityId: 'LOAN_001',
        oldValue: { status: 'pending' },
        newValue: { status: 'approved', amount: 50000 },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 Chrome',
        result: 'success'
      },
      {
        id: 'audit_2',
        action: 'CUSTOMER_UPDATE',
        userId: 'user_456',
        userName: 'Lucia Verdi',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        module: 'CRM',
        entityType: 'Customer',
        entityId: 'CUST_123',
        oldValue: { email: 'old@email.com' },
        newValue: { email: 'new@email.com' },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 Firefox',
        result: 'success'
      }
    ];
  }

  // Personalizzazione
  async generatePersonalizedDashboard(userId: string): Promise<PersonalizedDashboard> {
    try {
      const response = await api.post('/ai/personalization/dashboard', { userId });
      return response.data as PersonalizedDashboard;
    } catch (error) {
      console.error('Error generating personalized dashboard:', error);
      return this.mockPersonalizedDashboard(userId);
    }
  }

  private mockPersonalizedDashboard(userId: string): PersonalizedDashboard {
    return {
      userId,
      layout: {
        widgets: [
          {
            id: 'balance_trend',
            type: 'chart',
            position: { x: 0, y: 0, w: 8, h: 4 },
            config: { chartType: 'line', timeframe: '3M' },
            visible: true
          },
          {
            id: 'ai_news',
            type: 'news',
            position: { x: 8, y: 0, w: 4, h: 4 },
            config: { maxNews: 3, categories: ['financial', 'crypto'] },
            visible: true
          },
          {
            id: 'portfolio_allocation',
            type: 'portfolio',
            position: { x: 0, y: 4, w: 6, h: 3 },
            config: { chartType: 'pie', showTargets: true },
            visible: true
          },
          {
            id: 'recent_transactions',
            type: 'transactions',
            position: { x: 6, y: 4, w: 6, h: 3 },
            config: { limit: 10, showCategories: true },
            visible: true
          }
        ],
        theme: 'light',
        autoRefresh: true
      },
      recommendations: {
        widgets: ['risk_monitor', 'goal_tracker'],
        actions: ['rebalance_portfolio', 'update_goals'],
        content: ['investment_education', 'market_insights']
      }
    };
  }

  async generateTargetedOffers(customerId: string): Promise<TargetedOffer[]> {
    try {
      const response = await api.post('/ai/personalization/offers', { customerId });
      return response.data as TargetedOffer[];
    } catch (error) {
      console.error('Error generating targeted offers:', error);
      return this.mockTargetedOffers(customerId);
    }
  }

  private mockTargetedOffers(customerId: string): TargetedOffer[] {
    return [
      {
        id: 'offer_1',
        customerId,
        offerType: 'product',
        title: 'Conto Premium Plus',
        description: 'Upgrade gratuito al conto premium per 6 mesi',
        conditions: [
          'Saldo medio mensile > €10.000',
          'Domiciliazione stipendio',
          'Attivazione carta di credito'
        ],
        validUntil: '2024-06-30',
        score: 0.85,
        reasons: [
          'Profilo cliente high-value',
          'Utilizzo frequente servizi bancari',
          'Crescita patrimonio costante'
        ],
        cta: {
          label: 'Attiva Ora',
          action: 'activate_premium_account'
        },
        category: 'Banking',
        priority: 'high'
      },
      {
        id: 'offer_2',
        customerId,
        offerType: 'service',
        title: 'Consulenza Investimenti Gratuita',
        description: 'Sessione di consulenza personalizzata con i nostri esperti',
        conditions: [
          'Patrimonio investito > €25.000',
          'Nessuna consulenza negli ultimi 12 mesi'
        ],
        validUntil: '2024-05-15',
        score: 0.72,
        reasons: [
          'Portfolio non ottimizzato',
          'Opportunità di diversificazione',
          'Profilo di rischio modificato'
        ],
        cta: {
          label: 'Prenota Consulenza',
          action: 'book_consultation'
        },
        category: 'Investment',
        priority: 'medium'
      }
    ];
  }
}

export const aiAutomationService = new AIAutomationService();
