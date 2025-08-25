import { api } from './api';

export interface Fund {
  id: string;
  name: string;
  type: 'equity' | 'bond' | 'mixed' | 'money_market' | 'index' | 'sector';
  category: 'domestic' | 'international' | 'emerging_markets' | 'developed_markets';
  isin: string;
  currency: string;
  nav: number;
  navDate: Date;
  totalValue: number;
  units: number;
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
    ytd: number;
  };
  risk: 'low' | 'medium' | 'high' | 'very_high';
  expenseRatio: number;
  minInvestment: number;
  status: 'active' | 'suspended' | 'closed';
  manager: string;
  inceptionDate: Date;
  description: string;
  sectors?: string[];
  countries?: string[];
}

export interface FundTransaction {
  id: string;
  fundId: string;
  type: 'purchase' | 'sale' | 'dividend' | 'distribution';
  amount: number;
  units: number;
  nav: number;
  date: Date;
  fees: number;
  totalValue: number;
  description: string;
}

export interface FundPerformance {
  date: Date;
  nav: number;
  totalValue: number;
  units: number;
  performance: number;
}

export interface CreateFundRequest {
  name: string;
  type: Fund['type'];
  category: Fund['category'];
  isin: string;
  currency: string;
  minInvestment: number;
  manager: string;
  description: string;
  risk: Fund['risk'];
  expenseRatio: number;
}

