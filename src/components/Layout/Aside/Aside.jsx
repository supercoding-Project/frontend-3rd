import React from 'react';
import styled from 'styled-components';
import Logo from './Logo/Logo';
import UserPanel from './UserPanel/UserPanel';
import Nav from './Nav/Nav';

const AsideContainer = styled.aside`
  width: 300px;
  border-right: 1px solid var(--color-border);
`;

const Aside = () => {
  return (
    <AsideContainer>
      <Logo />
      <UserPanel />
      <Nav />
    </AsideContainer>
  );
};

export default Aside;
