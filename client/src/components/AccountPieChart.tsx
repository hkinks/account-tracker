import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import styled from 'styled-components';

interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

interface AccountPieChartProps {
  accounts: Account[];
}

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  height: 400px;
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
`;

// Array of colors for the pie chart segments
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C'];

const AccountPieChart: React.FC<AccountPieChartProps> = ({ accounts }) => {
  // Filter accounts with EUR currency and positive balance
  const eurAccounts = accounts
    .filter(account => account.currency === 'EUR' && account.balance > 0)
    .map(account => ({
      name: account.name,
      value: account.balance
    }));

  return (
    <ChartContainer>
      <Title>Account Values (EUR)</Title>
      {eurAccounts.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={eurAccounts}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {eurAccounts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`€${value.toFixed(2)}`, 'Balance']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p>No EUR accounts available to display</p>
      )}
    </ChartContainer>
  );
};

export default AccountPieChart; 