import React, { useState, ChangeEvent } from 'react';
import './Forms.css';

interface Account {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface TransactionFormData {
  date: string;
  amount: string | number;
  type: 'expense' | 'income' | 'transfer';
  category: string;
  account: string;
  description: string;
}

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  accounts: Account[];
  categories: Category[];
  initialData?: Partial<TransactionFormData>;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  accounts = [],
  categories = [],
  initialData = {},
}) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    date: initialData.date || new Date().toISOString().split('T')[0],
    amount: initialData.amount || '',
    type: initialData.type || 'expense',
    category:
      initialData.category || (categories.length > 0 ? categories[0].id : ''),
    account: initialData.account || (accounts.length > 0 ? accounts[0].id : ''),
    description: initialData.description || '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="form-container">
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="type">Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="transfer">Transfer</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="account">Account</label>
        <select
          id="account"
          name="account"
          value={formData.account}
          onChange={handleChange}
          required
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
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

export default TransactionForm;
