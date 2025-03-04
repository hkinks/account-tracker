import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TimelineGraph from '../components/TimelineGraph';
import AccountStats from '../components/AccountStats';
import AccountPieChart from '../components/AccountPieChart';
import { api } from '../services/api';

const MainContainer = styled.div`
  padding: 20px;
`;

const ChartsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
`;

const Dashboard: React.FC = () => {
  const [balanceRecords, setBalanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

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

    const fetchAccounts = async () => {
      try {
        const data = await api.getAccounts();
        setAccounts(data);
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    };

    fetchBalanceRecords();
    fetchStats();
    fetchAccounts();
  }, []);

  return (
    <MainContainer>
      {stats && <AccountStats stats={stats} />}
      {loading && <p>Loading balance data...</p>}
      {error && <p>Error loading data: {error}</p>}
      {!loading && !error && (
        <ChartsContainer>
          <TimelineGraph balanceRecords={balanceRecords} />
          {accounts.length > 0 && <AccountPieChart accounts={accounts} />}
        </ChartsContainer>
      )}
    </MainContainer>
  );
};

export default Dashboard;
