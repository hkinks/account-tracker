import React from 'react';
import styled from 'styled-components';

export interface GraphPaneProps {
  children: React.ReactNode;
  title?: string;
}

const GraphPaneContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
`;

const GraphPaneTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
  color: #333;
`;

// GraphPane component that can be reused
const GraphPane: React.FC<GraphPaneProps> = ({ children, title }) => {
  return (
    <GraphPaneContainer>
      {title && <GraphPaneTitle>{title}</GraphPaneTitle>}
      {children}
    </GraphPaneContainer>
  );
};

export default GraphPane; 