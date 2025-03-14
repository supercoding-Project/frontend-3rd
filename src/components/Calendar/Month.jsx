import {
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
  subYears,
} from 'date-fns';
import { useState } from 'react';
import { BsCaretLeftFill } from 'react-icons/bs';
import { BsCaretRightFill } from 'react-icons/bs';
import { BsFillFastForwardFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Month = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const navigate = useNavigate();

  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weeks = ['일', '월', '화', '수', '목', '금', '토'];

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handlePrevYear = () => {
    setCurrentMonth(subYears(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleNextYear = () => {
    setCurrentMonth(addYears(currentMonth, 1));
  };

  const handlePageNavigation = () => {
    navigate('/schedule-edit');
  };

  return (
    <Container>
      <DateWrapper>
        <button onClick={handlePrevYear}>
          <BsFillFastForwardFill />
        </button>
        <button onClick={handlePrevMonth}>
          <BsCaretLeftFill />
        </button>
        <div>
          <span>{format(currentMonth, 'yyyy')}년</span>
          <span>{format(currentMonth, 'MM')}월</span>
        </div>
        <button onClick={handleNextMonth}>
          <BsCaretRightFill />
        </button>
        <button onClick={handleNextYear}>
          <BsFillFastForwardFill />
        </button>
      </DateWrapper>
      <WeeksWrapper>
        {weeks.map((week) => (
          <div key={week}>{week}</div>
        ))}
      </WeeksWrapper>
      <DaysWrapper>
        {days.map((day) => (
          <Day
            key={day}
            $isToday={isSameDay(day, new Date())}
            $isCurrentMonth={isSameMonth(day, currentMonth)}
            onClick={handlePageNavigation}
          >
            <span>{format(day, 'd')}</span>
          </Day>
        ))}
      </DaysWrapper>
    </Container>
  );
};

export default Month;

const Container = styled.div`
  height: calc(100% - 88.5px);
`;

const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;

  & div {
    width: 120px;
    display: flex;
    align-items: center;
    font-size: var(--font-lg);
    font-weight: 400;
    justify-content: center;
    gap: 8px;
  }

  & button {
    width: 30px;
    height: 30px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    font-size: var(--font-lg);
    color: var(--color-main-inactive);
    cursor: pointer;
  }

  & button:first-child,
  button:last-child {
    font-size: var(--font-xl);
  }

  & button:first-child {
    transform: rotateY(180deg);
  }

  & button:active {
    color: var(--color-main-active);
  }
`;

const WeeksWrapper = styled.div`
  display: flex;

  & div {
    flex-grow: 1;
    background: var(--color-border);
    font-weight: 400;
    padding: 5px;
  }
`;

const DaysWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  flex-grow: 1;
  border-top: 1px solid var(--color-border);
  border-left: 1px solid var(--color-border);
  cursor: pointer;
`;

const Day = styled.div`
  width: calc(100% / 7);
  flex-grow: 1;
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  background: ${({ $isToday }) => ($isToday ? 'rgba(106, 121, 248, 0.1)' : 'transparent')};
  padding: 5px;

  & span {
    font-size: var(--font-sm);
    color: ${({ $isCurrentMonth }) => ($isCurrentMonth ? 'var(--color-text-primary)' : 'var(--color-text-disabled)')};
  }
`;