class FundService {
  // Get all funds
  async getFunds(): Promise<Fund[]> {
    try {
      // Mock data for now - replace with actual API call
      const mockFunds: Fund[] = [
        {
          id: '1',
          name: 'Vanguard Total Stock Market Index Fund',
          type: 'index',
          category: 'domestic',
          isin: 'US9229087286',
          currency: 'USD',
          nav: 125.45,
          navDate: new Date('2024-01-15'),
          totalValue: 125450,
          units: 1000,
          performance: {
            daily: 0.85,
            weekly: 2.3,
            monthly: 5.2,
            yearly: 18.7,
            ytd: 3.1,
          },
          risk: 'medium',
          expenseRatio: 0.04,
          minInvestment: 3000,
          status: 'active',
          manager: 'Vanguard Group',
          inceptionDate: new Date('1992-04-27'),
          description: 'Low-cost index fund tracking the total US stock market',
          sectors: ['Technology', 'Healthcare', 'Financials', 'Consumer Discretionary'],
          countries: ['United States'],
        },
        {
          id: '2',
          name: 'Fidelity European Growth Fund',
          type: 'equity',
          category: 'developed_markets',
          isin: 'LU1234567890',
          currency: 'EUR',
          nav: 45.67,
          navDate: new Date('2024-01-15'),
          totalValue: 45670,
          units: 1000,
          performance: {
            daily: -0.32,
            weekly: 1.8,
            monthly: 4.1,
            yearly: 12.5,
            ytd: 2.8,
          },
          risk: 'high',
          expenseRatio: 0.85,
          minInvestment: 5000,
          status: 'active',
          manager: 'Fidelity International',
          inceptionDate: new Date('2000-03-15'),
          description: 'Actively managed fund focusing on European growth companies',
          sectors: ['Technology', 'Industrials', 'Consumer Goods'],
          countries: ['Germany', 'France', 'Netherlands', 'Switzerland'],
        },
        {
          id: '3',
          name: 'BlackRock Emerging Markets Bond Fund',
          type: 'bond',
          category: 'emerging_markets',
          isin: 'IE00B3D0FQ49',
          currency: 'USD',
          nav: 12.34,
          navDate: new Date('2024-01-15'),
          totalValue: 24680,
          units: 2000,
          performance: {
            daily: 0.12,
            weekly: 0.8,
            monthly: 2.1,
            yearly: 8.3,
            ytd: 1.5,
          },
          risk: 'medium',
          expenseRatio: 0.65,
          minInvestment: 2500,
          status: 'active',
          manager: 'BlackRock',
          inceptionDate: new Date('2010-06-10'),
          description: 'Diversified bond fund investing in emerging market debt',
          countries: ['Brazil', 'Mexico', 'Indonesia', 'South Africa'],
        },
        {
          id: '4',
          name: 'PIMCO Total Return Fund',
          type: 'bond',
          category: 'domestic',
          isin: 'US72201F1098',
          currency: 'USD',
          nav: 8.92,
          navDate: new Date('2024-01-15'),
          totalValue: 8920,
          units: 1000,
          performance: {
            daily: 0.05,
            weekly: 0.3,
            monthly: 1.2,
            yearly: 4.8,
            ytd: 0.9,
          },
          risk: 'low',
          expenseRatio: 0.46,
          minInvestment: 1000,
          status: 'active',
          manager: 'PIMCO',
          inceptionDate: new Date('1987-05-11'),
          description: 'Core bond fund with flexible investment approach',
        },
        {
          id: '5',
          name: 'T. Rowe Price Technology Fund',
          type: 'sector',
          category: 'domestic',
          isin: 'US74144T7067',
          currency: 'USD',
          nav: 89.12,
          navDate: new Date('2024-01-15'),
          totalValue: 89120,
          units: 1000,
          performance: {
            daily: 1.25,
            weekly: 4.2,
            monthly: 12.5,
            yearly: 35.8,
            ytd: 8.7,
          },
          risk: 'very_high',
          expenseRatio: 0.76,
          minInvestment: 2500,
          status: 'active',
          manager: 'T. Rowe Price',
          inceptionDate: new Date('1998-12-29'),
          description: 'Sector fund focused on technology companies',
          sectors: ['Technology'],
          countries: ['United States'],
        },
        {
          id: '6',
          name: 'ETF Europa Sostenibile 50',
          type: 'index',
          category: 'developed_markets',
          isin: 'IE00B3D0FQ50',
          currency: 'EUR',
          nav: 25.80,
          navDate: new Date('2024-01-15'),
          totalValue: 51600,
          units: 2000,
          performance: {
            daily: 0.45,
            weekly: 1.8,
            monthly: 3.2,
            yearly: 15.3,
            ytd: 4.1,
          },
          risk: 'medium',
          expenseRatio: 0.25,
          minInvestment: 1000,
          status: 'active',
          manager: 'Amundi',
          inceptionDate: new Date('2018-09-15'),
          description: 'ETF che replica i 50 titoli europei più sostenibili secondo criteri ESG',
          sectors: ['Technology', 'Healthcare', 'Industrials', 'Consumer Goods'],
          countries: ['Germany', 'France', 'Netherlands', 'Switzerland', 'Sweden'],
        },
        {
          id: '7',
          name: 'ETF Global Growth ESG',
          type: 'equity',
          category: 'international',
          isin: 'IE00B3D0FQ51',
          currency: 'USD',
          nav: 34.67,
          navDate: new Date('2024-01-15'),
          totalValue: 69340,
          units: 2000,
          performance: {
            daily: 0.78,
            weekly: 2.5,
            monthly: 6.8,
            yearly: 22.1,
            ytd: 5.2,
          },
          risk: 'high',
          expenseRatio: 0.35,
          minInvestment: 2000,
          status: 'active',
          manager: 'BlackRock',
          inceptionDate: new Date('2019-03-20'),
          description: 'ETF globale focalizzato su aziende in crescita con elevati standard ESG',
          sectors: ['Technology', 'Healthcare', 'Consumer Discretionary', 'Communication Services'],
          countries: ['United States', 'Europe', 'Asia Pacific'],
        },
        {
          id: '8',
          name: 'Fondo Bilanciato Dinamico Italia',
          type: 'mixed',
          category: 'domestic',
          isin: 'IT0001234567',
          currency: 'EUR',
          nav: 18.45,
          navDate: new Date('2024-01-15'),
          totalValue: 36900,
          units: 2000,
          performance: {
            daily: 0.12,
            weekly: 0.8,
            monthly: 2.1,
            yearly: 9.5,
            ytd: 2.3,
          },
          risk: 'medium',
          expenseRatio: 0.85,
          minInvestment: 5000,
          status: 'active',
          manager: 'Mediobanca',
          inceptionDate: new Date('2015-06-10'),
          description: 'Fondo bilanciato dinamico con allocazione flessibile tra azioni e obbligazioni italiane',
          sectors: ['Financials', 'Industrials', 'Consumer Goods', 'Utilities'],
          countries: ['Italy'],
        },
        {
          id: '9',
          name: 'ETF Blockchain & AI Leaders',
          type: 'sector',
          category: 'international',
          isin: 'IE00B3D0FQ52',
          currency: 'USD',
          nav: 42.30,
          navDate: new Date('2024-01-15'),
          totalValue: 84600,
          units: 2000,
          performance: {
            daily: 2.15,
            weekly: 8.7,
            monthly: 18.5,
            yearly: 45.2,
            ytd: 12.8,
          },
          risk: 'very_high',
          expenseRatio: 0.65,
          minInvestment: 3000,
          status: 'active',
          manager: 'Invesco',
          inceptionDate: new Date('2020-11-05'),
          description: 'ETF specializzato in aziende leader in blockchain e intelligenza artificiale',
          sectors: ['Technology', 'Communication Services'],
          countries: ['United States', 'Europe', 'Asia'],
        },
        {
          id: '10',
          name: 'Fondo Pensione Sicuro 2035',
          type: 'mixed',
          category: 'domestic',
          isin: 'IT0001234568',
          currency: 'EUR',
          nav: 12.78,
          navDate: new Date('2024-01-15'),
          totalValue: 25560,
          units: 2000,
          performance: {
            daily: 0.08,
            weekly: 0.5,
            monthly: 1.8,
            yearly: 7.2,
            ytd: 1.9,
          },
          risk: 'low',
          expenseRatio: 0.45,
          minInvestment: 1000,
          status: 'active',
          manager: 'Poste Italiane',
          inceptionDate: new Date('2012-01-15'),
          description: 'Fondo pensione a target date con gestione automatica del rischio per il 2035',
          sectors: ['Financials', 'Government Bonds', 'Corporate Bonds'],
          countries: ['Italy', 'Europe'],
        },
        {
          id: '11',
          name: 'ETF Mercati Emergenti SmartBeta',
          type: 'equity',
          category: 'emerging_markets',
          isin: 'IE00B3D0FQ53',
          currency: 'USD',
          nav: 28.90,
          navDate: new Date('2024-01-15'),
          totalValue: 57800,
          units: 2000,
          performance: {
            daily: 0.65,
            weekly: 2.1,
            monthly: 4.8,
            yearly: 16.7,
            ytd: 3.9,
          },
          risk: 'high',
          expenseRatio: 0.55,
          minInvestment: 2500,
          status: 'active',
          manager: 'Vanguard',
          inceptionDate: new Date('2017-08-22'),
          description: 'ETF sui mercati emergenti con strategia SmartBeta per migliorare i rendimenti',
          sectors: ['Technology', 'Financials', 'Consumer Discretionary', 'Materials'],
          countries: ['China', 'India', 'Brazil', 'South Korea', 'Taiwan'],
        },
        {
          id: '12',
          name: 'Fondo Etico Clima & Ambiente',
          type: 'equity',
          category: 'international',
          isin: 'IE00B3D0FQ54',
          currency: 'EUR',
          nav: 31.45,
          navDate: new Date('2024-01-15'),
          totalValue: 62900,
          units: 2000,
          performance: {
            daily: 0.92,
            weekly: 3.2,
            monthly: 7.5,
            yearly: 24.8,
            ytd: 6.1,
          },
          risk: 'high',
          expenseRatio: 0.75,
          minInvestment: 3000,
          status: 'active',
          manager: 'BNP Paribas',
          inceptionDate: new Date('2016-04-12'),
          description: 'Fondo etico specializzato in aziende impegnate nella lotta al cambiamento climatico',
          sectors: ['Renewable Energy', 'Clean Technology', 'Sustainable Materials', 'Environmental Services'],
          countries: ['Europe', 'United States', 'Canada', 'Australia'],
        },
      ];
      
      return mockFunds;
    } catch (error) {
      throw new Error('Failed to fetch funds');
    }
  }

