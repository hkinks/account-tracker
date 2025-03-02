import { CreateAccountDto } from "../pages/Accounts";
import { CreateBalanceRecordDto } from "../pages/BalanceRecords";

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const api = {
  async getTransactions() {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },

  async updateTransactionTag(id: number, tag: string) {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}/tag`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tag }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },

  async getAccounts() {
    const response = await fetch(`${API_BASE_URL}/accounts`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },

  async getBalanceRecords() {
    const response = await fetch(`${API_BASE_URL}/balance-records`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },

  async createBalanceRecord(data: CreateBalanceRecordDto) {
    const response = await fetch(`${API_BASE_URL}/balance-records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create balance record: ${response.statusText}`,
      );
    }

    return await response.json();
  },

  async deleteBalanceRecord(id: string) {
    const response = await fetch(`${API_BASE_URL}/balance-records/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return;
  },

  async createAccount(data: CreateAccountDto) {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create account: ${response.statusText}`,
      );
    }

    return await response.json();
  },

  async deleteAccount(id: string) {
    const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return;
  },

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  },
};

