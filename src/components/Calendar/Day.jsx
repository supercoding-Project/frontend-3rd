import { format, addDays, subDays, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale'; // 한국어 로케일 임포트
import { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Day = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null); // 선택된 시간대 관리

  const navigate = useNavigate();

  const handleChangeDay = (direction) => {
    setCurrentDate(direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1));
  };

  const handleScheduleEdit = (timeSlot) => {
    // 시간대 선택 후, 스케줄 수정 페이지로 이동
    setSelectedSlot(timeSlot);
    navigate(`/schedule-edit?date=${format(currentDate, 'yyyy-MM-dd')}&time=${timeSlot}`);
  };

  // 시간대 배열 생성 (예: 8시부터 20시까지 매 시간)
  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) {
    const timeString = `${hour < 10 ? '0' : ''}${hour}:00`;
    timeSlots.push(timeString);
  }

  return (
    <Container>
      <DateContainer>
        <div>
          <button type='button' onClick={() => handleChangeDay('prev')}>
            <BsChevronLeft />
          </button>
          <div>{format(currentDate, 'yyyy. MM. dd iiii', { locale: ko })}</div>
          <button type='button' onClick={() => handleChangeDay('next')}>
            <BsChevronRight />
          </button>
        </div>
      </DateContainer>
      <TimeSlotsContainer>
        {timeSlots.map((timeSlot) => (
          <TimeSlot key={timeSlot} onClick={() => handleScheduleEdit(timeSlot)} $isSelected={selectedSlot === timeSlot}>
            <span>{timeSlot}</span>
          </TimeSlot>
        ))}
      </TimeSlotsContainer>
    </Container>
  );
};

export default Day;

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
  padding-bottom: 10px;

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

const TimeSlotsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
`;

const TimeSlot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--color-border);
  background: ${({ $isSelected }) => ($isSelected ? 'rgba(106, 121, 248, 0.1)' : 'transparent')};
  cursor: pointer;
  padding: 10px;
  margin-bottom: 5px;

  & span {
    font-size: var(--font-lg);
    color: var(--color-text-primary);
  }
`;
