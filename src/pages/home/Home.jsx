import { useState, useEffect } from 'react';
import Month from '../../components/Calendar/Month';
import Week from '../../components/Calendar/Week';
import Day from '../../components/Calendar/Day';
import styled from 'styled-components';
import { useCalendar } from '../../context/CalendarContext';
import axios from 'axios';

const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080';

const Home = () => {
  const [selected, setSelected] = useState('month');
  const { selectedCalendar, dispatch } = useCalendar();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (selectedCalendar.length > 0) {
      // 선택된 캘린더가 있을 경우, 첫 번째 캘린더로 API 요청을 보냄
      const calendarId = selectedCalendar[0]; // 선택된 첫 번째 캘린더의 ID
      const fetchEvents = async () => {
        try {
          const response = await axios.get(`${SERVER_URL}/api/v1/schedules?view=MONTHLY&calendarId=${calendarId}`, {
            params: {
              calendarIds: selectedCalendar.join(','), // 여러 개의 캘린더 ID를 쉼표로 구분하여 전달
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });
          setEvents(response.data.data); // 서버에서 받아온 일정을 state에 저장
        } catch (error) {
          console.error('일정 불러오기 오류:', error);
        }
      };
      fetchEvents();
    }
  }, [selectedCalendar]); // selectedCalendar가 변경될 때마다 일정 업데이트

  const calendar = {
    month: <Month events={events} />,
    week: <Week events={events} />,
    day: <Day events={events} />,
  };

  const handleSelectButton = (selectedButton) => {
    setSelected(selectedButton);
  };

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
