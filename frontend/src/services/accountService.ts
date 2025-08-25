

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
  private mockAccounts: Account[] = [
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

  async getAccounts(): Promise<Account[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.mockAccounts;
  }

  async getAccount(id: string): Promise<Account | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.mockAccounts.find(account => account.id === id) || null;
  }

  async createAccount(accountData: any): Promise<Account> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAccount: Account = {
      id: accountData.id,
      name: accountData.name,
      type: accountData.type,
      accountNumber: accountData.accountNumber,
      iban: accountData.iban,
      balance: accountData.balance,
      currency: accountData.currency,
      status: accountData.status,
      lastTransaction: new Date(),
      monthlyTransactions: accountData.monthlyTransactions || 0,
      interestRate: accountData.interestRate,
      creditLimit: accountData.creditLimit
    };
    
    this.mockAccounts.push(newAccount);
    return newAccount;
  }

  async updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = this.mockAccounts.findIndex(account => account.id === id);
    if (index === -1) {
      throw new Error('Account not found');
    }
    this.mockAccounts[index] = { ...this.mockAccounts[index], ...updates };
    return this.mockAccounts[index];
  }

  async deleteAccount(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = this.mockAccounts.findIndex(account => account.id === id);
    if (index === -1) {
      throw new Error('Account not found');
    }
    this.mockAccounts.splice(index, 1);
  }

  async getAccountBalance(id: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const account = this.mockAccounts.find(acc => acc.id === id);
    return account?.balance || 0;
  }

  async getAccountsByType(type: Account['type']): Promise<Account[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.mockAccounts.filter(account => account.type === type);
  }

  async getAccountsByStatus(status: Account['status']): Promise<Account[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.mockAccounts.filter(account => account.status === status);
  }
}

export const accountService = new AccountService();
