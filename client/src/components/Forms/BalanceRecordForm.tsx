import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '../../services/api';
import { Account, BalanceRecord, CreateBalanceRecordDto } from '../../pages/BalanceRecords';

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
    onSubmit: (data: CreateBalanceRecordDto) => void;
    accounts?: Array<{ id: number; name: string }>;
    initialData?: Partial<CreateBalanceRecordDto>;
}

// Main component
const BalanceRecordForm: React.FC<BalanceRecordFormProps> = ({
    onSubmit,
    accounts: propAccounts,
    initialData = {},
}) => {
    const [formData, setFormData] = useState<CreateBalanceRecordDto>({
        id: initialData.id || crypto.randomUUID(),
        balance: initialData.balance || 0,
        recordedAt: initialData.recordedAt || new Date(),
        accountId: initialData.accountId || '',
    });
    const [accounts, setAccounts] = useState<Account[]>(
        (propAccounts || []).map(account => ({
            ...account,
            id: account.id.toString(),
            balance: 0,
            description: '',
            accountNumber: '',
            accountType: '',
            isActive: true,
            currency: 'EUR',
        }))
    );
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
                    
                    // Auto-select the first account if none is selected and accounts exist
                    if (!formData.accountId && data.length > 0) {
                        setFormData(prev => ({
                            ...prev,
                            accountId: data[0].id.toString(),
                            balance: data[0].balance || 0,
                        }));
                    }
                    
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
    }, [propAccounts, formData.accountId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        
        // If changing the account, update the balance to match the selected account
        if (name === 'accountId') {
            const selectedAccount = accounts.find(account => account.id.toString() === value);
            setFormData({
                ...formData,
                [name]: value,
                balance: selectedAccount?.balance || 0,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
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
    formData: BalanceRecord;
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
                    value={formData.account.id}
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
                    value={formData.account.balance}
                    onChange={onChange}
                    step="0.01"
                    required
                />
            </FormGroup>
        </>
    );
};

export default BalanceRecordForm;
