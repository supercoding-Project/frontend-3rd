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
import CalendarList from './Calendar/CalendarList';

const NavContainer = styled.div`
  flex: 1;
  padding-bottom: 20px;
  .accodianHeading {
    margin: 20px 40px 10px;
  }
`;

const NavItem = styled.div`
  font-size: var(--font-lg);
  display: flex;
  align-items: center;
  color: ${(props) => (props.$active ? 'var(--color-main-active)' : 'var(--color-main-inactive)')};
  cursor: pointer;
  position: relative;
  svg {
    margin-right: 15px;
    font-size: var(--font-xxl);
  }
  .plus-icon {
    position: absolute;
    right: 0px;
    top: 16%;
    transform: translateX(-130%);
    margin-right: 0;
    font-size: var(--font-xl);
  }
  .icon {
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

const StyledUpIcon = styled(BsChevronUp)`
  width: 15px;
  height: 15px;
`;

const StyledDownIcon = styled(BsChevronDown)`
  width: 15px;
  height: 15px;
`;
const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isCalendarToggleOpen, setIsCalendarToggleOpen] = useState(false);
  const [isMemberToggleOpen, setIsMemberToggleOpen] = useState(false);

  const isCalendarPage = location.pathname === '/';
  const isMemberPage = location.pathname === '/members';
  //const isCreateCalendar = location.pathname === '/create-calendar'; //다른 페이지 선택되어있을 때 모습 확인용

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCalendarToggle = () => {
    setIsCalendarToggleOpen(!isCalendarToggleOpen);
  };

  const handleMemberToggle = () => {
    setIsMemberToggleOpen(!isMemberToggleOpen);
  };

  const handleNavigateToCalendar = () => {
    navigate('/');
  };

  const handleNavigateToMembers = () => {
    navigate('/members');
  };

  const handleNavigateToCreateCalendar = () => {
    navigate('/create-calendar');
  };

  return (
    <NavContainer>
      <ul>
        <Accordion>
          <AccordionItem>
            <AccordionItemHeading className='accodianHeading'>
              <AccordionItemButton>
                <NavItem as='li' $active={isCalendarPage} onClick={handleNavigateToCalendar}>
                  {isCalendarPage ? <BsCalendarFill /> : <BsCalendar4 />}
                  Calendar
                  <BsPlus
                    className='plus-icon'
                    onClick={(event) => {
                      event.stopPropagation(); // NavItem 클릭 이벤트 방지
                      handleNavigateToCreateCalendar();
                    }}
                  />
                  {isCalendarToggleOpen ? (
                    <StyledUpIcon className='icon' onClick={handleCalendarToggle} />
                  ) : (
                    <StyledDownIcon className='icon' onClick={handleCalendarToggle} />
                  )}
                </NavItem>
              </AccordionItemButton>
            </AccordionItemHeading>
            {isCalendarToggleOpen && (
              <AccordionItemPanel>
                <CalendarList />
              </AccordionItemPanel>
            )}
          </AccordionItem>
        </Accordion>
        <Accordion>
          <AccordionItem>
            <AccordionItemHeading className='accodianHeading'>
              <AccordionItemButton>
                <NavItem $active={isMemberPage} onClick={handleNavigateToMembers}>
                  {isMemberPage ? <BsPeopleFill /> : <BsPeople />}
                  Member
                  {isMemberToggleOpen ? (
                    <StyledUpIcon className='icon' onClick={handleMemberToggle} />
                  ) : (
                    <StyledDownIcon className='icon' onClick={handleMemberToggle} />
                  )}
                </NavItem>
              </AccordionItemButton>
            </AccordionItemHeading>
            {isMemberToggleOpen && (
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
