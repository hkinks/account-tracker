import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { BalanceRecord } from '../pages/BalanceRecords';

interface TimelineGraphProps {
  balanceRecords: BalanceRecord[];
}

const GraphContent = styled.div`
  width: 100%;
  height: 350px;
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

    // Group records by account
    const accountGroups = balanceRecords.reduce<Record<string, BalanceRecord[]>>((groups, record) => {
      const accountId = record.account.id;
      if (!groups[accountId]) {
        groups[accountId] = [];
      }
      groups[accountId].push(record);
      return groups;
    }, {});
    
    // Generate colors for each account
    const colors = [
      '#3498db', // blue
      '#e74c3c', // red
      '#2ecc71', // green
      '#f39c12', // orange
      '#9b59b6', // purple
      '#1abc9c', // turquoise
      '#34495e', // dark blue
      '#d35400', // dark orange
    ];
    
    // Get all unique dates across all records
    const allDates = [...new Set(balanceRecords.map(r => r.recordedAt))].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    
    const minDate = new Date(allDates[0]).getTime();
    const maxDate = new Date(allDates[allDates.length - 1]).getTime();

    // Find min and max values for scaling
    const minAmount = Math.min(...balanceRecords.map(record => record.balance));
    const maxAmount = Math.max(...balanceRecords.map(record => record.balance));
    
    // Add some padding to the min/max values
    const padding = (maxAmount - minAmount) * 0.1;
    const yMin = Math.max(0, minAmount - padding);
    const yMax = maxAmount + padding;

    // Set margins
    const margin = { top: 40, right: 120, bottom: 60, left: 80 };
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

    const xSteps = Math.min(allDates.length, 6);
    for (let i = 0; i < xSteps; i++) {
      const index = Math.floor((i * (allDates.length - 1)) / (xSteps - 1));
      const dateStr = allDates[index];
      const date = new Date(dateStr);
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
    ctx.fillText('Amount', 0, 0);
    ctx.restore();

    // Draw lines for each account
    Object.entries(accountGroups).forEach(([, records], index) => {
      const color = colors[index % colors.length];
      const sortedRecords = [...records].sort(
        (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
      );
      
      if (sortedRecords.length < 2) return;
      
      // Draw the line graph
      ctx.beginPath();
      sortedRecords.forEach((record, i) => {
        const x = margin.left + (graphWidth * (new Date(record.recordedAt).getTime() - minDate)) / (maxDate - minDate);
        const y = margin.top + graphHeight - (graphHeight * (record.balance - yMin)) / (yMax - yMin);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw data points
      sortedRecords.forEach(record => {
        const x = margin.left + (graphWidth * (new Date(record.recordedAt).getTime() - minDate)) / (maxDate - minDate);
        const y = margin.top + graphHeight - (graphHeight * (record.balance - yMin)) / (yMax - yMin);
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
      
      // Add legend entry
      const legendY = margin.top + (index * 25);
      const accountName = sortedRecords[0].account.name;
      const currency = sortedRecords[0].account.currency;
      
      // Draw color box
      ctx.fillStyle = color;
      ctx.fillRect(canvas.width - margin.right + 10, legendY, 15, 15);
      
      // Draw account name
      ctx.fillStyle = '#333';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${accountName} (${currency})`, canvas.width - margin.right + 35, legendY + 7);
    });

    // Draw title
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#333';
    ctx.fillText('Balance Timeline by Account', canvas.width / 2, margin.top / 2);

  }, [balanceRecords]);

  return (
    <GraphContent>
      <Canvas ref={canvasRef} />
      {balanceRecords.length < 2 && (
        <NoDataMessage>
          <p>Not enough data to display the timeline.</p>
          <p>Please add at least two balance records.</p>
        </NoDataMessage>
      )}
    </GraphContent>
  );
};

export default TimelineGraph; 