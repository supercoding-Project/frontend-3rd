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
  height: 100vh; /* 전체 높이 고정 */
  display: flex;
  flex-direction: column; /* 📌 로그아웃 버튼을 아래로 밀리게 함 */
  overflow-y: auto; /* 기본적으로 숨김 */
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
