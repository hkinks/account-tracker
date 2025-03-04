import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { BalanceRecord } from '../pages/BalanceRecords';
import { DEFAULT_CURRENCY } from '../constants';

interface TimelineGraphProps {
  balanceRecords: BalanceRecord[];
  cumulative?: boolean;
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

const TimelineGraph: React.FC<TimelineGraphProps> = ({ balanceRecords, cumulative = false }) => {
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
    const dateObj = new Date(date);
    // Format as MM.YYYY (month and year only)
    const formattedDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}.${dateObj.getFullYear()}`;
    
    const dataPoint: any = { date: formattedDate };
    let runningTotal = 0;
    
    Object.entries(accountGroups).forEach(([accountId, records]) => {
      const record = records.find(r => r.recordedAt === date);
      if (record) {
        const accountKey = `${record.account.name} (${DEFAULT_CURRENCY})`;
        const value = record.eurValue || record.balance;
        
        dataPoint[accountKey] = value;
        dataPoint[`${accountKey}-id`] = accountId;
        
        if (cumulative) {
          runningTotal += value;
        }
      }
    });
    
    if (cumulative && Object.keys(dataPoint).length > 1) {
      dataPoint[`Total (${DEFAULT_CURRENCY})`] = runningTotal;
    }
    
    return dataPoint;
  });

  // Get unique account names for lines
  const accountNames = Object.values(accountGroups).map(records => {
    const record = records[0];
    return `${record.account.name} (${DEFAULT_CURRENCY})`;
  });

  // Add total line for cumulative mode
  const linesToDisplay = cumulative 
    ? [...accountNames, `Total (${DEFAULT_CURRENCY})`]
    : accountNames;

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
          {linesToDisplay.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={name === `Total (${DEFAULT_CURRENCY})` ? '#FF0000' : COLORS[index % COLORS.length]}
              activeDot={{ r: 8 }}
              strokeWidth={name === `Total (${DEFAULT_CURRENCY})` ? 3 : 2}
              connectNulls
              dot={name === `Total (${DEFAULT_CURRENCY})` ? { strokeWidth: 2 } : undefined}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </GraphContent>
  );
};

export default TimelineGraph; 