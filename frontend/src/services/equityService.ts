export interface Equity {
  id: string;
  symbol: string;
  name: string;
  sector: 'technology' | 'healthcare' | 'energy' | 'financials' | 'aerospace' | 'retail' | 'software';
  exchange: string;
  currency: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  peRatio: number;
  dividendYield: number;
  beta: number;
  high52Week: number;
  low52Week: number;
  description: string;
  country: string;
  employees: number;
  founded: number;
  status: 'active' | 'suspended' | 'delisted';
}

export interface EquityTransaction {
  id: string;
  equityId: string;
  type: 'buy' | 'sell' | 'dividend' | 'split';
  shares: number;
  price: number;
  totalValue: number;
  date: Date;
  fees: number;
  description: string;
}

export interface EquityPerformance {
  date: Date;
  price: number;
  volume: number;
  change: number;
  changePercent: number;
}

export interface CreateEquityRequest {
  symbol: string;
  name: string;
  sector: Equity['sector'];
  exchange: string;
  currency: string;
  currentPrice: number;
  description: string;
  country: string;
}

class EquityService {
  // Get all equities
  async getEquities(): Promise<Equity[]> {
    try {
      // Mock data for equities
      const mockEquities: Equity[] = [
        {
          id: '1',
          symbol: 'GTI',
          name: 'GlobalTech Industries S.p.A.',
          sector: 'technology',
          exchange: 'MIL',
          currency: 'EUR',
          currentPrice: 45.80,
          previousClose: 44.20,
          change: 1.60,
          changePercent: 3.62,
          marketCap: 2850000000,
          volume: 1250000,
          peRatio: 18.5,
          dividendYield: 2.1,
          beta: 1.15,
          high52Week: 52.40,
          low52Week: 38.90,
          description: 'Leader italiano nella produzione di componenti tecnologici avanzati per l\'industria 4.0',
          country: 'Italy',
          employees: 8500,
          founded: 1995,
          status: 'active',
        },
        {
          id: '2',
          symbol: 'BNTX',
          name: 'BioNova Therapeutics Inc.',
          sector: 'healthcare',
          exchange: 'NASDAQ',
          currency: 'USD',
          currentPrice: 128.50,
          previousClose: 125.80,
          change: 2.70,
          changePercent: 2.15,
          marketCap: 18500000000,
          volume: 3200000,
          peRatio: 25.8,
          dividendYield: 0.0,
          beta: 1.45,
          high52Week: 145.20,
          low52Week: 98.40,
          description: 'Azienda biotecnologica specializzata in terapie innovative per malattie rare e oncologiche',
          country: 'United States',
          employees: 3200,
          founded: 2008,
          status: 'active',
        },
        {
          id: '3',
          symbol: 'GGE',
          name: 'GreenGrid Energy Corp.',
          sector: 'energy',
          exchange: 'NYSE',
          currency: 'USD',
          currentPrice: 67.30,
          previousClose: 68.90,
          change: -1.60,
          changePercent: -2.32,
          marketCap: 8900000000,
          volume: 2100000,
          peRatio: 22.1,
          dividendYield: 3.2,
          beta: 0.85,
          high52Week: 72.80,
          low52Week: 52.10,
          description: 'Società energetica focalizzata su soluzioni rinnovabili e reti intelligenti',
          country: 'United States',
          employees: 5200,
          founded: 2010,
          status: 'active',
        },
        {
          id: '4',
          symbol: 'FNBG',
          name: 'FinNext Bank Group',
          sector: 'financials',
          exchange: 'LSE',
          currency: 'GBP',
          currentPrice: 12.45,
          previousClose: 12.20,
          change: 0.25,
          changePercent: 2.05,
          marketCap: 15600000000,
          volume: 8500000,
          peRatio: 12.8,
          dividendYield: 4.8,
          beta: 0.95,
          high52Week: 13.80,
          low52Week: 9.90,
          description: 'Gruppo bancario europeo specializzato in servizi finanziari digitali e fintech',
          country: 'United Kingdom',
          employees: 12500,
          founded: 2005,
          status: 'active',
        },
        {
          id: '5',
          symbol: 'ASDL',
          name: 'AeroSpace Dynamics Ltd.',
          sector: 'aerospace',
          exchange: 'TSX',
          currency: 'CAD',
          currentPrice: 89.75,
          previousClose: 87.40,
          change: 2.35,
          changePercent: 2.69,
          marketCap: 7200000000,
          volume: 950000,
          peRatio: 28.9,
          dividendYield: 1.5,
          beta: 1.25,
          high52Week: 95.20,
          low52Week: 68.30,
          description: 'Azienda aerospaziale canadese leader nella produzione di componenti per satelliti e veicoli spaziali',
          country: 'Canada',
          employees: 6800,
          founded: 1998,
          status: 'active',
        },
        {
          id: '6',
          symbol: 'SREP',
          name: 'SmartRetail Europe PLC',
          sector: 'retail',
          exchange: 'FRA',
          currency: 'EUR',
          currentPrice: 34.20,
          previousClose: 33.80,
          change: 0.40,
          changePercent: 1.18,
          marketCap: 4200000000,
          volume: 1800000,
          peRatio: 16.2,
          dividendYield: 2.8,
          beta: 0.75,
          high52Week: 38.90,
          low52Week: 28.40,
          description: 'Catena retail europea specializzata in soluzioni di vendita intelligenti e e-commerce',
          country: 'Germany',
          employees: 9500,
          founded: 2003,
          status: 'active',
        },
        {
          id: '7',
          symbol: 'QST',
          name: 'QuantumSoft Technologies',
          sector: 'software',
          exchange: 'ASX',
          currency: 'AUD',
          currentPrice: 156.80,
          previousClose: 152.40,
          change: 4.40,
          changePercent: 2.89,
          marketCap: 12500000000,
          volume: 680000,
          peRatio: 35.2,
          dividendYield: 0.8,
          beta: 1.35,
          high52Week: 168.90,
          low52Week: 112.60,
          description: 'Azienda software australiana leader nello sviluppo di soluzioni quantistiche e AI avanzate',
          country: 'Australia',
          employees: 4200,
          founded: 2012,
          status: 'active',
        },
      ];
      
      return mockEquities;
    } catch (error) {
      throw new Error('Failed to fetch equities');
    }
  }

