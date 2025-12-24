/**
 * API Client for DataFlow Backend
 * Connects the React frontend to the FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_V1_PREFIX = '/api/v1';

// Token storage keys
const ACCESS_TOKEN_KEY = 'dataflow_access_token';

/**
 * Get the stored access token
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Store the access token
 */
export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

/**
 * Remove the access token
 */
export function removeAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${API_V1_PREFIX}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ==================== AUTH API ====================

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  api_key: string | null;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

/**
 * Register a new user
 */
export async function signUp(data: SignUpData): Promise<UserResponse> {
  return apiRequest<UserResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Sign in a user - returns JWT token
 */
export async function signIn(data: SignInData): Promise<TokenResponse> {
  // OAuth2PasswordRequestForm expects form data, not JSON
  const formData = new URLSearchParams();
  formData.append('username', data.email);
  formData.append('password', data.password);

  const response = await fetch(`${API_BASE_URL}${API_V1_PREFIX}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(errorData.detail || 'Sign in failed');
  }

  return response.json();
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<UserResponse> {
  return apiRequest<UserResponse>('/auth/me');
}

/**
 * Refresh the access token
 */
export async function refreshToken(): Promise<TokenResponse> {
  return apiRequest<TokenResponse>('/auth/refresh', {
    method: 'POST',
  });
}

// ==================== DATASETS API ====================

export interface Dataset {
  id: number;
  name: string;
  platform: 'amazon' | 'shopify' | 'ebay' | 'walmart' | 'etsy';
  category: string;
  description: string;
  record_count: number;
  size: string;
  is_premium: boolean;
  tags: string[];
  preview_data: Record<string, unknown>[];
  last_updated: string;
}

export interface DatasetListResponse {
  datasets: Dataset[];
  total: number;
  page: number;
  per_page: number;
}

export interface DatasetFilters {
  platform?: string;
  category?: string;
  is_premium?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Get list of datasets
 */
export async function getDatasets(filters: DatasetFilters = {}): Promise<DatasetListResponse> {
  const params = new URLSearchParams();
  
  if (filters.platform) params.append('platform', filters.platform);
  if (filters.category) params.append('category', filters.category);
  if (filters.is_premium !== undefined) params.append('is_premium', String(filters.is_premium));
  if (filters.search) params.append('search', filters.search);
  if (filters.limit) params.append('limit', String(filters.limit));
  if (filters.offset) params.append('offset', String(filters.offset));

  const queryString = params.toString();
  return apiRequest<DatasetListResponse>(`/datasets${queryString ? `?${queryString}` : ''}`);
}

/**
 * Get a single dataset by ID
 */
export async function getDataset(id: number): Promise<Dataset> {
  return apiRequest<Dataset>(`/datasets/${id}`);
}

/**
 * Request dataset download
 */
export async function downloadDataset(id: number): Promise<{ download_url: string; expires_at: string; dataset_name: string }> {
  return apiRequest(`/datasets/${id}/download`, {
    method: 'POST',
  });
}

// ==================== SCRAPING API ====================

export interface ScrapeRequestData {
  url: string;
  platform: string;
  fields?: string[];
  webhook?: string;
}

export interface ScrapeStatusResponse {
  request_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  data?: Record<string, unknown>;
  record_count?: number;
  error_message?: string;
  estimated_time?: string;
}

export interface ScrapeHistoryResponse {
  requests: Array<{
    request_id: string;
    url: string;
    platform: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result_count: number;
    created_at: string;
    completed_at?: string;
  }>;
  total: number;
}

/**
 * Submit a new scraping request
 */
export async function submitScrapeRequest(data: ScrapeRequestData): Promise<ScrapeStatusResponse> {
  return apiRequest<ScrapeStatusResponse>('/scrape', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get scrape request status
 */
export async function getScrapeStatus(requestId: string): Promise<ScrapeStatusResponse> {
  return apiRequest<ScrapeStatusResponse>(`/scrape/${requestId}`);
}

/**
 * Get scrape history
 */
export async function getScrapeHistory(limit = 20, offset = 0): Promise<ScrapeHistoryResponse> {
  return apiRequest<ScrapeHistoryResponse>(`/scrape?limit=${limit}&offset=${offset}`);
}

/**
 * Cancel a scrape request
 */
export async function cancelScrapeRequest(requestId: string): Promise<{ message: string }> {
  return apiRequest(`/scrape/${requestId}`, {
    method: 'DELETE',
  });
}

// ==================== ACCOUNT API ====================

export interface AccountResponse {
  id: number;
  email: string;
  name: string;
  plan: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsageResponse {
  api_calls: number;
  quota: number;
  remaining: number;
  reset_date: string | null;
}

/**
 * Get account details
 */
export async function getAccount(): Promise<AccountResponse> {
  return apiRequest<AccountResponse>('/account');
}

/**
 * Get API usage
 */
export async function getUsage(): Promise<UsageResponse> {
  return apiRequest<UsageResponse>('/account/usage');
}

/**
 * Regenerate API key
 */
export async function regenerateApiKey(): Promise<{ api_key: string; message: string }> {
  return apiRequest('/account/api-key/regenerate', {
    method: 'POST',
  });
}

// ==================== BILLING API ====================

export interface PlanResponse {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  api_calls: number;
  highlighted?: boolean;
}

/**
 * Get available plans
 */
export async function getPlans(): Promise<{ plans: PlanResponse[] }> {
  return apiRequest<{ plans: PlanResponse[] }>('/billing/plans');
}

/**
 * Subscribe to a plan
 */
export async function subscribeToPlan(planId: string): Promise<{ message: string; plan: string }> {
  return apiRequest(`/billing/subscribe?plan_id=${planId}`, {
    method: 'POST',
  });
}
