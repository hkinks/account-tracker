import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const MenuContainer = styled.nav`
  background-color: #333;
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 4px;
`;

const MenuList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MenuItem = styled.li`
  margin: 0;
`;

const StyledNavLink = styled(NavLink)`
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #444;
  }

  &.active {
    background-color: #4caf50;
    color: white;
  }
`;

interface MenuProps {
  className?: string;
}

const Menu: React.FC<MenuProps> = ({ className }) => {
  return (
    <MenuContainer className={className}>
      <MenuList>
        <MenuItem>
          <StyledNavLink to="/" end>
            Dashboard
          </StyledNavLink>
        </MenuItem>
        <MenuItem>
          <StyledNavLink to="/transactions">Transactions</StyledNavLink>
        </MenuItem>
        <MenuItem>
          <StyledNavLink to="/accounts">Accounts</StyledNavLink>
        </MenuItem>
        <MenuItem>
          <StyledNavLink to="/balance-records">Balance Records</StyledNavLink>
        </MenuItem>
      </MenuList>
    </MenuContainer>
  );
};

export default Menu;
