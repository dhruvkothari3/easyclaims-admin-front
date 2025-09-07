import { env } from './env';
import { auth } from './auth';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Policy {
  id: string;
  policyNumber: string;
  type: string;
  premium: number;
  status: 'Active' | 'Expired' | 'Cancelled';
  startDate: string;
  endDate: string;
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91-9876543210',
    createdAt: '2024-01-15'
  },
  {
    id: '2',  
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+91-9876543211',
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com', 
    phone: '+91-9876543212',
    createdAt: '2024-03-10'
  }
];

const mockPolicies: Record<string, Policy[]> = {
  '1': [
    {
      id: '1',
      policyNumber: 'POL-2024-001',
      type: 'Health Insurance',
      premium: 25000,
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    {
      id: '2', 
      policyNumber: 'POL-2024-002',
      type: 'Life Insurance',
      premium: 15000,
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    }
  ],
  '2': [
    {
      id: '3',
      policyNumber: 'POL-2024-003', 
      type: 'Vehicle Insurance',
      premium: 12000,
      status: 'Active',
      startDate: '2024-02-01',
      endDate: '2025-01-31'
    }
  ],
  '3': [
    {
      id: '4',
      policyNumber: 'POL-2024-004',
      type: 'Home Insurance', 
      premium: 8000,
      status: 'Expired',
      startDate: '2023-03-01',
      endDate: '2024-02-29'
    }
  ]
};

// API functions
export const api = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    if (env.USE_MOCKS) {
      // Mock: accept any email/password
      return { token: 'mock-token-' + Date.now() };
    }
    
    const response = await fetch(`${env.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  searchCustomers: async (by: 'id' | 'phone' | 'name', query: string): Promise<Customer[]> => {
    if (env.USE_MOCKS) {
      return mockCustomers.filter(customer => {
        const value = customer[by === 'id' ? 'id' : by === 'phone' ? 'phone' : 'name'].toLowerCase();
        return value.includes(query.toLowerCase());
      });
    }
    
    const token = auth.getToken();
    const response = await fetch(`${env.API_BASE_URL}/customers/search?by=${by}&q=${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  },

  getCustomerPolicies: async (customerId: string): Promise<Policy[]> => {
    if (env.USE_MOCKS) {
      return mockPolicies[customerId] || [];
    }
    
    const token = auth.getToken();
    const response = await fetch(`${env.API_BASE_URL}/customers/${customerId}/policies`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to fetch policies');
    return response.json();
  }
};