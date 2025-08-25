// Configurazione API
const API_CONFIG = {
  // URL base per le diverse API
  CORE_BANKING_URL: process.env.REACT_APP_CORE_BANKING_URL || 'http://localhost:3001',
  CRYPTO_URL: process.env.REACT_APP_CRYPTO_URL || 'http://localhost:3002',
  
  // Timeout per le chiamate API
  TIMEOUT: 10000,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  
  // Debug mode
  DEBUG: process.env.NODE_ENV === 'development'
};

// Funzione per log di debug
const debugLog = (...args: any[]) => {
  if (API_CONFIG.DEBUG) {
    console.log('🌐 [API]', ...args);
  }
};

// URL base per le API
const API_BASE_URL = API_CONFIG.CORE_BANKING_URL;

interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    debugLog(`🔄 Making request to: ${url}`);
    debugLog(`📝 Request options:`, options);
    
    // Add default headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      (headers as Record<string, string>).Authorization = `Bearer ${token}`;
      debugLog('🔑 Auth token added to request');
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      debugLog(`📡 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('token');
          window.location.href = '/login';
          throw new Error('Unauthorized access');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      debugLog(`✅ Response data:`, data);
      return data;
    } catch (error) {
      debugLog(`❌ Request failed:`, error);
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Create API instance
const api = new ApiService();

// Legacy interceptor interface for backward compatibility
(api as any).interceptors = {
  request: {
    use: (onFulfilled: any, onRejected: any) => {
      // Request interceptors can be implemented here if needed
    },
  },
  response: {
    use: (onFulfilled: any, onRejected: any) => {
      // Response interceptors can be implemented here if needed
    },
  },
};

export { api };
