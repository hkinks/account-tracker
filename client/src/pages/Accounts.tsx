import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '../services/api';
import Modal from '../components/Modal/Modal';
import AccountForm from '../components/Forms/AccountForm';
import Button from '../components/Buttons/Button';
import { Box, Flex } from '../components/Layout';
import DeleteButton from '../components/Buttons/DeleteButton';
import EditButton from '../components/Buttons/EditButton';

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

export interface AccountDto {
  id: string;
  name: string;
  accountType: AccountType;
  description: string;
  balance: number;
  currency: string;
  lastUpdated: string;
  eurValue?: number;
}

export interface CreateAccountDto {
  name: string;
  balance: number;
  currency: string;
  accountType: string;
  description: string;
}

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<AccountDto | null>(null);
  const [editingAccount, setEditingAccount] = useState<AccountDto | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    api.getAccounts()
      .then((data) => {
        setAccounts(data);
      })
      .catch((error) => {
        console.error('Error fetching accounts:', error);
        window.toaster?.error('Failed to fetch accounts. Please try again.');
      });
  };

  const handleOpenModal = (account?: AccountDto) => {
    if (account) {
      setEditingAccount(account);
    } else {
      setEditingAccount(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const handleCreateAccount = (formData: any) => {
    const accountData = {
      name: formData.name,
      balance: parseFloat(formData.balance as string),
      currency: formData.currency,
      accountType: formData.accountType,
      description: formData.description
    };

    if (editingAccount) {
      api.updateAccount(editingAccount.id.toString(), accountData)
        .then(() => {
          window.toaster?.success('Account updated successfully');
          handleCloseModal();
          fetchAccounts();
        })
        .catch((error) => {
          console.error('Error updating account:', error);
          window.toaster?.error('Failed to update account. Please try again.');
        });
    } else {
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
    }
  };

  const handleDeleteClick = (account: AccountDto) => {
    setAccountToDelete(account);
    setIsDeleteConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setAccountToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!accountToDelete) return;
    
    api.deleteAccount(accountToDelete.id.toString())
      .then(() => {
        window.toaster?.success('Account deleted successfully');
        setIsDeleteConfirmOpen(false);
        setAccountToDelete(null);
        fetchAccounts();
      })
      .catch((error) => {
        console.error('Error deleting account:', error);
        window.toaster?.error('Failed to delete account. Please try again.');
      });
  };

  return (
    <AccountsContainer>
      <Box margin="0 0 20px 0">
        <h2>Total Value: {accounts.reduce((sum, account) => sum + (account.eurValue || 0), 0).toFixed(2)} EUR</h2>
      </Box>
      
      <Box margin="0 0 20px 0">
        <Button onClick={() => handleOpenModal()}>Add New Account</Button>
      </Box>
      <AccountsTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Balance</th>
            <th>Currency</th>
            <th>EUR Value</th>
            <th>Type</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.name}</td>
              <td>{account.balance.toFixed(2)}</td>
              <td>{account.currency}</td>
              <td>{account.eurValue?.toFixed(2)}{account.eurValue ? ' EUR' : ''}</td>
              <td>{account.accountType}</td>
              <td>{account.lastUpdated}</td>
              <td>
                <Flex gap="0.5em">
                  <EditButton 
                    onClick={() => handleOpenModal(account)}
                    title="Edit account"
                  />
                  <DeleteButton 
                    onClick={() => handleDeleteClick(account)}
                    title="Delete account"
                  />
                </Flex>
              </td>
            </tr>
          ))}
        </tbody>
      </AccountsTable>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAccount ? "Edit Account" : "Create New Account"}
      >
        <AccountForm
          onSubmit={handleCreateAccount}
          initialData={editingAccount || undefined}
        />
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={handleCancelDelete}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete account "{accountToDelete?.name}"?</p>
        <Flex margin="40px 20px 20px 40px" gap="2em" justify-content="start">
          <Button onClick={handleConfirmDelete} variant="primary">Delete</Button>
          <Button onClick={handleCancelDelete} variant="secondary">Cancel</Button>
        </Flex>
      </Modal>
    </AccountsContainer>
  );
};

export default Accounts;