  // Get equity by ID
  async getEquity(id: string): Promise<Equity> {
    try {
      const equities = await this.getEquities();
      const equity = equities.find(e => e.id === id);
      if (!equity) {
        throw new Error('Equity not found');
      }
      return equity;
    } catch (error) {
      throw new Error('Failed to fetch equity');
    }
  }

  // Get equity transactions
  async getEquityTransactions(equityId: string): Promise<EquityTransaction[]> {
    try {
      // Mock data
      const mockTransactions: EquityTransaction[] = [
        {
          id: '1',
          equityId,
          type: 'buy',
          shares: 100,
          price: 45.80,
          totalValue: 4580,
          date: new Date('2024-01-10'),
          fees: 15,
          description: 'Acquisto iniziale',
        },
        {
          id: '2',
          equityId,
          type: 'dividend',
          shares: 100,
          price: 0.96,
          totalValue: 96,
          date: new Date('2024-01-15'),
          fees: 0,
          description: 'Dividendo trimestrale',
        },
      ];
      
      return mockTransactions.filter(t => t.equityId === equityId);
    } catch (error) {
      throw new Error('Failed to fetch equity transactions');
    }
  }

  // Get equity performance history
  async getEquityPerformance(equityId: string, period: '1m' | '3m' | '6m' | '1y' | '3y' | '5y'): Promise<EquityPerformance[]> {
    try {
      // Mock performance data
      const mockPerformance: EquityPerformance[] = [
        {
          date: new Date('2024-01-01'),
          price: 44.20,
          volume: 1200000,
          change: 0,
          changePercent: 0,
        },
        {
          date: new Date('2024-01-15'),
          price: 45.80,
          volume: 1250000,
          change: 1.60,
          changePercent: 3.62,
        },
      ];
      
      return mockPerformance;
    } catch (error) {
      throw new Error('Failed to fetch equity performance');
    }
  }

  // Create new equity
  async createEquity(data: CreateEquityRequest): Promise<Equity> {
    try {
      // Mock implementation
      const newEquity: Equity = {
        id: Date.now().toString(),
        symbol: data.symbol,
        name: data.name,
        sector: data.sector,
        exchange: data.exchange,
        currency: data.currency,
        currentPrice: data.currentPrice,
        previousClose: data.currentPrice,
        change: 0,
        changePercent: 0,
        marketCap: 0,
        volume: 0,
        peRatio: 0,
        dividendYield: 0,
        beta: 1.0,
        high52Week: data.currentPrice,
        low52Week: data.currentPrice,
        description: data.description,
        country: data.country,
        employees: 0,
        founded: new Date().getFullYear(),
        status: 'active',
      };
      
      return newEquity;
    } catch (error) {
      throw new Error('Failed to create equity');
    }
  }

  // Update equity
  async updateEquity(id: string, data: Partial<Equity>): Promise<Equity> {
    try {
      const equity = await this.getEquity(id);
      const updatedEquity = { ...equity, ...data };
      return updatedEquity;
    } catch (error) {
      throw new Error('Failed to update equity');
    }
  }

  // Delete equity
  async deleteEquity(id: string): Promise<void> {
    try {
      // Mock implementation
      console.log(`Equity ${id} deleted`);
    } catch (error) {
      throw new Error('Failed to delete equity');
    }
  }
}

export const equityService = new EquityService();
