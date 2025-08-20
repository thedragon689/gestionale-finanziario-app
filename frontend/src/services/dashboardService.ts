import { api } from './api';

export interface DashboardData {
  stats: {
    totalBalance: number;
    monthlyGrowth: number;
    activeAccounts: number;
    totalTransactions: number;
  };
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    currency: string;
    description: string;
    status: string;
    timestamp: Date;
  }>;
  cryptoPrices: Array<{
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    changePercent: number;
  }>;
  systemAlerts: Array<{
    id: string;
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
    timestamp: Date;
  }>;
}

class DashboardService {
  async getDashboardData(): Promise<DashboardData> {
    try {
      // Mock data for now - replace with actual API call
      const mockData: DashboardData = {
        stats: {
          totalBalance: 125000,
          monthlyGrowth: 8.5,
          activeAccounts: 45,
          totalTransactions: 1234,
        },
        transactions: [
          {
            id: '1',
            type: 'transfer',
            amount: 5000,
            currency: 'EUR',
            description: 'Transfer to Account IT987654321',
            status: 'completed',
            timestamp: new Date('2024-01-15T10:30:00'),
          },
          {
            id: '2',
            type: 'deposit',
            amount: 10000,
            currency: 'EUR',
            description: 'Salary deposit',
            status: 'completed',
            timestamp: new Date('2024-01-14T09:15:00'),
          },
          {
            id: '3',
            type: 'payment',
            amount: -250,
            currency: 'EUR',
            description: 'Utility bill payment',
            status: 'pending',
            timestamp: new Date('2024-01-15T14:20:00'),
          },
        ],
        cryptoPrices: [
          {
            symbol: 'BTC',
            name: 'Bitcoin',
            price: 45000,
            change24h: 1200,
            changePercent: 2.7,
          },
          {
            symbol: 'ETH',
            name: 'Ethereum',
            price: 3000,
            change24h: -50,
            changePercent: -1.6,
          },
          {
            symbol: 'ADA',
            name: 'Cardano',
            price: 1.2,
            change24h: 0.05,
            changePercent: 4.3,
          },
          {
            symbol: 'DOT',
            name: 'Polkadot',
            price: 25,
            change24h: -1.2,
            changePercent: -4.6,
          },
        ],
        systemAlerts: [],
      };
      
      return mockData;
    } catch (error) {
      throw new Error('Failed to fetch dashboard data');
    }
  }

  async getChartData(period: string = '6m'): Promise<any> {
    try {
      // Mock chart data
      return {
        balance: [100000, 105000, 110000, 115000, 120000, 125000],
        transactions: [65, 45, 30, 25],
        portfolio: [70, 20, 7, 3],
      };
    } catch (error) {
      throw new Error('Failed to fetch chart data');
    }
  }
}

export const dashboardService = new DashboardService();
