import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TimelineGraph from '../components/TimelineGraph';
import { api } from '../services/api';

const MainContainer = styled.div`
  padding: 20px;
`;

const Dashboard: React.FC = () => {
  const [balanceRecords, setBalanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalanceRecords = async () => {
      try {
        setLoading(true);
        const data = await api.getBalanceRecords();
        setBalanceRecords(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching balance records:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceRecords();
  }, []);

  return (
    <MainContainer>
      {loading && <p>Loading balance data...</p>}
      {error && <p>Error loading data: {error}</p>}
      {!loading && !error && <TimelineGraph balanceRecords={balanceRecords} />}
    </MainContainer>
  );
};

export default Dashboard;
