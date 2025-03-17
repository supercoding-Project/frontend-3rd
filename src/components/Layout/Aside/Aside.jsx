import React, { useContext } from 'react';
import styled from 'styled-components';
import Logo from './Logo/Logo';
import UserPanel from './UserPanel/UserPanel';
import Nav from './Nav/Nav';
import Login from './Login/Login';
import { AuthContext } from '../../../context/AuthContext';

const AsideContainer = styled.aside`
  width: 300px;
  border-right: 1px solid var(--color-border);
`;

const Aside = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <AsideContainer>
      <Logo />
      {isAuthenticated ? <UserPanel /> : <Login />}
      <Nav />
    </AsideContainer>
  );
};

export default Aside;
