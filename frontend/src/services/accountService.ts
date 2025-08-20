import { api } from './api';

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'business';
  accountNumber: string;
  iban: string;
  balance: number;
  currency: string;
  status: 'active' | 'inactive' | 'suspended';
  lastTransaction: Date;
  monthlyTransactions: number;
  interestRate?: number;
  creditLimit?: number;
}

export interface CreateAccountRequest {
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'business';
  currency: string;
  initialBalance?: number;
}

class AccountService {
  async getAccounts(): Promise<Account[]> {
    try {
      // Mock data for now - replace with actual API call
      const mockAccounts: Account[] = [
        {
          id: '1',
          name: 'Conto Corrente Principale',
          type: 'checking',
          accountNumber: '1234567890',
          iban: 'IT60X0542811101000000123456',
          balance: 125000,
          currency: 'EUR',
          status: 'active',
          lastTransaction: new Date('2024-01-15T10:30:00'),
          monthlyTransactions: 45,
        },
        {
          id: '2',
          name: 'Conto Risparmio',
          type: 'savings',
          accountNumber: '0987654321',
          iban: 'IT60X0542811101000000987654',
          balance: 250000,
          currency: 'EUR',
          status: 'active',
          lastTransaction: new Date('2024-01-14T15:20:00'),
          monthlyTransactions: 12,
          interestRate: 2.5,
        },
        {
          id: '3',
          name: 'Carta di Credito',
          type: 'credit',
          accountNumber: '5555666677778888',
          iban: 'IT60X0542811101000000555566',
          balance: -1500,
          currency: 'EUR',
          status: 'active',
          lastTransaction: new Date('2024-01-15T14:45:00'),
          monthlyTransactions: 23,
          creditLimit: 5000,
        },
        {
          id: '4',
          name: 'Conto Aziendale',
          type: 'business',
          accountNumber: '1111222233334444',
          iban: 'IT60X0542811101000000111122',
          balance: 1500000,
          currency: 'EUR',
          status: 'active',
          lastTransaction: new Date('2024-01-15T09:15:00'),
          monthlyTransactions: 156,
        },
        {
          id: '5',
          name: 'Conto USD',
          type: 'checking',
          accountNumber: '9999888877776666',
          iban: 'IT60X0542811101000000999988',
          balance: 50000,
          currency: 'USD',
          status: 'active',
          lastTransaction: new Date('2024-01-13T11:30:00'),
          monthlyTransactions: 8,
        },
      ];
      
      return mockAccounts;
    } catch (error) {
      throw new Error('Failed to fetch accounts');
    }
  }

  async getAccount(id: string): Promise<Account> {
    try {
      const accounts = await this.getAccounts();
      const account = accounts.find(a => a.id === id);
      if (!account) {
        throw new Error('Account not found');
      }
      return account;
    } catch (error) {
      throw new Error('Failed to fetch account');
    }
  }

  async createAccount(data: CreateAccountRequest): Promise<Account> {
    try {
      // Mock implementation
      const newAccount: Account = {
        id: Date.now().toString(),
        name: data.name,
        type: data.type,
        accountNumber: `ACC${Date.now()}`,
        iban: `IT60X0542811101000000${Date.now()}`,
        balance: data.initialBalance || 0,
        currency: data.currency,
        status: 'active',
        lastTransaction: new Date(),
        monthlyTransactions: 0,
      };
      return newAccount;
    } catch (error) {
      throw new Error('Failed to create account');
    }
  }

  async updateAccount(id: string, data: Partial<Account>): Promise<Account> {
    try {
      // Mock implementation
      const account = await this.getAccount(id);
      return { ...account, ...data };
    } catch (error) {
      throw new Error('Failed to update account');
    }
  }

  async deleteAccount(id: string): Promise<void> {
    try {
      // Mock implementation
      console.log(`Deleting account ${id}`);
    } catch (error) {
      throw new Error('Failed to delete account');
    }
  }
}

export const accountService = new AccountService();
