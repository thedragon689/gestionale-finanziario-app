import { api } from './api';

export interface ServiceStatus {
  serviceName: string;
  apiImport: boolean;
  apiUsage: boolean;
  mockData: boolean;
  status: 'ok' | 'warning' | 'error';
  message: string;
}

export interface SystemStatus {
  timestamp: string;
  services: ServiceStatus[];
  environment: {
    nodeEnv: string;
    apiUrl: string;
    coreBankingUrl: string;
    cryptoUrl: string;
  };
  localStorage: {
    token: boolean;
    user: boolean;
  };
}

class DebugService {
  async checkServiceStatus(): Promise<SystemStatus> {
    const services: ServiceStatus[] = [];
    
    // Check API import
    try {
      const apiImport = typeof api !== 'undefined';
      const apiUsage = typeof api.get === 'function';
      
      services.push({
        serviceName: 'API Service',
        apiImport,
        apiUsage,
        mockData: false,
        status: apiImport && apiUsage ? 'ok' : 'error',
        message: apiImport && apiUsage ? 'API service loaded correctly' : 'API service not available'
      });
    } catch (error) {
      services.push({
        serviceName: 'API Service',
        apiImport: false,
        apiUsage: false,
        mockData: false,
        status: 'error',
        message: `API service error: ${error instanceof Error ? error.message : String(error)}`
      });
    }

    // Check environment variables
    const environment = {
      nodeEnv: process.env.NODE_ENV || 'undefined',
      apiUrl: process.env.REACT_APP_API_URL || 'undefined',
      coreBankingUrl: process.env.REACT_APP_CORE_BANKING_URL || 'undefined',
      cryptoUrl: process.env.REACT_APP_CRYPTO_URL || 'undefined'
    };

    // Check localStorage
    const localStorageStatus = {
      token: !!window.localStorage.getItem('token'),
      user: !!window.localStorage.getItem('user')
    };

    // Test API connection
    try {
      await api.get('/health');
      services.push({
        serviceName: 'API Connection',
        apiImport: true,
        apiUsage: true,
        mockData: false,
        status: 'ok',
        message: 'API connection successful'
      });
    } catch (error) {
      services.push({
        serviceName: 'API Connection',
        apiImport: true,
        apiUsage: true,
        mockData: false,
        status: 'warning',
        message: `API connection failed: ${error}. Using mock data.`
      });
    }

    return {
      timestamp: new Date().toISOString(),
      services,
      environment,
      localStorage: localStorageStatus
    };
  }

  async testMockData(): Promise<{ [key: string]: any }> {
    const results: { [key: string]: any } = {};
    
    try {
      // Test account service
      const { accountService } = await import('./accountService');
      const accounts = await accountService.getAccounts();
      results.accounts = {
        success: true,
        count: accounts.length,
        data: accounts.slice(0, 2) // First 2 accounts
      };
    } catch (error) {
      results.accounts = {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }

    try {
      // Test customer service
      const { customerService } = await import('./customerService');
      const customers = await customerService.getCustomers();
      results.customers = {
        success: true,
        count: customers.length,
        data: customers.slice(0, 2) // First 2 customers
      };
    } catch (error) {
      results.customers = {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }

    try {
      // Test report service
      const { reportService } = await import('./reportService');
      const financialData = await reportService.getFinancialData();
      results.reports = {
        success: true,
        data: financialData
      };
    } catch (error) {
      results.reports = {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }

    return results;
  }

  logSystemStatus(): void {
    console.group('🔍 System Debug Information');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('API URL:', process.env.REACT_APP_API_URL);
    console.log('Core Banking URL:', process.env.REACT_APP_CORE_BANKING_URL);
    console.log('Crypto URL:', process.env.REACT_APP_CRYPTO_URL);
    console.log('Local Storage Token:', !!localStorage.getItem('token'));
    console.log('Local Storage User:', !!localStorage.getItem('user'));
    console.groupEnd();
  }
}

export const debugService = new DebugService();
export default DebugService;
