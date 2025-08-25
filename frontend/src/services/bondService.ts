export interface Bond {
  id: string;
  isin: string;
  name: string;
  issuer: string;
  type: 'corporate' | 'government' | 'green' | 'convertible' | 'high_yield' | 'zero_coupon';
  currency: string;
  faceValue: number;
  couponRate: number;
  couponFrequency: 'annual' | 'semi_annual' | 'quarterly' | 'monthly' | 'zero';
  maturityDate: Date;
  issueDate: Date;
  currentPrice: number;
  yieldToMaturity: number;
  currentYield: number;
  duration: number;
  creditRating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'CC' | 'C' | 'D';
  status: 'active' | 'matured' | 'defaulted' | 'called';
  minInvestment: number;
  description: string;
  country: string;
  sector: string;
}

export interface BondTransaction {
  id: string;
  bondId: string;
  type: 'buy' | 'sell' | 'coupon' | 'maturity';
  quantity: number;
  price: number;
  totalValue: number;
  date: Date;
  fees: number;
  description: string;
}

export interface BondPerformance {
  date: Date;
  price: number;
  yield: number;
  volume: number;
}

export interface CreateBondRequest {
  isin: string;
  name: string;
  issuer: string;
  type: Bond['type'];
  currency: string;
  faceValue: number;
  couponRate: number;
  couponFrequency: Bond['couponFrequency'];
  maturityDate: Date;
  issueDate: Date;
  currentPrice: number;
  creditRating: Bond['creditRating'];
  description: string;
  country: string;
  sector: string;
}

class BondService {
  // Get all bonds
  async getBonds(): Promise<Bond[]> {
    try {
      // Mock data for bonds
      const mockBonds: Bond[] = [
        {
          id: '1',
          isin: 'IT0001234567',
          name: 'Obbligazione Corporate FinNext 2028',
          issuer: 'FinNext Bank Group',
          type: 'corporate',
          currency: 'EUR',
          faceValue: 1000,
          couponRate: 4.25,
          couponFrequency: 'annual',
          maturityDate: new Date('2028-06-15'),
          issueDate: new Date('2023-06-15'),
          currentPrice: 1025.50,
          yieldToMaturity: 3.85,
          currentYield: 4.14,
          duration: 4.2,
          creditRating: 'A',
          status: 'active',
          minInvestment: 1000,
          description: 'Obbligazione corporate della FinNext Bank Group con rating A e scadenza 2028',
          country: 'Italy',
          sector: 'Financials',
        },
        {
          id: '2',
          isin: 'IT0001234568',
          name: 'Titolo di Stato Italia 2030 (simulato)',
          issuer: 'Repubblica Italiana',
          type: 'government',
          currency: 'EUR',
          faceValue: 1000,
          couponRate: 2.75,
          couponFrequency: 'semi_annual',
          maturityDate: new Date('2030-03-01'),
          issueDate: new Date('2020-03-01'),
          currentPrice: 985.20,
          yieldToMaturity: 3.12,
          currentYield: 2.79,
          duration: 6.8,
          creditRating: 'BBB',
          status: 'active',
          minInvestment: 1000,
          description: 'BTP simulato con scadenza 2030 e cedola semestrale',
          country: 'Italy',
          sector: 'Government',
        },
        {
          id: '3',
          isin: 'US0001234567',
          name: 'Bond GreenGrid Energy 2027',
          issuer: 'GreenGrid Energy Corp.',
          type: 'green',
          currency: 'USD',
          faceValue: 1000,
          couponRate: 3.50,
          couponFrequency: 'semi_annual',
          maturityDate: new Date('2027-09-15'),
          issueDate: new Date('2022-09-15'),
          currentPrice: 1010.80,
          yieldToMaturity: 3.35,
          currentYield: 3.46,
          duration: 3.4,
          creditRating: 'BBB',
          status: 'active',
          minInvestment: 1000,
          description: 'Green bond per finanziare progetti di energia rinnovabile e sostenibilità',
          country: 'United States',
          sector: 'Energy',
        },
        {
          id: '4',
          isin: 'US0001234568',
          name: 'Obbligazione Convertibile BioNova',
          issuer: 'BioNova Therapeutics Inc.',
          type: 'convertible',
          currency: 'USD',
          faceValue: 1000,
          couponRate: 2.00,
          couponFrequency: 'semi_annual',
          maturityDate: new Date('2029-12-01'),
          issueDate: new Date('2024-01-01'),
          currentPrice: 1085.60,
          yieldToMaturity: 1.45,
          currentYield: 1.84,
          duration: 5.8,
          creditRating: 'BB',
          status: 'active',
          minInvestment: 1000,
          description: 'Obbligazione convertibile in azioni BioNova con opzione di conversione',
          country: 'United States',
          sector: 'Healthcare',
        },
        {
          id: '5',
          isin: 'GB0001234567',
          name: 'Bond High Yield Retail 2026',
          issuer: 'SmartRetail Europe PLC',
          type: 'high_yield',
          currency: 'GBP',
          faceValue: 1000,
          couponRate: 6.50,
          couponFrequency: 'quarterly',
          maturityDate: new Date('2026-03-15'),
          issueDate: new Date('2021-03-15'),
          currentPrice: 945.30,
          yieldToMaturity: 8.25,
          currentYield: 6.88,
          duration: 2.1,
          creditRating: 'B',
          status: 'active',
          minInvestment: 1000,
          description: 'High yield bond del settore retail con cedola trimestrale elevata',
          country: 'United Kingdom',
          sector: 'Retail',
        },
        {
          id: '6',
          isin: 'DE0001234567',
          name: 'Obbligazione Zero Coupon 2025',
          issuer: 'Deutsche Bank AG',
          type: 'zero_coupon',
          currency: 'EUR',
          faceValue: 1000,
          couponRate: 0.00,
          couponFrequency: 'zero',
          maturityDate: new Date('2025-06-30'),
          issueDate: new Date('2020-06-30'),
          currentPrice: 875.40,
          yieldToMaturity: 3.45,
          currentYield: 0.00,
          duration: 1.4,
          creditRating: 'AA',
          status: 'active',
          minInvestment: 1000,
          description: 'Zero coupon bond con scadenza 2025 e rendimento a scadenza del 3.45%',
          country: 'Germany',
          sector: 'Financials',
        },
      ];
      
      return mockBonds;
    } catch (error) {
      throw new Error('Failed to fetch bonds');
    }
  }

