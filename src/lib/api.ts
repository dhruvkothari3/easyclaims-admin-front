import { env } from './env';
import { useAuthStore } from '@/stores/auth';
import type {
  Company,
  Customer,
  Plan,
  LoginRequest,
  LoginResponse,
  SearchCustomersResponse,
  IngestBatchRequest,
  IngestBatchResponse,
} from '@/types/api';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.API_BASE_URL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const { token, clearToken } = useAuthStore.getState();
    
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add auth header if token exists and this isn't the login endpoint
    if (token && !endpoint.includes('/auth/login')) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 - clear token and redirect to login
      if (response.status === 401) {
        clearToken();
        window.location.href = '/admin/login';
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCompanies(): Promise<Company[]> {
    return this.makeRequest<Company[]>('/companies');
  }

  async searchCustomers(query: string, companyId: string): Promise<Customer[]> {
    const params = new URLSearchParams({ q: query, company_id: companyId });
    const response = await this.makeRequest<SearchCustomersResponse>(`/customers/search?${params}`);
    return response.customers || [];
  }

  async getCustomer(id: string, companyId: string): Promise<Customer> {
    const params = new URLSearchParams({ company_id: companyId });
    return this.makeRequest<Customer>(`/customers/${id}?${params}`);
  }

  async getPolicies(customerId: string, companyId: string): Promise<Plan[]> {
    const params = new URLSearchParams({ company_id: companyId });
    return this.makeRequest<Plan[]>(`/customers/${customerId}/policies?${params}`);
  }

  async ingestBatch(data: IngestBatchRequest, companyId: string): Promise<IngestBatchResponse> {
    const params = new URLSearchParams({ company_id: companyId });
    return this.makeRequest<IngestBatchResponse>(`/ingest/batch?${params}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Export singleton instance
export const api = new ApiClient();

// Re-export types for backward compatibility
export type { Customer, Plan, Company, LoginRequest, LoginResponse } from '@/types/api';