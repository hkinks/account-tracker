import React from 'react';
import styled from 'styled-components';

import { useState, useEffect } from 'react';
import { api } from '../services/api';

const AccountsContainer = styled.div`
  padding: 20px;
`;

const AccountsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #4caf50;
    color: white;
  }
`;

interface Account {
  id: number;
  name: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    api
      .getAccounts()
      .then((data) => {
        setAccounts(data);
      })
      .catch((error) => {
        console.error('Error fetching accounts:', error);
        window.toaster?.error('Failed to fetch accounts. Please try again.');
      });
  }, []);

  return (
    <AccountsContainer>
      <h2>Accounts</h2>
      <AccountsTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Balance</th>
            <th>Currency</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.name}</td>
              <td>{account.balance.toFixed(2)}</td>
              <td>{account.currency}</td>
              <td>{account.lastUpdated}</td>
            </tr>
          ))}
        </tbody>
      </AccountsTable>
    </AccountsContainer>
  );
};

export default Accounts;
