const API_BASE_URL = '/api/v1';

export const api = {
  async getTransactions() {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },
}; 