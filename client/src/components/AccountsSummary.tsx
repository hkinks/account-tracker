import React from 'react';
import styled from 'styled-components';

const SummaryContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SummaryTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
`;

const TotalAmount = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #2c3e50;
`;

interface AccountsSummaryProps {
  totalEurValue: number;
  accounts: any[];
}

const AccountsSummary: React.FC<AccountsSummaryProps> = ({ totalEurValue, accounts }) => {
  return (
    <SummaryContainer>
      <SummaryTitle>Accounts Summary</SummaryTitle>
      <TotalAmount>€{totalEurValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TotalAmount>
      <div>Total accounts: {accounts.length}</div>
    </SummaryContainer>
  );
};

export default AccountsSummary; 