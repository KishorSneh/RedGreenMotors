import type { Vehicle } from '../components/VehicleCard';

const BASE_URL = 'http://localhost:3000/api';

const getHeaders = (token?: string | null) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const vehiclesApi = {
  async getAll(token?: string | null): Promise<{ vehicles?: Vehicle[]; error?: string }> {
    const response = await fetch(`${BASE_URL}/vehicles`, { headers: getHeaders(token) });
    const result = await response.json();
    if (!response.ok) return { error: result.error || 'Failed to fetch vehicles' };
    return { vehicles: result };
  },

  async search(
    params: { make?: string; model?: string; category?: string; minPrice?: string; maxPrice?: string },
    token?: string | null
  ): Promise<{ vehicles?: Vehicle[]; error?: string }> {
    const query = new URLSearchParams();
    if (params.make) query.append('make', params.make);
    if (params.model) query.append('model', params.model);
    if (params.category) query.append('category', params.category);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);

    const response = await fetch(`${BASE_URL}/vehicles/search?${query.toString()}`, {
      headers: getHeaders(token),
    });
    const result = await response.json();
    if (!response.ok) return { error: result.error || 'Search failed' };
    return { vehicles: result };
  },

  async create(
    data: { make: string; model: string; category: string; price: number; quantity: number },
    token?: string | null
  ): Promise<{ vehicle?: Vehicle; error?: string }> {
    const response = await fetch(`${BASE_URL}/vehicles`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: result.error || 'Failed to create vehicle' };
    return { vehicle: result };
  },

  async update(
    id: string,
    data: Partial<{ make: string; model: string; category: string; price: number; quantity: number }>,
    token?: string | null
  ): Promise<{ vehicle?: Vehicle; error?: string }> {
    const response = await fetch(`${BASE_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: result.error || 'Failed to update vehicle' };
    return { vehicle: result };
  },

  async delete(id: string, token?: string | null): Promise<{ success: boolean; error?: string }> {
    const response = await fetch(`${BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!response.ok) {
      const result = await response.json().catch(() => ({ error: 'Failed to delete vehicle' }));
      return { success: false, error: result.error };
    }
    return { success: true };
  },

  async purchase(id: string, token?: string | null): Promise<{ vehicle?: Vehicle; error?: string }> {
    const response = await fetch(`${BASE_URL}/vehicles/${id}/purchase`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    const result = await response.json();
    if (!response.ok) return { error: result.error || 'Purchase failed' };
    return { vehicle: result };
  },

  async restock(id: string, amount: number, token?: string | null): Promise<{ vehicle?: Vehicle; error?: string }> {
    const response = await fetch(`${BASE_URL}/vehicles/${id}/restock`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ amount }),
    });
    const result = await response.json();
    if (!response.ok) return { error: result.error || 'Restock failed' };
    return { vehicle: result };
  },
};
