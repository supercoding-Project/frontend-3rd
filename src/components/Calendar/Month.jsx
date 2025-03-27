import {
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
  startOfWeek,
  format,
  endOfWeek,
  isSameMonth,
  isSameDay,
  subMonths,
  addMonths,
} from 'date-fns';
import { useState, useEffect } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { useCalendar } from '../../context/CalendarContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Month = () => {
  const { selectedCalendar, calendarList } = useCalendar();
  const [events, setEvents] = useState([]);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weeks = ['일', '월', '화', '수', '목', '금', '토'];

  useEffect(() => {
    if (selectedCalendar.length > 0) {
      // 각 캘린더에 대해 일정을 조회
      selectedCalendar.forEach((calendarId) => {
        axios
          .get(
            `http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/api/v1/schedules?view=MONTHLY&calendarId=${calendarId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
            }
          )
          .then((response) => {
            const fetchedEvents = response.data.data;
            setEvents((prevEvents) => [...prevEvents, ...fetchedEvents]); // 이전 일정과 합치기
            const grouped = groupEventsByDate(fetchedEvents);
            setGroupedEvents((prevGrouped) => ({
              ...prevGrouped,
              ...grouped,
            }));
          })
          .catch((error) => {
            console.error('API 요청 에러:', error);
          });
      });
    }
  }, [selectedCalendar, currentDate]);

  // 이벤트를 날짜별로 그룹화
  const groupEventsByDate = (events) => {
    const groupedEvents = {};

    events.forEach((event) => {
      const date = event.startTime.split(' ')[0]; // '2025-03-19' 형식으로 날짜만 추출
      if (!groupedEvents[date]) {
        groupedEvents[date] = [];
      }
      // 캘린더 색을 event에 추가
      const calendar = calendarList.find((cal) => cal.calendarId === event.calendarId);

      console.log('일정의 캘린더:', calendar);

      groupedEvents[date].push({
        ...event,
        calendarColor: calendar ? calendar.calendarColor : 'lightgray', // 기본값 설정
      });
    });

    return groupedEvents;
  };

  const handleChangeMonth = (selectedButton) => {
    if (selectedButton === 'prev') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const handleScheduleEdit = (day) => {
    navigate('/schedule-edit', { state: { selectedDate: format(day, 'yyyy-MM-dd') } });
  };

  // 날짜에 해당하는 일정 표시
  const renderDayEvents = (date) => {
    const eventsForDay = groupedEvents[date] || [];
    return eventsForDay.map((event, index) => (
      <EventItem
        key={event.scheduleId}
        $calendarColor={event.calendarColor}
        style={{ top: `${index * 20}px`, zIndex: eventsForDay.length - index }}
      >
        {event.title}
      </EventItem>
    ));
  };

  return (
    <Container>
      <DateContainer>
        <div>
          <button type='button' onClick={() => handleChangeMonth('prev')}>
            <BsChevronLeft />
          </button>
          <div>{format(currentDate, 'yyyy. MM.')}</div>
          <button type='button' onClick={() => handleChangeMonth('next')}>
            <BsChevronRight />
          </button>
        </div>
      </DateContainer>
      <WeekContainer>
        {weeks.map((week) => (
          <div key={week}>{week}</div>
        ))}
      </WeekContainer>
      <DayContainer>
        {days.map((day) => {
          const date = format(day, 'yyyy-MM-dd'); // date를 format을 통해 yyyy-MM-dd 형식으로 변환
          return (
            <Day
              key={date}
              $isCurrentDay={isSameDay(day, new Date())}
              $isCurrentMonth={isSameMonth(day, currentDate)}
              onClick={() => handleScheduleEdit(day)}
            >
              <span>{format(day, 'd')}</span>
              {renderDayEvents(date)} {/* 수정된 부분: day를 사용하여 date로 변환하여 넘김 */}
            </Day>
          );
        })}
      </DayContainer>
    </Container>
  );
};

export default Month;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 20.5px);
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6%;
  padding-bottom: 10px;

  & button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 10px;
    border: none;
    background: transparent;
    cursor: pointer;
  }

  & div {
    display: flex;
    flex-direction: row;
    padding-top: 3px;
  }

  & svg {
    width: 16px;
    height: 16px;
  }
`;

const WeekContainer = styled.div`
  display: flex;
  background: var(--color-border);

  & div {
    width: 100%;
    padding: 5px;
    font-size: var(--font-md);
    font-weight: 400;
  }
`;

const DayContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-left: 1px solid var(--color-border);
  flex-grow: 1;
`;

const Day = styled.div`
  width: calc(100% / 7);
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  background: ${({ $isCurrentDay }) => ($isCurrentDay ? 'rgba(106, 121, 248, 0.1)' : 'transparent')};
  cursor: pointer;
  position: relative; /* 부모의 위치 지정 */
  & span {
    font-size: var(--font-sm);
    padding-left: 5px;
    color: ${({ $isCurrentMonth }) => ($isCurrentMonth ? 'var(--color-text-primary)' : 'var(--color-text-disabled)')};
  }
`;

const EventItem = styled.div`
  position: absolute;
  bottom: 5px;
  left: 5px;
  right: 5px;
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
  background-color: ${({ $calendarColor }) => $calendarColor || 'rgba(106, 121, 248, 0.2)'}; /* 캘린더 색 적용 */
  padding: 2px;
  border-radius: 3px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
