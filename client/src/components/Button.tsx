import React from 'react';
import styled from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
}

const StyledButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  hasIcon: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
  
  /* Size variations */
  padding: ${({ size }) => 
    size === 'small' ? '5px 10px' : 
    size === 'medium' ? '8px 16px' : 
    '10px 15px'};
  
  font-size: ${({ size }) => 
    size === 'small' ? '14px' : 
    size === 'medium' ? '16px' : 
    '18px'};
  
  /* Variant styles */
  background-color: ${({ variant }) => 
    variant === 'primary' ? '#4CAF50' : 
    variant === 'secondary' ? '#666666' : 
    variant === 'danger' ? '#f44336' : 
    '#4CAF50'};
  
  color: white;
  
  &:hover {
    background-color: ${({ variant }) => 
      variant === 'primary' ? '#45a049' : 
      variant === 'secondary' ? '#555555' : 
      variant === 'danger' ? '#d32f2f' : 
      '#45a049'};
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  icon,
  children,
  ...props
}) => {
  return (
    <StyledButton 
      variant={variant} 
      size={size} 
      hasIcon={!!icon}
      {...props}
    >
      {icon}
      {children}
    </StyledButton>
  );
};

export default Button; 