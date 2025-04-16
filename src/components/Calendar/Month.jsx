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
  const [calendarColors, setCalendarColors] = useState({});
  const navigate = useNavigate();

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weeks = ['일', '월', '화', '수', '목', '금', '토'];

  // 📌 캘린더 색상 가져오기
  useEffect(() => {
    const fetchCalendarColors = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const baseUrl = apiUrl ? `${apiUrl}/api` : '/api';

        const response = await axios.get(`${baseUrl}/v1/calendars`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        const colors = {};
        response.data.data.forEach((calendar) => {
          colors[calendar.calendarId] = calendar.calendarColor;
        });

        setCalendarColors(colors);
      } catch (error) {
        console.error('캘린더 색상 불러오기 실패:', error);
      }
    };

    fetchCalendarColors();
  }, []);

  useEffect(() => {
    if (selectedCalendar.length > 0) {
      let allEvents = [];

      const fetchEvents = async () => {
        try {
          const eventPromises = selectedCalendar.map((calendarId) =>
            axios.get(`/api/v1/schedules?view=MONTHLY&calendarId=${calendarId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
            })
          );

          const responses = await Promise.all(eventPromises);
          responses.forEach((response) => {
            allEvents = [...allEvents, ...response.data.data];
          });

          setEvents(allEvents);
          setGroupedEvents(groupEventsByDate(allEvents));
        } catch (error) {
          console.error('일정 가져오기 실패:', error);
        }
      };

      fetchEvents();
    }
  }, [selectedCalendar, calendarColors]);

  // 이벤트를 날짜별로 그룹화

  const groupEventsByDate = (events) => {
    const grouped = {};
    events.forEach((event) => {
      const date = event.startTime.split(' ')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }

      // 📌 해당 일정의 캘린더 색상 찾아서 적용
      grouped[date].push({
        ...event,
        calendarColor: calendarColors[event.calendarId] || 'lightgray',
      });
    });

    return grouped;
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
          const date = format(day, 'yyyy-MM-dd');
          return (
            <Day
              key={date}
              $isCurrentDay={isSameDay(day, new Date())}
              $isCurrentMonth={isSameMonth(day, currentDate)}
              onClick={() => handleScheduleEdit(day)}
            >
              <span>{format(day, 'd')}</span>
              {groupedEvents[date]?.map((event, index) => (
                <EventItem
                  key={event.scheduleId}
                  $calendarColor={event.calendarColor}
                  style={{
                    top: `${(index + 1) * 22}px`, // index에 따라 top 값 설정
                    zIndex: groupedEvents[date].length - index, // z-index는 반대로 설정
                  }}
                >
                  {event.title}
                </EventItem>
              ))}
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
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  background-color: ${({ $calendarColor }) => $calendarColor || 'lightgray'};
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  /* height: 22px; */
`;
