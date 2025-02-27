import React, { useState, ChangeEvent, FormEvent } from 'react';

interface AccountFormData {
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: string | number;
  currency: string;
  description: string;
}

interface AccountFormProps {
  onSubmit: (data: AccountFormData) => void;
  initialData?: Partial<AccountFormData>;
}

const AccountForm: React.FC<AccountFormProps> = ({
  onSubmit,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<AccountFormData>({
    name: initialData.name || '',
    type: initialData.type || 'checking',
    balance: initialData.balance || '',
    currency: initialData.currency || 'USD',
    description: initialData.description || '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <div className="form-group">
        <label htmlFor="name">Account Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="type">Account Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="credit">Credit Card</option>
          <option value="investment">Investment</option>
          <option value="cash">Cash</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="balance">Initial Balance</label>
        <input
          type="number"
          id="balance"
          name="balance"
          value={formData.balance}
          onChange={handleChange}
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="currency">Currency</label>
        <select
          id="currency"
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          required
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
          <option value="CAD">CAD</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
      </div>
    </div>
  );
};

export default AccountForm;
