import React from 'react';
import styled from 'styled-components';

const MainContainer = styled.div`
  padding: 20px;
`;

const Main: React.FC = () => {
  return (
    <MainContainer>
      <h1>Welcome</h1>
    </MainContainer>
  );
};

export default Main;
