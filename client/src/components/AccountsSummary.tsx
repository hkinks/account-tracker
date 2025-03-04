import React from 'react';
import styled from 'styled-components';

const SummaryContent = styled.div`
  width: 100%;
`;

const TotalAmount = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #2c3e50;
`;

const AccountCount = styled.div`
  font-size: 16px;
  color: #555;
`;

interface AccountsSummaryProps {
  totalEurValue: number;
  accounts: any[];
}

const AccountsSummary: React.FC<AccountsSummaryProps> = ({ totalEurValue, accounts }) => {
  return (
    <SummaryContent>
      <TotalAmount>
        €{totalEurValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </TotalAmount>
      <AccountCount>Total accounts: {accounts.length}</AccountCount>
    </SummaryContent>
  );
};

export default AccountsSummary; 