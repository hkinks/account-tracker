import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import styled from 'styled-components';
import { Account } from '../pages/Accounts';
import { DEFAULT_CURRENCY } from '../constants';

interface AccountPieChartProps {
  accounts: Account[];
}

const ChartContent = styled.div`
  width: 100%;
  height: 350px;
`;

// Array of colors for the pie chart segments
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C'];

const AccountPieChart: React.FC<AccountPieChartProps> = ({ accounts }) => {
  // Filter accounts with EUR currency and positive balance
  const eurAccounts = accounts
    .filter(account => account.eurValue && account.eurValue > 0)
    .map(account => ({
      name: account.name,
      value: account.eurValue
    }));

  return (
    <ChartContent>
      {eurAccounts.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
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
              {eurAccounts.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${DEFAULT_CURRENCY}${value.toFixed(2)}`, 'Balance']}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="left"
              wrapperStyle={{ left: 0, top: 0, paddingLeft: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p>No {DEFAULT_CURRENCY} accounts available to display</p>
      )}
    </ChartContent>
  );
};

export default AccountPieChart; 