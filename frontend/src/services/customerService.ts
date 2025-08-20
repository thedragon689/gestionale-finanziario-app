import { api } from './api';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'individual' | 'business';
  status: 'active' | 'inactive' | 'suspended';
  totalBalance: number;
  accounts: number;
  lastActivity: Date;
  address: string;
  taxCode: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  type: 'individual' | 'business';
  address: string;
  taxCode: string;
}

class CustomerService {
  async getCustomers(): Promise<Customer[]> {
    try {
      // Mock data for now - replace with actual API call
      const mockCustomers: Customer[] = [
        {
          id: '1',
          name: 'Mario Rossi',
          email: 'mario.rossi@email.com',
          phone: '+39 333 1234567',
          type: 'individual',
          status: 'active',
          totalBalance: 125000,
          accounts: 3,
          lastActivity: new Date('2024-01-15T10:30:00'),
          address: 'Via Roma 123, Milano',
          taxCode: 'RSSMRA80A01H501U',
        },
        {
          id: '2',
          name: 'Azienda XYZ SRL',
          email: 'info@aziendaxyz.it',
          phone: '+39 02 12345678',
          type: 'business',
          status: 'active',
          totalBalance: 2500000,
          accounts: 5,
          lastActivity: new Date('2024-01-14T15:20:00'),
          address: 'Via del Commercio 456, Roma',
          taxCode: 'XYZ12345678',
        },
        {
          id: '3',
          name: 'Giulia Bianchi',
          email: 'giulia.bianchi@email.com',
          phone: '+39 333 9876543',
          type: 'individual',
          status: 'inactive',
          totalBalance: 5000,
          accounts: 1,
          lastActivity: new Date('2024-01-10T09:15:00'),
          address: 'Via Garibaldi 789, Napoli',
          taxCode: 'BNCGLI85B02F839X',
        },
        {
          id: '4',
          name: 'Tech Solutions SpA',
          email: 'admin@techsolutions.it',
          phone: '+39 06 87654321',
          type: 'business',
          status: 'active',
          totalBalance: 1500000,
          accounts: 8,
          lastActivity: new Date('2024-01-15T14:45:00'),
          address: 'Via della Tecnologia 321, Torino',
          taxCode: 'TCH45678901',
        },
        {
          id: '5',
          name: 'Luca Verdi',
          email: 'luca.verdi@email.com',
          phone: '+39 333 5555555',
          type: 'individual',
          status: 'suspended',
          totalBalance: 0,
          accounts: 2,
          lastActivity: new Date('2024-01-05T11:30:00'),
          address: 'Via delle Rose 654, Firenze',
          taxCode: 'VRDLCU90C03D612Y',
        },
        {
          id: '6',
          name: 'Restaurant Bella Italia',
          email: 'info@bellitalia.it',
          phone: '+39 055 1234567',
          type: 'business',
          status: 'active',
          totalBalance: 75000,
          accounts: 2,
          lastActivity: new Date('2024-01-15T18:30:00'),
          address: 'Piazza della Signoria 15, Firenze',
          taxCode: 'BLT12345678',
        },
        {
          id: '7',
          name: 'Anna Neri',
          email: 'anna.neri@email.com',
          phone: '+39 333 7777777',
          type: 'individual',
          status: 'active',
          totalBalance: 85000,
          accounts: 2,
          lastActivity: new Date('2024-01-14T16:20:00'),
          address: 'Via dei Mille 42, Palermo',
          taxCode: 'NREANN75C04G273K',
        },
        {
          id: '8',
          name: 'Construction Pro Srl',
          email: 'info@constructionpro.it',
          phone: '+39 081 9876543',
          type: 'business',
          status: 'active',
          totalBalance: 320000,
          accounts: 4,
          lastActivity: new Date('2024-01-15T12:15:00'),
          address: 'Via delle Industrie 78, Bari',
          taxCode: 'CST98765432',
        },
      ];
      
      return mockCustomers;
    } catch (error) {
      throw new Error('Failed to fetch customers');
    }
  }

  async getCustomer(id: string): Promise<Customer> {
    try {
      const customers = await this.getCustomers();
      const customer = customers.find(c => c.id === id);
      if (!customer) {
        throw new Error('Customer not found');
      }
      return customer;
    } catch (error) {
      throw new Error('Failed to fetch customer');
    }
  }

  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    try {
      // Mock implementation
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        type: data.type,
        status: 'active',
        totalBalance: 0,
        accounts: 0,
        lastActivity: new Date(),
        address: data.address,
        taxCode: data.taxCode,
      };
      return newCustomer;
    } catch (error) {
      throw new Error('Failed to create customer');
    }
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    try {
      // Mock implementation
      const customer = await this.getCustomer(id);
      return { ...customer, ...data };
    } catch (error) {
      throw new Error('Failed to update customer');
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      // Mock implementation
      console.log(`Deleting customer ${id}`);
    } catch (error) {
      throw new Error('Failed to delete customer');
    }
  }

  async getCustomersByType(type: 'individual' | 'business'): Promise<Customer[]> {
    try {
      const customers = await this.getCustomers();
      return customers.filter(c => c.type === type);
    } catch (error) {
      throw new Error('Failed to fetch customers by type');
    }
  }

  async getCustomersByStatus(status: 'active' | 'inactive' | 'suspended'): Promise<Customer[]> {
    try {
      const customers = await this.getCustomers();
      return customers.filter(c => c.status === status);
    } catch (error) {
      throw new Error('Failed to fetch customers by status');
    }
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    try {
      const customers = await this.getCustomers();
      const lowerQuery = query.toLowerCase();
      return customers.filter(c => 
        c.name.toLowerCase().includes(lowerQuery) ||
        c.email.toLowerCase().includes(lowerQuery) ||
        c.taxCode.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      throw new Error('Failed to search customers');
    }
  }
}

export const customerService = new CustomerService();
