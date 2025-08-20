import { api } from './api';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: Date;
  reference: string;
  accountId: string;
  counterparty?: {
    name: string;
    iban?: string;
  };
}

export interface CreateTransactionRequest {
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: number;
  currency: string;
  description: string;
  accountId: string;
  counterparty?: {
    name: string;
    iban?: string;
  };
}

class TransactionService {
  async getTransactions(): Promise<Transaction[]> {
    try {
      // Mock data for now - replace with actual API call
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'transfer',
          amount: 5000,
          currency: 'EUR',
          description: 'Transfer to Account IT987654321',
          status: 'completed',
          timestamp: new Date('2024-01-15T10:30:00'),
          reference: 'TXN123456789',
          accountId: 'ACC001',
          counterparty: {
            name: 'Mario Rossi',
            iban: 'IT60X0542811101000000987654',
          },
        },
        {
          id: '2',
          type: 'deposit',
          amount: 10000,
          currency: 'EUR',
          description: 'Salary deposit from Company XYZ',
          status: 'completed',
          timestamp: new Date('2024-01-14T09:15:00'),
          reference: 'TXN987654321',
          accountId: 'ACC001',
        },
        {
          id: '3',
          type: 'payment',
          amount: -250,
          currency: 'EUR',
          description: 'Utility bill payment - Electricity',
          status: 'pending',
          timestamp: new Date('2024-01-15T14:20:00'),
          reference: 'TXN456789123',
          accountId: 'ACC001',
        },
        {
          id: '4',
          type: 'withdrawal',
          amount: -1500,
          currency: 'EUR',
          description: 'ATM withdrawal - Via Roma 123',
          status: 'completed',
          timestamp: new Date('2024-01-13T16:45:00'),
          reference: 'TXN789123456',
          accountId: 'ACC001',
        },
        {
          id: '5',
          type: 'transfer',
          amount: 2500,
          currency: 'EUR',
          description: 'Transfer to Account IT123456789',
          status: 'failed',
          timestamp: new Date('2024-01-12T11:20:00'),
          reference: 'TXN321654987',
          accountId: 'ACC001',
          counterparty: {
            name: 'Giulia Bianchi',
            iban: 'IT60X0542811101000000123456',
          },
        },
        {
          id: '6',
          type: 'deposit',
          amount: 5000,
          currency: 'USD',
          description: 'International wire transfer',
          status: 'completed',
          timestamp: new Date('2024-01-11T08:30:00'),
          reference: 'TXN654987321',
          accountId: 'ACC005',
        },
        {
          id: '7',
          type: 'payment',
          amount: -75,
          currency: 'EUR',
          description: 'Netflix subscription',
          status: 'completed',
          timestamp: new Date('2024-01-10T12:00:00'),
          reference: 'TXN147258369',
          accountId: 'ACC001',
        },
        {
          id: '8',
          type: 'transfer',
          amount: 3000,
          currency: 'EUR',
          description: 'Rent payment',
          status: 'pending',
          timestamp: new Date('2024-01-09T15:45:00'),
          reference: 'TXN963852741',
          accountId: 'ACC001',
          counterparty: {
            name: 'Landlord Property Ltd',
            iban: 'IT60X0542811101000000369852',
          },
        },
      ];
      
      return mockTransactions;
    } catch (error) {
      throw new Error('Failed to fetch transactions');
    }
  }

  async getTransaction(id: string): Promise<Transaction> {
    try {
      const transactions = await this.getTransactions();
      const transaction = transactions.find(t => t.id === id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      return transaction;
    } catch (error) {
      throw new Error('Failed to fetch transaction');
    }
  }

  async createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
    try {
      // Mock implementation
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: data.type,
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        status: 'pending',
        timestamp: new Date(),
        reference: `TXN${Date.now()}`,
        accountId: data.accountId,
        counterparty: data.counterparty,
      };
      return newTransaction;
    } catch (error) {
      throw new Error('Failed to create transaction');
    }
  }

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction> {
    try {
      // Mock implementation
      const transaction = await this.getTransaction(id);
      return { ...transaction, ...data };
    } catch (error) {
      throw new Error('Failed to update transaction');
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    try {
      // Mock implementation
      console.log(`Deleting transaction ${id}`);
    } catch (error) {
      throw new Error('Failed to delete transaction');
    }
  }

  async getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
    try {
      const transactions = await this.getTransactions();
      return transactions.filter(t => t.accountId === accountId);
    } catch (error) {
      throw new Error('Failed to fetch account transactions');
    }
  }

  async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    try {
      const transactions = await this.getTransactions();
      return transactions.filter(t => 
        t.timestamp >= startDate && t.timestamp <= endDate
      );
    } catch (error) {
      throw new Error('Failed to fetch transactions by date range');
    }
  }
}

export const transactionService = new TransactionService();
