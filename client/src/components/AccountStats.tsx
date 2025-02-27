import React from 'react';
import styled from 'styled-components';

interface StatsProps {
  stats: {
    totalBalanceByCurrency?: Record<string, number>;
    totalAccounts: number;
    activeAccounts: number;
    totalBalanceRecords: number;
    accountsByType?: Record<string, number>;
  };
}

// Styled components
const Container = styled.div`
  border-radius: 8px;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e9ecef;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 6px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const CardTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  color: #495057;
  font-size: 1.1rem;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 8px;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 4px 0;
`;

const StatLabel = styled.span`
  color: #6c757d;
  font-weight: 500;
`;

const StatValue = styled.span`
  font-weight: 600;
  color: #212529;
`;

const Footer = styled.div`
  text-align: right;
  color: #6c757d;
  font-size: 0.85rem;
  font-style: italic;
  margin-top: 10px;
`;

const AccountStats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <Container>
      <Title>Account Statistics</Title>
      
      <Grid>
        <Card>
          <CardTitle>Account Summary</CardTitle>
          <StatItem>
            <StatLabel>Total Accounts:</StatLabel>
            <StatValue>{stats.totalAccounts}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Active Accounts:</StatLabel>
            <StatValue>{stats.activeAccounts}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Total Balance Records:</StatLabel>
            <StatValue>{stats.totalBalanceRecords}</StatValue>
          </StatItem>
        </Card>

        {stats.totalBalanceByCurrency && (
          <Card>
            <CardTitle>Balance by Currency</CardTitle>
            {Object.entries(stats.totalBalanceByCurrency).map(([currency, amount]) => (
              <StatItem key={currency}>
                <StatLabel>{currency}:</StatLabel>
                <StatValue>{amount.toLocaleString()}</StatValue>
              </StatItem>
            ))}
          </Card>
        )}

        {stats.accountsByType && (
          <Card>
            <CardTitle>Accounts by Type</CardTitle>
            {Object.entries(stats.accountsByType).map(([type, count]) => (
              <StatItem key={type}>
                <StatLabel>{type}:</StatLabel>
                <StatValue>{count}</StatValue>
              </StatItem>
            ))}
          </Card>
        )}
      </Grid>
      
      <Footer>
        Last Updated: {new Date().toLocaleString()}
      </Footer>
    </Container>
  );
};

export default AccountStats; 