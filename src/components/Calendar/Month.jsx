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
import { useState, useEffect, useContext } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { useCalendar } from '../../context/CalendarContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import ScheduleDetailModal from '../common/ScheduleDetailModal';
import ScheduleEditModal from '../common/ScheduleEditModal';
import ScheduleDeleteModal from '../common/ScheduleDeleteModal';

const Month = () => {
  const { selectedCalendar } = useCalendar();
  const [events, setEvents] = useState([]);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarColors, setCalendarColors] = useState({});
  const [hoveredEventId, setHoveredEventId] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState(''); // 'view' | 'edit' | 'delete'

  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weeks = ['일', '월', '화', '수', '목', '금', '토'];

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
    if (selectedCalendar.length === 0) {
      setEvents([]);
      setGroupedEvents({});
      return;
    }

    const fetchEvents = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const baseUrl = apiUrl ? `${apiUrl}/api` : '/api';
        const eventPromises = selectedCalendar.map((calendarId) =>
          axios.get(`${baseUrl}/v1/schedules?view=MONTHLY&calendarId=${calendarId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          })
        );

        const responses = await Promise.all(eventPromises);
        let allEvents = responses.flatMap((res) => res.data.data);

        setEvents(allEvents);
        setGroupedEvents(groupEventsByDate(allEvents));
      } catch (error) {
        console.error('일정 가져오기 실패:', error);
      }
    };

    fetchEvents();
  }, [selectedCalendar, calendarColors]);

  const groupEventsByDate = (events) => {
    const grouped = {};
    events.forEach((event) => {
      const date = event.startTime.split(' ')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }

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
    if (!isAuthenticated) {
      alert('로그인 후 이용해 주세요.');
      return;
    }
    navigate('/schedule-edit', { state: { selectedDate: format(day, 'yyyy-MM-dd') } });
  };

  const handleOpenModal = (event, type) => {
    setModalData(event);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setModalData(null);
    setModalType('');
  };

  const handleDelete = async () => {
    if (!modalData) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const baseUrl = apiUrl ? `${apiUrl}/api` : '/api';

      await axios.delete(`${baseUrl}/v1/schedules/${modalData.scheduleId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      setGroupedEvents((prev) => {
        const updated = { ...prev };
        const date = modalData.startTime.split(' ')[0];
        updated[date] = updated[date].filter((e) => e.scheduleId !== modalData.scheduleId);
        return updated;
      });

      handleCloseModal();
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  return (
    <Container>
      <DateContainer>
        <button onClick={() => handleChangeMonth('prev')}>
          <BsChevronLeft />
        </button>
        <div>{format(currentDate, 'yyyy. MM.')}</div>
        <button onClick={() => handleChangeMonth('next')}>
          <BsChevronRight />
        </button>
      </DateContainer>

      <WeekContainer>
        {weeks.map((week) => (
          <div key={week}>{week}</div>
        ))}
      </WeekContainer>

      <DayContainer>
        {days.map((day) => {
          const date = format(day, 'yyyy-MM-dd');
          const eventsForDay = groupedEvents[date] || [];

          return (
            <Day
              key={date}
              $isCurrentDay={isSameDay(day, new Date())}
              $isCurrentMonth={isSameMonth(day, currentDate)}
              onClick={() => handleScheduleEdit(day)}
            >
              <span>{format(day, 'd')}</span>
              {eventsForDay.map((event, index) => (
                <EventItem
                  key={event.scheduleId}
                  $calendarColor={event.calendarColor}
                  onMouseEnter={() => setHoveredEventId(event.scheduleId)}
                  onMouseLeave={() => setHoveredEventId(null)}
                  style={{ top: `${(index + 1) * 22}px`, zIndex: eventsForDay.length - index }}
                >
                  {event.title}
                  {hoveredEventId === event.scheduleId && (
                    <HoverIcons>
                      <FaEye
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(event, 'view');
                        }}
                      />
                      <FaEdit
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(event, 'edit');
                        }}
                      />
                      <FaTrash
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(event, 'delete');
                        }}
                      />
                    </HoverIcons>
                  )}
                </EventItem>
              ))}
            </Day>
          );
        })}
      </DayContainer>

      {modalType === 'view' && modalData && <ScheduleDetailModal schedule={modalData} onClose={handleCloseModal} />}
      {modalType === 'edit' && modalData && <ScheduleEditModal schedule={modalData} onClose={handleCloseModal} />}
      {modalType === 'delete' && modalData && (
        <ScheduleDeleteModal schedule={modalData} onClose={handleCloseModal} onDelete={handleDelete} />
      )}
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
  position: relative;

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
  padding: 5px 30px 5px 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  height: 22px;
`;

const HoverIcons = styled.div`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 6px;

  svg {
    width: 14px;
    height: 14px;
    cursor: pointer;
    color: #444;

    &:hover {
      color: #000;
    }
  }
`;
