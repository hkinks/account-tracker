import React from 'react';
import { AccountDto, AccountType } from '../../pages/Accounts';
import { GenericForm, FormField, SelectOption } from './GenericForm';

interface AccountFormProps {
  onSubmit: (data: AccountDto) => void;
  initialData?: Partial<AccountDto>;
}

const AccountForm: React.FC<AccountFormProps> = ({
  onSubmit,
  initialData = {},
}) => {
  // Convert AccountType enum to SelectOptions
  const accountTypeOptions: SelectOption[] = Object.values(AccountType).map((type) => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1)
  }));

  // Define form fields
  const fields: FormField[] = [
    {
      name: 'name',
      label: 'Account Name',
      type: 'text',
      required: true
    },
    {
      name: 'accountType',
      label: 'Account Type',
      type: 'select',
      required: true,
      options: accountTypeOptions
    },
    {
      name: 'balance',
      label: 'Initial Balance',
      type: 'number',
      required: true,
      step: '0.01'
    },
    {
      name: 'currency',
      label: 'Currency',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      rows: 3
    }
  ];

  return (
    <GenericForm<AccountDto>
      fields={fields}
      initialData={initialData}
      onSubmit={onSubmit}
      submitButtonText="Save Account"
    />
  );
};

export default AccountForm;
