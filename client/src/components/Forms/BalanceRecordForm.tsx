import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '../../services/api';
import { BalanceRecord } from '../../pages/BalanceRecords';

// Styled components
const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const SubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

interface BalanceRecordFormProps {
  onSubmit: (data: BalanceRecord) => void;
  accounts?: Array<{ id: number; name: string }>;
  initialData?: Partial<BalanceRecord>;
}

// Main component
const BalanceRecordForm: React.FC<BalanceRecordFormProps> = ({
  onSubmit,
  accounts: propAccounts,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<BalanceRecord>({
    accountId: initialData.accountId || '',
    balance: initialData.balance || 0,
  });
  const [accounts, setAccounts] = useState<Array<{ id: number; name: string }>>(propAccounts || []);
  const [, setIsLoading] = useState<boolean>(propAccounts ? false : true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch accounts if they weren't provided as props
    if (!propAccounts) {
      const fetchAccounts = async () => {
        try {
          setIsLoading(true);
          const data = await api.getAccounts();
          setAccounts(data);
          setError(null);
        } catch (err) {
          setError('Failed to load accounts. Please try again later.');
          console.error('Error fetching accounts:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAccounts();
    }
  }, [propAccounts]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      accountId: formData.accountId,
      balance: formData.balance,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="accountId">Account:</Label>
        <Select
          id="accountId"
          name="accountId"
          value={formData.accountId}
          onChange={handleChange}
          required
        >
          <option value="">Select an account</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup>
        <Label htmlFor="balance">Balance:</Label>
        <Input
          type="number"
          id="balance"
          name="balance"
          value={formData.balance}
          onChange={handleChange}
          step="0.01"
          required
        />
      </FormGroup>
      <SubmitButton type="submit">Submit</SubmitButton>
    </form>
  );
};

// Create a separate component for just the form fields
export const BalanceRecordFields: React.FC<{
  formData: BalanceFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  accounts?: Array<{ id: number; name: string }>;
}> = ({ formData, onChange, accounts = [] }) => {
  return (
    <>
      <FormGroup>
        <Label htmlFor="accountId">Account:</Label>
        <Select
          id="accountId"
          name="accountId"
          value={formData.accountId}
          onChange={onChange}
          required
        >
          <option value="">Select an account</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup>
        <Label htmlFor="balance">Balance:</Label>
        <Input
          type="number"
          id="balance"
          name="balance"
          value={formData.balance}
          onChange={onChange}
          step="0.01"
          required
        />
      </FormGroup>
    </>
  );
};

export default BalanceRecordForm;
