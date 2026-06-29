/**
 * Frontend API Service — Phase 2
 * Centralized fetch wrapper for all backend API calls.
 * Base URL: http://localhost:5000/api
 */

const API_BASE = 'http://localhost:5000/api';

function getToken(): string | null {
  return localStorage.getItem('jeevansetu_token');
}

export function setToken(token: string): void {
  localStorage.setItem('jeevansetu_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('jeevansetu_token');
  localStorage.removeItem('jeevansetu_user');
}

export function getStoredUser(): any {
  const u = localStorage.getItem('jeevansetu_user');
  return u ? JSON.parse(u) : null;
}

export function setStoredUser(user: any): void {
  localStorage.setItem('jeevansetu_user', JSON.stringify(user));
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

// ─── Auth ────────────────────────────────────────────────────────
export const authAPI = {
  register: (body: { name: string; email: string; password: string; phone?: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getProfile: () => request('/auth/profile'),
  updateProfile: (body: any) =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  getStats: () => request('/auth/stats'),
};

// ─── Jobs ────────────────────────────────────────────────────────
export const jobsAPI = {
  getJobs: (params?: { category?: string; search?: string; verified?: string; sort?: string; page?: string; limit?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return request(`/jobs${q ? '?' + q : ''}`);
  },
  getJobById: (id: string) => request(`/jobs/${id}`),
  createJob: (body: any) =>
    request('/jobs', { method: 'POST', body: JSON.stringify(body) }),
  updateJob: (id: string, body: any) =>
    request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteJob: (id: string) =>
    request(`/jobs/${id}`, { method: 'DELETE' }),
  applyToJob: (jobId: string | number, body: { method?: string; voice_transcript?: string }) =>
    request(`/jobs/${jobId}/apply`, { method: 'POST', body: JSON.stringify(body) }),
  getApplications: () => request('/jobs/applications'),
  withdrawApplication: (appId: string) =>
    request(`/jobs/applications/${appId}`, { method: 'DELETE' }),
  updateApplicationStatus: (appId: string, status: string) =>
    request(`/jobs/applications/${appId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getSuggestedJobs: () => request('/jobs/suggested'),
  markJobCompleted: (jobId: string) =>
    request(`/jobs/${jobId}/complete`, { method: 'PUT' }),
  // Employer
  getEmployerJobs: () => request('/jobs/employer/jobs'),
  getEmployerApplicants: () => request('/jobs/employer/applicants'),
};

// ─── Chat ────────────────────────────────────────────────────────
export const chatAPI = {
  sendMessage: (text: string, is_voice: boolean = false) =>
    request('/chat/message', { method: 'POST', body: JSON.stringify({ text, is_voice }) }),
  getHistory: () => request('/chat/history'),
  clearHistory: () => request('/chat/history', { method: 'DELETE' }),
};

// ─── Reports (Admin) ────────────────────────────────────────────
export const reportsAPI = {
  getAll: () => request('/reports'),
  addStrike: (reportId: number) => request(`/reports/${reportId}/strike`, { method: 'POST' }),
  markSafe: (reportId: number) => request(`/reports/${reportId}/safe`, { method: 'POST' }),
  blacklistUser: (flaggedId: number) => request(`/reports/flagged/${flaggedId}/blacklist`, { method: 'POST' }),
};

// ─── Verification ────────────────────────────────────────────────
export const verificationAPI = {
  requestOtp: (aadhaar: string) =>
    request('/verification/request-otp', { method: 'POST', body: JSON.stringify({ aadhaar }) }),
  verifyOtp: (otp: string) =>
    request('/verification/verify-otp', { method: 'POST', body: JSON.stringify({ otp }) }),
  getStatus: () => request('/verification/status'),
};

// ─── Farmer Hub ──────────────────────────────────────────────────
export const farmerAPI = {
  getLaborers: () => request('/farmer/laborers'),
  bookLaborer: (id: number) => request(`/farmer/laborers/${id}/book`, { method: 'POST' }),
  getEquipment: () => request('/farmer/equipment'),
  rentEquipment: (id: number) => request(`/farmer/equipment/${id}/rent`, { method: 'POST' }),
  getMandiPrices: () => request('/farmer/mandi-prices'),
};

// ─── Government Schemes ──────────────────────────────────────────
export const schemesAPI = {
  getAllSchemes: (params?: { category?: string; search?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return request(`/schemes${q ? '?' + q : ''}`);
  },
  getSchemeById: (id: string) => request(`/schemes/${id}`),
  getCategories: () => request('/schemes/categories/list'),
  checkEligibility: (body: any) =>
    request('/schemes/eligibility-check', { method: 'POST', body: JSON.stringify(body) }),
};

// ─── Notifications ───────────────────────────────────────────────
export const notificationsAPI = {
  getAll: () => request('/notifications'),
  getUnreadCount: () => request('/notifications/unread-count'),
  markAsRead: (id: string) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead: () => request('/notifications/read-all', { method: 'PUT' }),
};

// ─── Reviews ─────────────────────────────────────────────────────
export const reviewsAPI = {
  getReviews: (targetId: string, targetType?: string) => {
    const params = new URLSearchParams({ target_id: targetId });
    if (targetType) params.set('target_type', targetType);
    return request(`/reviews?${params.toString()}`);
  },
  addReview: (body: { target_id: string; target_type: string; rating: number; comment?: string }) =>
    request('/reviews', { method: 'POST', body: JSON.stringify(body) }),
};

// ─── Health ──────────────────────────────────────────────────────
export const healthAPI = {
  check: () => request('/health'),
};
