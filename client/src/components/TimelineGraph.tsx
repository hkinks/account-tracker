import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Account } from '../pages/BalanceRecords';

interface BalanceRecord {
  balance: number;
  recordedAt: string;
  account: Account;
}

interface TimelineGraphProps {
  balanceRecords: BalanceRecord[];
}

const GraphContainer = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
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

const TimelineGraph: React.FC<TimelineGraphProps> = ({ balanceRecords }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // If not enough data points, just clear the canvas and return
    if (balanceRecords.length < 2) return;

    // Sort records by date
    const sortedRecords = [...balanceRecords].sort(
      (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
    );

    // Find min and max values for scaling
    const minAmount = Math.min(...sortedRecords.map(record => record.balance));
    const maxAmount = Math.max(...sortedRecords.map(record => record.balance));
    
    // Add some padding to the min/max values
    const padding = (maxAmount - minAmount) * 0.1;
    const yMin = Math.max(0, minAmount - padding);
    const yMax = maxAmount + padding;

    // Find min and max dates
    const minDate = new Date(sortedRecords[0].recordedAt).getTime();
    const maxDate = new Date(sortedRecords[sortedRecords.length - 1].recordedAt).getTime();

    // Set margins
    const margin = { top: 40, right: 40, bottom: 60, left: 80 };
    const graphWidth = canvas.width - margin.left - margin.right;
    const graphHeight = canvas.height - margin.top - margin.bottom;

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, canvas.height - margin.bottom);
    ctx.lineTo(canvas.width - margin.right, canvas.height - margin.bottom);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Y-axis labels
    ctx.font = '12px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const y = margin.top + (graphHeight * (ySteps - i)) / ySteps;
      const value = yMin + ((yMax - yMin) * i) / ySteps;
      ctx.fillText(value.toFixed(0), margin.left - 10, y);
      
      // Draw horizontal grid lines
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(canvas.width - margin.right, y);
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw X-axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const xSteps = Math.min(sortedRecords.length, 6);
    for (let i = 0; i < xSteps; i++) {
      const index = Math.floor((i * (sortedRecords.length - 1)) / (xSteps - 1));
      const record = sortedRecords[index];
      const date = new Date(record.recordedAt);
      const x = margin.left + (graphWidth * i) / (xSteps - 1);
      
      ctx.fillText(date.toLocaleDateString(), x, canvas.height - margin.bottom + 10);
      
      // Draw vertical grid lines
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, canvas.height - margin.bottom);
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw currency label on Y-axis
    ctx.save();
    ctx.translate(margin.left - 50, margin.top + graphHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(`Amount (${sortedRecords[0].account.currency})`, 0, 0);
    ctx.restore();

    // Draw the line graph
    ctx.beginPath();
    sortedRecords.forEach((record, index) => {
      const x = margin.left + (graphWidth * (new Date(record.recordedAt).getTime() - minDate)) / (maxDate - minDate);
      const y = margin.top + graphHeight - (graphHeight * (record.balance - yMin)) / (yMax - yMin);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw data points
    sortedRecords.forEach(record => {
      const x = margin.left + (graphWidth * (new Date(record.recordedAt).getTime() - minDate)) / (maxDate - minDate);
      const y = margin.top + graphHeight - (graphHeight * (record.balance - yMin)) / (yMax - yMin);
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#3498db';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw title
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#333';
    ctx.fillText('Balance Timeline', canvas.width / 2, margin.top / 2);

  }, [balanceRecords]);

  return (
    <GraphContainer>
      <Canvas ref={canvasRef} />
      {balanceRecords.length < 2 && (
        <NoDataMessage>
          <p>Not enough data to display the timeline.</p>
          <p>Please add at least two balance records.</p>
        </NoDataMessage>
      )}
    </GraphContainer>
  );
};

export default TimelineGraph; 