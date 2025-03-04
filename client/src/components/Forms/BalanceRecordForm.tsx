import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CreateBalanceRecordDto } from '../../pages/BalanceRecords';
import { GenericForm, FormField, SelectOption } from './GenericForm';
import { AccountDto } from '../../pages/Accounts';
import styled from 'styled-components';

// Add styled components for smooth transitions
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

// Modify the FormWrapper styled component
const FormWrapper = styled('div')<{ $isVisible: boolean }>`
  opacity: ${props => props.$isVisible ? 1 : 0};
  position: ${props => props.$isVisible ? 'relative' : 'absolute'};
  transition: opacity 0.3s ease-in-out;
  width: 100%;
`;

interface BalanceRecordFormProps {
    onSubmit: (data: CreateBalanceRecordDto) => void;
    accounts?: Array<AccountDto>;
    initialData?: Partial<CreateBalanceRecordDto>;
}

// Main component
const BalanceRecordForm: React.FC<BalanceRecordFormProps> = ({
    onSubmit,
    accounts: propAccounts,
    initialData = {}
}) => {
    const [accounts, setAccounts] = useState<Array<AccountDto>>(propAccounts || []);
    const [isLoading, setIsLoading] = useState<boolean>(propAccounts ? false : true);
    const [error, setError] = useState<string | null>(null);
    const [formInitialData, setFormInitialData] = useState<Partial<CreateBalanceRecordDto>>({
        balance: initialData.balance || 0,
        recordedAt: initialData.recordedAt || new Date(),
        accountId: initialData.accountId || '',
    });

    useEffect(() => {
        // Only fetch accounts if they weren't provided as props
        if (!propAccounts) {
            const fetchAccounts = async () => {
                try {
                    setIsLoading(true);
                    const data = await api.getAccounts();
                    setAccounts(data);
                    
                    // Auto-select the first account if none is selected and accounts exist
                    if (!formInitialData.accountId && data.length > 0) {
                        setFormInitialData(prev => ({
                            ...prev,
                            accountId: data[0].id.toString(),
                            balance: data[0].balance || 0
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
    }, [propAccounts, formInitialData.accountId]);

    // Convert accounts to select options
    const accountOptions: SelectOption[] = accounts.map(account => ({
        value: account.id.toString(),
        label: account.name
    }));

    // Define form fields
    const fields: FormField[] = [
        {
            name: 'accountId',
            label: 'Account:',
            type: 'select',
            required: true,
            options: accountOptions,
            onChange: (value: string) => {
                // Find the selected account
                const selectedAccount = accounts.find(account => account.id.toString() === value);
                // Update the balance if account is found
                if (selectedAccount) {
                    return { balance: selectedAccount.balance || 0 };
                }
                return {};
            }
        },
        {
            name: 'balance',
            label: 'Balance:',
            type: 'number',
            required: true,
            step: '0.01'
        }
    ];

    const handleFormSubmit = (data: Record<string, any>) => {
        const formData: CreateBalanceRecordDto = {
            balance: data.balance,
            recordedAt: formInitialData.recordedAt || new Date(),
            accountId: data.accountId,
        };
        onSubmit(formData);
    };

    return (
        <div style={{ position: 'relative', minHeight: '200px' }}>
            {/* Loading state */}
            <FormWrapper $isVisible={isLoading}>
                <LoadingContainer>
                    <div>Loading accounts...</div>
                </LoadingContainer>
            </FormWrapper>

            {/* Error state */}
            {error && <div>{error}</div>}

            {/* Form state */}
            <FormWrapper $isVisible={!isLoading}>
                <GenericForm
                    fields={fields}
                    initialData={formInitialData}
                    onSubmit={handleFormSubmit}
                    submitButtonText="Submit"
                />
            </FormWrapper>
        </div>
    );
};

export default BalanceRecordForm;
