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
import { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Month = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigate = useNavigate();

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weeks = ['일', '월', '화', '수', '목', '금', '토'];

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
        {days.map((day) => (
          <Day
            key={day}
            $isCurrentDay={isSameDay(day, new Date())}
            $isCurrentMonth={isSameMonth(day, currentDate)}
            onClick={() => handleScheduleEdit(day)}
          >
            <span>{format(day, 'd')}</span>
          </Day>
        ))}
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

  & span {
    font-size: var(--font-sm);
    padding-left: 5px;
    color: ${({ $isCurrentMonth }) => ($isCurrentMonth ? 'var(--color-text-primary)' : 'var(--color-text-disabled)')};
  }
`;
