import React, { useState } from 'react';
import styled from 'styled-components';

// Move all styled component definitions outside the component function
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
  onSubmit: (data: { accountId: number; balance: number }) => void;
  accounts?: Array<{ id: number; name: string }>;
}

const BalanceRecordForm: React.FC<BalanceRecordFormProps> = ({
  onSubmit,
  accounts = [],
}) => {
  const [formData, setFormData] = useState({
    accountId: '',
    balance: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
      accountId: parseInt(formData.accountId, 10),
      balance: parseFloat(formData.balance),
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
          {accounts &&
            accounts.map((account) => (
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

export default BalanceRecordForm;
