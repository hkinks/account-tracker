import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

// Define the structure of a transaction object
interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  currency: string;
}

// Transactions component
const Transactions: React.FC = () => {
  // State to store the list of transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Start of Selection
  useEffect(() => {
    api.getTransactions().then((data) => {
      setTransactions(data);
    }).catch((error) => {
      console.error('Error fetching transactions:', error);
    });
  }, []);

  // Render the transactions in a table
  return (
    <div>
      <h2>Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Currency</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.date}</td>
              <td>{transaction.description}</td>
              <td>{parseFloat(transaction.amount).toFixed(2)}</td>
              <td>{transaction.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;