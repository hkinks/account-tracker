import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '../services/api';
import Modal, { CancelButton, SubmitButton } from '../components/Modal/Modal';
import AccountForm from '../components/Forms/AccountForm';
import Button from '../components/Button';
import { Box } from '../components/Layout';

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

export enum AccountType {
  BANK = 'bank',
  CRYPTO = 'crypto',
  STOCKS = 'stocks',
  SAVINGS = 'savings',
  CASH = 'cash',
  OTHER = 'other'
}

export interface Account {
  id: number;
  name: string;
  accountType: AccountType;
  description: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface CreateAccountDto {
  name: string;
  balance: number;
  currency: string;
  type: string;
  description: string;
}

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    api
      .getAccounts()
      .then((data) => {
        setAccounts(data);
      })
      .catch((error) => {
        console.error('Error fetching accounts:', error);
        window.toaster?.error('Failed to fetch accounts. Please try again.');
      });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateAccount = (formData: any) => {
    const accountData = {
      name: formData.name,
      balance: parseFloat(formData.balance as string),
      currency: formData.currency,
      type: formData.type,
      description: formData.description
    };

    api.createAccount(accountData)
      .then(() => {
        window.toaster?.success('Account created successfully');
        handleCloseModal();
        fetchAccounts();
      })
      .catch((error) => {
        console.error('Error creating account:', error);
        window.toaster?.error('Failed to create account. Please try again.');
      });
  };

  return (
    <AccountsContainer>
      <Box margin="0 0 20px 0">
        <Button onClick={handleOpenModal}>Add New Account</Button>
      </Box>
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create New Account"
      >
        <AccountForm
          onSubmit={handleCreateAccount}
        />
      </Modal>
    </AccountsContainer>
  );
};

export default Accounts;
