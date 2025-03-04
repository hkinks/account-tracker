import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { BalanceRecord } from '../pages/BalanceRecords';
import { DEFAULT_CURRENCY } from '../constants';

interface TimelineGraphProps {
  balanceRecords: BalanceRecord[];
}

const GraphContent = styled.div`
  width: 100%;
  height: 350px;
`;

const NoDataMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #666;
  font-size: 16px;
`;

// Array of colors for the line chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C'];

const TimelineGraph: React.FC<TimelineGraphProps> = ({ balanceRecords }) => {
  // If not enough data points, show message
  if (balanceRecords.length < 2) {
    return (
      <GraphContent style={{ position: 'relative' }}>
        <NoDataMessage>
          <p>Not enough data to display the timeline.</p>
          <p>Please add at least two balance records.</p>
        </NoDataMessage>
      </GraphContent>
    );
  }

  // Group records by account
  const accountGroups = balanceRecords.reduce<Record<string, BalanceRecord[]>>((groups, record) => {
    const accountId = record.account.id;
    if (!groups[accountId]) {
      groups[accountId] = [];
    }
    groups[accountId].push(record);
    return groups;
  }, {});

  // Get all unique dates across all records
  const allDates = [...new Set(balanceRecords.map(r => r.recordedAt))].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Create data structure for Recharts
  const chartData = allDates.map(date => {
    const dataPoint: any = { date: new Date(date).toLocaleDateString() };
    
    Object.entries(accountGroups).forEach(([accountId, records]) => {
      const record = records.find(r => r.recordedAt === date);
      if (record) {
        const accountKey = `${record.account.name} (${DEFAULT_CURRENCY})`;
        dataPoint[accountKey] = record.eurValue || record.balance;
        dataPoint[`${accountKey}-id`] = accountId; // Store ID for reference
      }
    });
    
    return dataPoint;
  });

  // Get unique account names for lines
  const accountNames = Object.values(accountGroups).map(records => {
    const record = records[0];
    return `${record.account.name} (${DEFAULT_CURRENCY})`;
  });

  return (
    <GraphContent>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value: number) => [`${value.toFixed(2)}`, 'Balance']} />
          <Legend />
          {accountNames.map((accountName, index) => (
            <Line
              key={accountName}
              type="monotone"
              dataKey={accountName}
              stroke={COLORS[index % COLORS.length]}
              activeDot={{ r: 8 }}
              strokeWidth={2}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </GraphContent>
  );
};

export default TimelineGraph; 