  // Get bond by ID
  async getBond(id: string): Promise<Bond> {
    try {
      const bonds = await this.getBonds();
      const bond = bonds.find(b => b.id === id);
      if (!bond) {
        throw new Error('Bond not found');
      }
      return bond;
    } catch (error) {
      throw new Error('Failed to fetch bond');
    }
  }

  // Get bond transactions
  async getBondTransactions(bondId: string): Promise<BondTransaction[]> {
    try {
      // Mock data
      const mockTransactions: BondTransaction[] = [
        {
          id: '1',
          bondId,
          type: 'buy',
          quantity: 10,
          price: 1025.50,
          totalValue: 10255,
          date: new Date('2024-01-10'),
          fees: 25,
          description: 'Acquisto iniziale obbligazioni',
        },
        {
          id: '2',
          bondId,
          type: 'coupon',
          quantity: 10,
          price: 42.50,
          totalValue: 425,
          date: new Date('2024-01-15'),
          fees: 0,
          description: 'Pagamento cedola annuale',
        },
      ];
      
      return mockTransactions.filter(t => t.bondId === bondId);
    } catch (error) {
      throw new Error('Failed to fetch bond transactions');
    }
  }

  // Get bond performance history
  async getBondPerformance(bondId: string, period: '1m' | '3m' | '6m' | '1y' | '3y' | '5y'): Promise<BondPerformance[]> {
    try {
      // Mock performance data
      const mockPerformance: BondPerformance[] = [
        {
          date: new Date('2024-01-01'),
          price: 1020.00,
          yield: 3.90,
          volume: 50000,
        },
        {
          date: new Date('2024-01-15'),
          price: 1025.50,
          yield: 3.85,
          volume: 45000,
        },
      ];
      
      return mockPerformance;
    } catch (error) {
      throw new Error('Failed to fetch bond performance');
    }
  }

  // Create new bond
  async createBond(data: CreateBondRequest): Promise<Bond> {
    try {
      // Mock implementation
      const newBond: Bond = {
        id: Date.now().toString(),
        isin: data.isin,
        name: data.name,
        issuer: data.issuer,
        type: data.type,
        currency: data.currency,
        faceValue: data.faceValue,
        couponRate: data.couponRate,
        couponFrequency: data.couponFrequency,
        maturityDate: data.maturityDate,
        issueDate: data.issueDate,
        currentPrice: data.currentPrice,
        yieldToMaturity: 0,
        currentYield: 0,
        duration: 0,
        creditRating: data.creditRating,
        status: 'active',
        minInvestment: 1000,
        description: data.description,
        country: data.country,
        sector: data.sector,
      };
      
      return newBond;
    } catch (error) {
      throw new Error('Failed to create bond');
    }
  }

  // Update bond
  async updateBond(id: string, data: Partial<Bond>): Promise<Bond> {
    try {
      const bond = await this.getBond(id);
      const updatedBond = { ...bond, ...data };
      return updatedBond;
    } catch (error) {
      throw new Error('Failed to update bond');
    }
  }

  // Delete bond
  async deleteBond(id: string): Promise<void> {
    try {
      // Mock implementation
      console.log(`Bond ${id} deleted`);
    } catch (error) {
      throw new Error('Failed to delete bond');
    }
  }
}

export const bondService = new BondService();
