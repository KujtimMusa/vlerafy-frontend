/**
 * Waitlist API Client
 * Funktionen für Waitlist-Submission und Admin-Zugriff
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface WaitlistRequest {
  email: string;
  source?: string;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
}

export interface WaitlistSubscriber {
  id: number;
  email: string;
  created_at: string;
  source: string | null;
}

export interface WaitlistListResponse {
  subscribers: WaitlistSubscriber[];
  total: number;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export interface AdminStats {
  total_subscribers: number;
  subscribers_today: number;
  subscribers_this_week: number;
  subscribers_this_month: number;
}

/**
 * Fügt E-Mail zur Waitlist hinzu
 */
export async function addToWaitlist(
  email: string,
  source: string = 'landing'
): Promise<WaitlistResponse> {
  const response = await fetch(`${API_URL}/api/waitlist/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, source }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to add to waitlist' }));
    return { 
      success: false, 
      message: errorData.message || 'Failed to add to waitlist' 
    };
  }

  return response.json();
}

/**
 * Admin-Login
 */
export async function adminLogin(
  email: string,
  password: string
): Promise<AdminLoginResponse> {
  const response = await fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return response.json();
}

/**
 * Holt Waitlist-Subscriber (nur für Admin)
 */
export async function getWaitlistSubscribers(
  token: string
): Promise<WaitlistListResponse> {
  const response = await fetch(`${API_URL}/api/waitlist/admin/list`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Fehler beim Laden der Waitlist');
  }

  return response.json();
}

/**
 * Holt Admin-Statistiken
 */
export async function getAdminStats(
  token: string
): Promise<AdminStats> {
  const response = await fetch(`${API_URL}/api/admin/stats`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Fehler beim Laden der Statistiken');
  }

  return response.json();
}

/**
 * Verifiziert Admin-Token
 */
export async function verifyAdminToken(
  token: string
): Promise<{ success: boolean; email?: string }> {
  const response = await fetch(`${API_URL}/api/admin/verify`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return { success: false };
  }

  return response.json();
}
