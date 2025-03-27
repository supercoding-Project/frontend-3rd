import { Outlet } from 'react-router-dom';
import Aside from './Aside/Aside';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1; /* 남은 공간 모두 차지 */
  padding: 20px;
`;

const Layout = () => {
  return (
    <LayoutContainer>
      <Aside />
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
