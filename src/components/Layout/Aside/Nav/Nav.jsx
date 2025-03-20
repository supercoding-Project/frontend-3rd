import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BsCalendar4,
  BsCalendarFill,
  BsPlus,
  BsPeople,
  BsPeopleFill,
  BsBoxArrowLeft,
  BsChevronDown,
  BsChevronUp,
} from 'react-icons/bs';
import { AuthContext } from '../../../../context/AuthContext';
import CalendarListForMemberList from './Members/CalendarListForMemberList';

const NavContainer = styled.div`
  flex: 1;
  margin: 20px 40px;
  padding-bottom: 20px;
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
  margin-top: auto;
  cursor: pointer;
  svg {
    margin-right: 15px;
    font-size: var(--font-xxl);
  }
`;

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate(); // 현재 경로를 가져옵니다.
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  const isCalendarPage = location.pathname === '/';
  const isMemberPage = location.pathname === '/members'; //다른 페이지 선택되어있을 때 모습 확인용

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleToggle = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  const handleNavigateToCalendar = () => {
    navigate('/');
  };

  const handleNavigateToMembers = () => {
    navigate('/members');
  };

  return (
    <NavContainer>
      <ul>
        <NavItem $active={isCalendarPage} onClick={handleNavigateToCalendar}>
          {isCalendarPage ? <BsCalendarFill /> : <BsCalendar4 />}
          Calendar
          <BsPlus className='plus-icon' />
        </NavItem>
        {/* <NavItem $active={isMemberPage} onClick={handleNavigateToMembers}>
          {isMemberPage ? <BsPeopleFill /> : <BsPeople />}
          Member
          {isToggleOpen ? (
            <BsChevronUp className='plus-icon' onClick={handleToggle} />
          ) : (
            <BsChevronDown className='plus-icon' onClick={handleToggle} />
          )}
          {isToggleOpen && <MemberList />}
        </NavItem> */}
        <Accordion>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>
                <NavItem $active={isMemberPage} onClick={handleNavigateToMembers}>
                  <BsPeople />
                  Member
                  {isToggleOpen ? (
                    <BsChevronUp className='plus-icon' onClick={handleToggle} />
                  ) : (
                    <BsChevronDown className='plus-icon' onClick={handleToggle} />
                  )}
                </NavItem>
              </AccordionItemButton>
            </AccordionItemHeading>
            {isToggleOpen && (
              <AccordionItemPanel>
                <CalendarListForMemberList />
              </AccordionItemPanel>
            )}
          </AccordionItem>
        </Accordion>
      </ul>
      {isAuthenticated ? (
        <Logout onClick={handleLogout}>
          <BsBoxArrowLeft />
          Logout
        </Logout>
      ) : null}
    </NavContainer>
  );
};

export default Nav;
