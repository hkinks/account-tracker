import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '../services/api';
import Modal from '../components/Modal/Modal';
import BalanceRecordForm from '../components/Forms/BalanceRecordForm';
import { FaTrash } from 'react-icons/fa';

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

const StyledButton = styled.button`
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #45a049;
  }
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #666666;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #555555;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

export interface CreateBalanceRecordDto {
  id: string;
  accountId: string;
  balance: number;
  recordedAt: Date;
}

export interface BalanceRecord {
  id: string;
  balance: number;
  recordedAt: Date;
  account: Account;
}

export interface Account {
  id: string;
  name: string;
  description: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  isActive: boolean;
  currency: string;
}

const BalanceRecords: React.FC = () => {
  const [balanceRecords, setBalanceRecords] = useState<BalanceRecord[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalanceRecords = async () => {
    setIsLoading(true);
    try {
      const data = await api.getBalanceRecords();
      setBalanceRecords(data);
    } catch (error) {
      console.error('Error fetching balance records:', error);
      window.toaster?.error('Failed to fetch balance records. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceRecords();
  }, []);

  const handleDeleteRecord = async (id: string) => {
    try {
      await api.deleteBalanceRecord(id);
      window.toaster?.success('Balance record deleted successfully');
      await fetchBalanceRecords();
      setBalanceRecords(balanceRecords.filter((record) => record.id !== id));
    } catch (error) {
      console.error('Error deleting balance record:', error);
      window.toaster?.error('Failed to delete balance record');
    }
  };

  const handleCreateRecord = async (data: CreateBalanceRecordDto) => {
    try {
      await api.createBalanceRecord(data);
      setIsFormOpen(false);
      window.toaster?.success('Balance record created successfully');
      await fetchBalanceRecords();
    } catch (error) {
      console.error('Error creating balance record:', error);
      window.toaster?.error('Failed to create balance record');
    }
  };

  return (
    <BalanceRecordsContainer>
      <h2>Balance Records</h2>
      <StyledButton onClick={() => setIsFormOpen(true)}>
        Add Balance Record
      </StyledButton>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Balance Record"
      >
        <BalanceRecordForm onSubmit={handleCreateRecord} />
      </Modal>
      <BalanceRecordsTable>
        <thead>
          <tr>
            <th>Account</th>
            <th>Balance</th>
            <th>Recorded At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {balanceRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.account.name}</td>
              <td>{record.balance.toFixed(2)}</td>
              <td>{record.recordedAt.toLocaleString()}</td>
              <td>
                <DeleteButton
                  onClick={() => handleDeleteRecord(record.id)}
                  disabled={isLoading}
                  title="Delete record"
                >
                  <FaTrash />
                </DeleteButton>
              </td>
            </tr>
          ))}
        </tbody>
      </BalanceRecordsTable>
    </BalanceRecordsContainer>
  );
};

export default BalanceRecords;
