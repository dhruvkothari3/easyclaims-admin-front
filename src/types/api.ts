// API Types
export interface Company {
  id: string;
  name: string;
  company_key: string;
}

export interface Customer {
  id: string;
  external_id?: string;
  full_name: string;
  email?: string;
  phone_e164?: string;
  city?: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  external_plan_id: string;
  plan_name?: string;
  plan_type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface SearchCustomersResponse {
  customers: Customer[];
}

export interface IngestRecord {
  external_id?: string;
  full_name: string;
  email?: string;
  phone?: string;
  city?: string;
  plans?: {
    external_plan_id: string;
    plan_name?: string;
    plan_type?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }[];
}

export interface IngestBatchRequest {
  records: IngestRecord[];
}

export interface IngestBatchResponse {
  ok: boolean;
  counts: {
    inserted: number;
    updated: number;
    linked: number;
    errors: number;
  };
  error_rows?: Array<{
    index: number;
    reason: string;
  }>;
}