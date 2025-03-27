import { useState, useEffect } from 'react';
import Month from '../../components/Calendar/Month';
import Week from '../../components/Calendar/Week';
import Day from '../../components/Calendar/Day';
import styled from 'styled-components';
import { useCalendar } from '../../context/CalendarContext';

const Home = () => {
  const [selected, setSelected] = useState('month');
  // const { selectedCalendar, events, fetchEvent } = useCalendar();

  // useEffect(() => {
  //   fetchEvent();
  // }, [fetchEvent]);

  // const filteredEvents = (events ?? []).filter((event) => (selectedCalendar ?? []).includes(event.calendarId));

  const calendar = {
    month: <Month />,
    week: <Week />,
    day: <Day />,
  };

  const handleSelectButton = (selectedButton) => {
    setSelected(selectedButton);
  };

  // const isSharedCalendar =
  //   selectedCalendar &&
  //   events &&
  //   selectedCalendar.some((id) => events.find((event) => event.calendarId === id)?.calendarType === 'shared');

  return (
    <>
      <Tab>
        <TabButton $selected={selected === 'month'}>
          <button onClick={() => handleSelectButton('month')}>월간</button>
        </TabButton>
        <TabButton $selected={selected === 'week'}>
          <button onClick={() => handleSelectButton('week')}>주간</button>
        </TabButton>
        <TabButton $selected={selected === 'day'}>
          <button onClick={() => handleSelectButton('day')}>일간</button>
        </TabButton>
      </Tab>
      <ButtonContainer>
        <TodoButton onClick={() => console.log('초대 기능 구현 예정')}>할 일 보기</TodoButton>
      </ButtonContainer>
      {/* 공유 캘린더 선택 시 초대 버튼 표시 */}
      {/* {isSharedCalendar && ( */}
      {/* )} */}

      {calendar[selected]}
    </>
  );
};

export default Home;

const Tab = styled.ul`
  display: flex;
  align-items: end;
  gap: 30px;
`;

const TabButton = styled.li`
  position: relative;

  & button {
    font-weight: bold;
    border: none;
    background: transparent;
    font-size: var(--font-md);
    color: ${({ $selected }) => ($selected ? 'var(--color-main-active)' : 'var(--color-main-inactive)')};
    padding: 0;
    cursor: pointer;
  }

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -15px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 15px;
    background-color: var(--color-border);
  }
`;

const TodoButton = styled.button`
  background-color: var(--color-main-active);
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.01;
  &:hover {
    background-color: var(--color-bg-primary);
    color: black;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 5px;
`;
