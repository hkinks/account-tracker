import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TimelineGraph from '../components/TimelineGraph';
import AccountPieChart from '../components/AccountPieChart';
import AccountOverview from '../components/AccountOverview';
import GraphPane from '../components/GraphPane';
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

const ChartSection = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
`;

const Dashboard: React.FC = () => {
  const [balanceRecords, setBalanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [totalEurValue, setTotalEurValue] = useState<number>(0);

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
        
        // Calculate total EUR value
        const total = data.reduce((sum: number, account: any) => sum + (account.eurValue || 0), 0);
        setTotalEurValue(total);
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
      {loading && <p>Loading balance data...</p>}
      {error && <p>Error loading data: {error}</p>}
      {accounts.length > 0 && (
        <ChartSection>
          <GraphPane title="Account Distribution">
            <AccountPieChart accounts={accounts} />
          </GraphPane>
          <GraphPane title="Account Overview">
            <AccountOverview 
              totalEurValue={totalEurValue} 
              accounts={accounts} 
              stats={stats}
            />
          </GraphPane>
        </ChartSection>
      )}
      {!loading && !error && (
        <ChartsContainer>
          <GraphPane title="Balance History">
            <TimelineGraph balanceRecords={balanceRecords} />
          </GraphPane>
        </ChartsContainer>
      )}
    </MainContainer>
  );
};

export default Dashboard;
