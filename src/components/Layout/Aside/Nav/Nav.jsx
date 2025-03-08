import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { BsCalendar4, BsCalendarFill, BsPlus, BsPeople, BsPeopleFill, BsBoxArrowLeft } from 'react-icons/bs';

const NavContainer = styled.div`
  margin: 20px 40px;
`;

const NavItem = styled.li`
  font-size: var(--font-lg);
  display: flex;
  align-items: center;
  color: ${(props) => (props.$active ? 'var(--color-main-active)' : 'var(--color-main-inactive)')};
  cursor: pointer;
  position: relative;
  margin-bottom: 20px;
  svg {
    margin-right: 15px;
    font-size: var(--font-xxl);
  }
  .plus-icon {
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 0;
    font-size: var(--font-xl);
  }
`;

const Logout = styled.div`
  display: flex;
  align-items: center;
  color: var(--color-main-inactive);
  font-size: var(--font-lg);
  position: absolute;
  bottom: 20px;
  left: 40px;
  cursor: pointer;
  svg {
    margin-right: 15px;
    font-size: var(--font-xxl);
  }
`;

const Nav = () => {
  const location = useLocation(); // 현재 경로를 가져옵니다.

  const isCalendarPage = location.pathname === '/';
  const isMemberPage = location.pathname === '/member'; //다른 페이지 선택되어있을 때 모습 확인용

  return (
    <NavContainer>
      <ul>
        <NavItem $active={isCalendarPage}>
          {isCalendarPage ? <BsCalendarFill /> : <BsCalendar4 />}
          Calendar
          <BsPlus className='plus-icon' />
        </NavItem>
        <NavItem $active={isMemberPage}>
          {isMemberPage ? <BsPeopleFill /> : <BsPeople />}
          Member
        </NavItem>
      </ul>
      <Logout>
        <BsBoxArrowLeft />
        Logout
      </Logout>
    </NavContainer>
  );
};

export default Nav;
