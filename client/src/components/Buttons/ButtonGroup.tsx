import React from 'react';
import styled from 'styled-components';

interface ButtonGroupProps {
  children: React.ReactNode;
  spacing?: string;
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
}

const StyledButtonGroup = styled.div<{
  spacing: string;
  direction: 'row' | 'column';
  align: string;
  justify: string;
}>`
  display: flex;
  flex-direction: ${props => props.direction};
  align-items: ${props => props.align};
  justify-content: ${props => props.justify};
  gap: ${props => props.spacing};
`;

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  spacing = '10px',
  direction = 'row',
  align = 'center',
  justify = 'start',
}) => {
  return (
    <StyledButtonGroup 
      spacing={spacing} 
      direction={direction}
      align={align}
      justify={justify}
    >
      {children}
    </StyledButtonGroup>
  );
};

export default ButtonGroup; 