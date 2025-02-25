import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import styled from 'styled-components';

const TransactionsContainer = styled.div`
  padding: 20px;
`;

const TransactionsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #4CAF50;
    color: white;
  }
`;

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
    <TransactionsContainer>
      <h2>Transactions</h2>
      <TransactionsTable>
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
              <td>{transaction.amount.toFixed(2)}</td>
              <td>{transaction.currency}</td>
            </tr>
          ))}
        </tbody>
      </TransactionsTable>
    </TransactionsContainer>
  );
};

export default Transactions;