  // Get fund by ID
  async getFund(id: string): Promise<Fund> {
    try {
      const funds = await this.getFunds();
      const fund = funds.find(f => f.id === id);
      if (!fund) {
        throw new Error('Fund not found');
      }
      return fund;
    } catch (error) {
      throw new Error('Failed to fetch fund');
    }
  }

  // Get fund transactions
  async getFundTransactions(fundId: string): Promise<FundTransaction[]> {
    try {
      // Mock data
      const mockTransactions: FundTransaction[] = [
        {
          id: '1',
          fundId,
          type: 'purchase',
          amount: 5000,
          units: 39.84,
          nav: 125.45,
          date: new Date('2024-01-10'),
          fees: 25,
          totalValue: 5025,
          description: 'Initial investment',
        },
        {
          id: '2',
          fundId,
          type: 'dividend',
          amount: 125.45,
          units: 1,
          nav: 125.45,
          date: new Date('2024-01-15'),
          fees: 0,
          totalValue: 125.45,
          description: 'Quarterly dividend',
        },
      ];
      
      return mockTransactions.filter(t => t.fundId === fundId);
    } catch (error) {
      throw new Error('Failed to fetch fund transactions');
    }
  }

  // Get fund performance history
  async getFundPerformance(fundId: string, period: '1m' | '3m' | '6m' | '1y' | '3y' | '5y'): Promise<FundPerformance[]> {
    try {
      // Mock performance data
      const mockPerformance: FundPerformance[] = [
        {
          date: new Date('2024-01-01'),
          nav: 120.00,
          totalValue: 120000,
          units: 1000,
          performance: 0,
        },
        {
          date: new Date('2024-01-15'),
          nav: 125.45,
          totalValue: 125450,
          units: 1000,
          performance: 4.54,
        },
      ];
      
      return mockPerformance;
    } catch (error) {
      throw new Error('Failed to fetch fund performance');
    }
  }

