import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { api } from '../services/api';

const BalanceRecordsContainer = styled.div`
  padding: 20px;
`;

const BalanceRecordsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #4CAF50;
    color: white;
  }
`;

interface BalanceRecord {
  id: number;
  accountId: number;
  balance: number;
  recordedAt: string;
}

const BalanceRecords: React.FC = () => {
  const [balanceRecords, setBalanceRecords] = useState<BalanceRecord[]>([]);

  useEffect(() => {
    api.getBalanceRecords().then((data) => {
      setBalanceRecords(data);
    }).catch((error) => {
      console.error('Error fetching balance records:', error);
      window.toaster?.error('Failed to fetch balance records. Please try again.');
    });
  }, []);

  return (
    <BalanceRecordsContainer>
      <h2>Balance Records</h2>
      <BalanceRecordsTable>
        <thead>
          <tr>
            <th>Account ID</th>
            <th>Balance</th>
            <th>Recorded At</th>
          </tr>
        </thead>
        <tbody>
          {balanceRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.accountId}</td>
              <td>{record.balance.toFixed(2)}</td>
              <td>{record.recordedAt}</td>
            </tr>
          ))}
        </tbody>
      </BalanceRecordsTable>
    </BalanceRecordsContainer>
  );
};

export default BalanceRecords;
