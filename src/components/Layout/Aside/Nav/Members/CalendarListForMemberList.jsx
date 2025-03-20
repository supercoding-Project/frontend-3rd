import React from 'react';
import styled from 'styled-components';
import { useCalendar } from '../../../../../context/CalendarContext';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  gap: 5px;
  margin-bottom: 30px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  background-color: ${(props) => props.bgColor || 'lightgray'};
  padding: 5px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const CalendarListForMemberList = () => {
  const { selectedCalendar, setSelectedCalendar } = useCalendar();

  const handleCheckboxChange = (calendarId) => {
    setSelectedCalendar(selectedCalendar === calendarId ? null : calendarId);
  };
  return (
    <ListContainer>
      <CheckboxLabel bgColor='var(--color-calendar-3)'>
        <Checkbox type='checkbox' checked={selectedCalendar === 1} onChange={() => handleCheckboxChange(1)} />
        공유캘린더1
      </CheckboxLabel>
      <CheckboxLabel bgColor='var(--color-calendar-5)'>
        <Checkbox type='checkbox' checked={selectedCalendar === 2} onChange={() => handleCheckboxChange(2)} />
        공유캘린더2
      </CheckboxLabel>
    </ListContainer>
  );
};

export default CalendarListForMemberList;