  // Create new fund
  async createFund(data: CreateFundRequest): Promise<Fund> {
    try {
      // Mock implementation
      const newFund: Fund = {
        id: Date.now().toString(),
        name: data.name,
        type: data.type,
        category: data.category,
        isin: data.isin,
        currency: data.currency,
        nav: 0,
        navDate: new Date(),
        totalValue: 0,
        units: 0,
        performance: {
          daily: 0,
          weekly: 0,
          monthly: 0,
          yearly: 0,
          ytd: 0,
        },
        risk: data.risk,
        expenseRatio: data.expenseRatio,
        minInvestment: data.minInvestment,
        status: 'active',
        manager: data.manager,
        inceptionDate: new Date(),
        description: data.description,
      };
      return newFund;
    } catch (error) {
      throw new Error('Failed to create fund');
    }
  }

  // Update fund
  async updateFund(id: string, updates: Partial<Fund>): Promise<Fund> {
    try {
      // Mock implementation
      const fund = await this.getFund(id);
      return { ...fund, ...updates };
    } catch (error) {
      throw new Error('Failed to update fund');
    }
  }

  // Delete fund
  async deleteFund(id: string): Promise<void> {
    try {
      // Mock implementation
      console.log(`Deleting fund ${id}`);
    } catch (error) {
      throw new Error('Failed to delete fund');
    }
  }

  // Add fund transaction
  async addTransaction(transaction: Omit<FundTransaction, 'id'>): Promise<FundTransaction> {
    try {
      // Mock implementation
      const newTransaction: FundTransaction = {
        id: Date.now().toString(),
        fundId: transaction.fundId,
        type: transaction.type,
        amount: transaction.amount,
        units: transaction.units,
        nav: transaction.nav,
        date: transaction.date,
        fees: transaction.fees,
        totalValue: transaction.totalValue,
        description: transaction.description,
      };
      return newTransaction;
    } catch (error) {
      throw new Error('Failed to add transaction');
    }
  }

  // Get fund statistics
  async getFundStats(): Promise<any> {
    try {
      const funds = await this.getFunds();
      
      const stats = {
        totalFunds: funds.length,
        totalValue: funds.reduce((sum, fund) => sum + fund.totalValue, 0),
        averagePerformance: funds.reduce((sum, fund) => sum + fund.performance.yearly, 0) / funds.length,
        byType: funds.reduce((acc, fund) => {
          acc[fund.type] = (acc[fund.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byRisk: funds.reduce((acc, fund) => {
          acc[fund.risk] = (acc[fund.risk] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };
      
      return stats;
    } catch (error) {
      throw new Error('Failed to fetch fund statistics');
    }
  }
}

export const fundService = new FundService();
