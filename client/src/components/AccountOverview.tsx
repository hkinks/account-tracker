import React from 'react';
import styled from 'styled-components';

interface AccountOverviewProps {
  totalEurValue: number;
  accounts: any[];
  stats?: {
    totalBalanceByCurrency?: Record<string, number>;
    totalAccounts: number;
    activeAccounts: number;
    totalBalanceRecords: number;
    accountsByType?: Record<string, number>;
  };
}

const OverviewContainer = styled.div`
  width: 100%;
`;

const TotalAmount = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #2c3e50;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background-color: #f8f9fa;
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

const AccountOverview: React.FC<AccountOverviewProps> = ({ totalEurValue, accounts, stats }) => {
  return (
    <OverviewContainer>
      <TotalAmount>
        €{totalEurValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </TotalAmount>
      
      <Grid>
        <Card>
          <CardTitle>Account Summary</CardTitle>
          <StatItem>
            <StatLabel>Total Accounts:</StatLabel>
            <StatValue>{accounts.length}</StatValue>
          </StatItem>
          {stats && (
            <>
              <StatItem>
                <StatLabel>Active Accounts:</StatLabel>
                <StatValue>{stats.activeAccounts}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Balance Records:</StatLabel>
                <StatValue>{stats.totalBalanceRecords}</StatValue>
              </StatItem>
            </>
          )}
        </Card>

        {stats?.totalBalanceByCurrency && (
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

        {stats?.accountsByType && (
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
    </OverviewContainer>
  );
};

export default AccountOverview; 