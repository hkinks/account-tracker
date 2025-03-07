import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { BalanceRecordDto } from '../pages/BalanceRecords';
import { DEFAULT_CURRENCY } from '../constants';

interface TimelineGraphProps {
  balanceRecords: BalanceRecordDto[];
  cumulative?: boolean;
}

type TimeframeOption = '1m' | '6m' | '1y' | 'all';

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

const TimeframeSelector = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  gap: 8px;
`;

const TimeframeButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: ${props => props.active ? '#0088FE' : 'white'};
  color: ${props => props.active ? 'white' : 'black'};
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: ${props => props.active ? '#0088FE' : '#f0f0f0'};
  }
`;

// Array of colors for the line chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C'];

const TimelineGraph: React.FC<TimelineGraphProps> = ({ balanceRecords, cumulative = false }) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('1m');

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
  const accountGroups = balanceRecords.reduce<Record<string, BalanceRecordDto[]>>((groups, record) => {
    const accountId = record.account.id;
    if (!groups[accountId]) {
      groups[accountId] = [];
    }
    groups[accountId].push(record);
    return groups;
  }, {});

  // Get all actual dates from records
  const actualDates = [...new Set(balanceRecords.map(r => r.recordedAt))].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Generate regular intervals between the first and last date
  let firstDate = new Date(actualDates[0]);
  let lastDate = new Date(actualDates[actualDates.length - 1]);
  
  // Adjust date range based on selected timeframe
  if (timeframe !== 'all') {
    lastDate = new Date(); // Use current date as end date
    
    if (timeframe === '1m') {
      firstDate = new Date();
      firstDate.setMonth(firstDate.getMonth() - 1);
    } else if (timeframe === '6m') {
      firstDate = new Date();
      firstDate.setMonth(firstDate.getMonth() - 6);
    } else if (timeframe === '1y') {
      firstDate = new Date();
      firstDate.setFullYear(firstDate.getFullYear() - 1);
    }
    
    // Make sure firstDate is not earlier than the earliest record
    const earliestRecordDate = new Date(actualDates[0]);
    if (firstDate < earliestRecordDate) {
      firstDate = earliestRecordDate;
    }
  }
  
  // Create a consistent timeline with appropriate intervals based on timeframe
  const regularDates: string[] = [];
  const currentDate = new Date(firstDate);
  
  // Determine interval size based on timeframe
  let intervalType: 'day' | 'week' | 'month' = 'month';
  if (timeframe === '1m') {
    intervalType = 'day';
    // Start at the beginning of the day
    currentDate.setHours(0, 0, 0, 0);
  } else if (timeframe === '6m') {
    intervalType = 'week';
    // Start at the beginning of the week (Sunday)
    const day = currentDate.getDay();
    currentDate.setDate(currentDate.getDate() - day);
    currentDate.setHours(0, 0, 0, 0);
  } else {
    // For 1y and all, use monthly intervals
    // Start at first day of month
    currentDate.setDate(1);
    currentDate.setHours(0, 0, 0, 0);
  }
  
  while (currentDate <= lastDate) {
    // Format as ISO string to match the recordedAt format
    regularDates.push(currentDate.toISOString());
    
    // Move to next interval
    if (intervalType === 'day') {
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (intervalType === 'week') {
      currentDate.setDate(currentDate.getDate() + 7);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }

  // Create data structure for Recharts
  // Keep track of the last known values for each account
  const lastKnownValues: Record<string, number> = {};
  
  const chartData = regularDates.map(dateStr => {
    const dateObj = new Date(dateStr);
    
    // Format date based on interval type
    let formattedDate: string;
    if (intervalType === 'day') {
      formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
    } else if (intervalType === 'week') {
      // Format as DD.MM for the first day of the week
      formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
    } else {
      // Format as MM.YYYY for monthly intervals
      formattedDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}.${dateObj.getFullYear()}`;
    }
    
    const dataPoint: any = { date: formattedDate };
    let runningTotal = 0;
    
    Object.entries(accountGroups).forEach(([accountId, records]) => {
      const accountKey = `${records[0].account.name} (${DEFAULT_CURRENCY})`;
      
      // Find the closest record before or on this date
      const closestRecord = records
        .filter(r => new Date(r.recordedAt) <= dateObj)
        .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())[0];
      
      if (closestRecord) {
        // We have data for this date or before
        const value = closestRecord.eurValue || closestRecord.balance;
        dataPoint[accountKey] = value;
        dataPoint[`${accountKey}-id`] = accountId;
        
        // Update the last known value for this account
        lastKnownValues[accountKey] = value;
        
        if (cumulative) {
          runningTotal += value;
        }
      } else if (lastKnownValues[accountKey] !== undefined) {
        // No data for this date, use the last known value
        dataPoint[accountKey] = lastKnownValues[accountKey];
        dataPoint[`${accountKey}-id`] = accountId;
        
        if (cumulative) {
          runningTotal += lastKnownValues[accountKey];
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
    <>
      <TimeframeSelector>
        <TimeframeButton 
          active={timeframe === '1m'} 
          onClick={() => setTimeframe('1m')}
        >
          1 Month
        </TimeframeButton>
        <TimeframeButton 
          active={timeframe === '6m'} 
          onClick={() => setTimeframe('6m')}
        >
          6 Months
        </TimeframeButton>
        <TimeframeButton 
          active={timeframe === '1y'} 
          onClick={() => setTimeframe('1y')}
        >
          1 Year
        </TimeframeButton>
        <TimeframeButton 
          active={timeframe === 'all'} 
          onClick={() => setTimeframe('all')}
        >
          All Data
        </TimeframeButton>
      </TimeframeSelector>
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
    </>
  );
};

export default TimelineGraph; 