import type { User } from '../context/AuthContext';

const BASE_URL = 'http://localhost:3000/api';

export interface AuthResponse {
  token?: string;
  user?: User;
  error?: string;
}

export const authApi = {
  async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      return { error: result.error || 'Registration failed' };
    }
    return { user: result };
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      return { error: result.error || 'Login failed' };
    }
    return result;
  },
};
