
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
          totalBalance: 85000,
          accounts: 2,
          lastActivity: new Date('2024-01-12T18:30:00'),
          address: 'Via del Gusto 123, Firenze',
          taxCode: 'BLT78901234',
        },
        {
          id: '7',
          name: 'Marco Neri',
          email: 'marco.neri@email.com',
          phone: '+39 333 7777777',
          type: 'individual',
          status: 'active',
          totalBalance: 75000,
          accounts: 2,
          lastActivity: new Date('2024-01-15T16:20:00'),
          address: 'Via Milano 456, Bergamo',
          taxCode: 'NRIMRC82D04E123Z',
        },
        {
          id: '8',
          name: 'Fashion Boutique Elegance',
          email: 'info@elegance.it',
          phone: '+39 02 98765432',
          type: 'business',
          status: 'active',
          totalBalance: 320000,
          accounts: 3,
          lastActivity: new Date('2024-01-14T12:15:00'),
          address: 'Via della Moda 789, Milano',
          taxCode: 'ELG23456789',
        },
        {
          id: '9',
          name: 'Anna Moretti',
          email: 'anna.moretti@email.com',
          phone: '+39 333 8888888',
          type: 'individual',
          status: 'active',
          totalBalance: 45000,
          accounts: 1,
          lastActivity: new Date('2024-01-13T14:45:00'),
          address: 'Via Verdi 321, Verona',
          taxCode: 'MRTANN88E05F456A',
        },
        {
          id: '10',
          name: 'Construction Company EdilPro',
          email: 'admin@edilpro.it',
          phone: '+39 011 12345678',
          type: 'business',
          status: 'active',
          totalBalance: 1800000,
          accounts: 6,
          lastActivity: new Date('2024-01-15T09:00:00'),
          address: 'Via delle Costruzioni 654, Torino',
          taxCode: 'EDL34567890',
        },
        {
          id: '11',
          name: 'Roberto Ferrari',
          email: 'roberto.ferrari@email.com',
          phone: '+39 333 9999999',
          type: 'individual',
          status: 'active',
          totalBalance: 95000,
          accounts: 3,
          lastActivity: new Date('2024-01-14T17:30:00'),
          address: 'Via Roma 987, Bologna',
          taxCode: 'FRRRBT76F06G789B',
        },
        {
          id: '12',
          name: 'Dental Clinic Sorriso',
          email: 'info@sorriso.it',
          phone: '+39 041 87654321',
          type: 'business',
          status: 'active',
          totalBalance: 280000,
          accounts: 2,
          lastActivity: new Date('2024-01-15T13:20:00'),
          address: 'Via della Salute 147, Venezia',
          taxCode: 'SRR45678901',
        },
        {
          id: '13',
          name: 'Sofia Conti',
          email: 'sofia.conti@email.com',
          phone: '+39 333 1111111',
          type: 'individual',
          status: 'active',
          totalBalance: 65000,
          accounts: 2,
          lastActivity: new Date('2024-01-12T10:15:00'),
          address: 'Via Garibaldi 258, Palermo',
          taxCode: 'CNTSFO92G07H012C',
        },
        {
          id: '14',
          name: 'Software House CodeLab',
          email: 'admin@codelab.it',
          phone: '+39 070 12345678',
          type: 'business',
          status: 'active',
          totalBalance: 2200000,
          accounts: 7,
          lastActivity: new Date('2024-01-15T11:45:00'),
          address: 'Via del Software 369, Cagliari',
          taxCode: 'CDL56789012',
        },
        {
          id: '15',
          name: 'Giuseppe Romano',
          email: 'giuseppe.romano@email.com',
          phone: '+39 333 2222222',
          type: 'individual',
          status: 'active',
          totalBalance: 110000,
          accounts: 3,
          lastActivity: new Date('2024-01-14T15:10:00'),
          address: 'Via Nazionale 741, Bari',
          taxCode: 'RMNGPP78H08I345D',
        },
        {
          id: '16',
          name: 'Hotel Luxury Palace',
          email: 'info@luxurypalace.it',
          phone: '+39 081 87654321',
          type: 'business',
          status: 'active',
          totalBalance: 950000,
          accounts: 4,
          lastActivity: new Date('2024-01-15T20:30:00'),
          address: 'Via del Mare 852, Napoli',
          taxCode: 'LXP67890123',
        },
        {
          id: '17',
          name: 'Elena Santini',
          email: 'elena.santini@email.com',
          phone: '+39 333 3333333',
          type: 'individual',
          status: 'active',
          totalBalance: 80000,
          accounts: 2,
          lastActivity: new Date('2024-01-13T16:45:00'),
          address: 'Via delle Palme 963, Catania',
          taxCode: 'SNTELN85I09J678E',
        },
        {
          id: '18',
          name: 'Pharmacy Benessere',
          email: 'info@benessere.it',
          phone: '+39 095 12345678',
          type: 'business',
          status: 'active',
          totalBalance: 150000,
          accounts: 2,
          lastActivity: new Date('2024-01-15T12:00:00'),
          address: 'Via della Salute 159, Catania',
          taxCode: 'BNS78901234',
        },
        {
          id: '19',
          name: 'Antonio Russo',
          email: 'antonio.russo@email.com',
          phone: '+39 333 4444444',
          type: 'individual',
          status: 'active',
          totalBalance: 125000,
          accounts: 3,
          lastActivity: new Date('2024-01-14T19:20:00'),
          address: 'Via del Progresso 357, Messina',
          taxCode: 'RSSNTN79J10K901F',
        },
        {
          id: '20',
          name: 'Law Firm Studio Legale',
          email: 'info@studiolegale.it',
          phone: '+39 090 87654321',
          type: 'business',
          status: 'active',
          totalBalance: 420000,
          accounts: 3,
          lastActivity: new Date('2024-01-15T14:15:00'),
          address: 'Via della Giustizia 753, Messina',
          taxCode: 'STL89012345',
        },
        {
          id: '21',
          name: 'Maria Esposito',
          email: 'maria.esposito@email.com',
          phone: '+39 333 5555555',
          type: 'individual',
          status: 'active',
          totalBalance: 90000,
          accounts: 2,
          lastActivity: new Date('2024-01-12T11:30:00'),
          address: 'Via delle Rose 951, Reggio Calabria',
          taxCode: 'SPTMRN83K11L234G',
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

  async createCustomer(customerData: any): Promise<Customer> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCustomer: Customer = {
        id: customerData.id,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        type: customerData.type,
        status: customerData.status,
        totalBalance: customerData.totalBalance || 0,
        accounts: customerData.accounts || 0,
        lastActivity: new Date(),
        address: customerData.address,
        taxCode: customerData.taxCode || `TEMP${Date.now()}`
      };
      
      // Add to mock data
      // this.mockCustomers.push(newCustomer); // This line was removed as mockCustomers is not defined in this class
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
