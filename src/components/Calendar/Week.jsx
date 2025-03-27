import { eachDayOfInterval, startOfWeek, endOfWeek, format, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { ko } from 'date-fns/locale'; // 한국어 로케일 임포트
import { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Week = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigate = useNavigate();

  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleChangeWeek = (direction) => {
    setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
  };

  const handleScheduleEdit = () => {
    navigate('/schedule-edit');
  };

  return (
    <Container>
      <DateContainer>
        <div>
          <button type='button' onClick={() => handleChangeWeek('prev')}>
            <BsChevronLeft />
          </button>
          <div>{`${format(startDate, 'yyyy. MM. dd', { locale: ko })} ~ ${format(endDate, 'MM. dd', { locale: ko })}`}</div>
          <button type='button' onClick={() => handleChangeWeek('next')}>
            <BsChevronRight />
          </button>
        </div>
      </DateContainer>
      <DayContainer>
        {days.map((day) => (
          <Day key={day} $isCurrentDay={isSameDay(day, new Date())} onClick={handleScheduleEdit}>
            <span>{format(day, 'iiii d', { locale: ko })}</span> {/* 한글 요일 출력 */}
          </Day>
        ))}
      </DayContainer>
    </Container>
  );
};

export default Week;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 20.5px);
`;

const DateContainer = styled.div`
  display: flex;
  align-items: end;
  justify-content: center;
  height: 6%;
  padding-bottom: 15px;

  & button {
    display: inline-flex;
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

const DayContainer = styled.div`
  display: flex;
  border-left: 1px solid var(--color-border);
  flex-grow: 1;
`;

const Day = styled.div`
  width: calc(100% / 7);
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  background: ${({ $isCurrentDay }) => ($isCurrentDay ? 'rgba(106, 121, 248, 0.1)' : 'transparent')};
  cursor: pointer;
  padding: 10px;

  & span {
    font-size: var(--font-sm);
    color: var(--color-text-primary);
  }
`;
