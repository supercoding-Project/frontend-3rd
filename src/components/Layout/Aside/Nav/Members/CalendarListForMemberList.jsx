import React from 'react';
import styled from 'styled-components';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  gap: 5px;
  margin-bottom: 30px;
`;

const CheckboxLabel1 = styled.label`
  display: flex;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  background-color: var(--color-calendar-3);
`;

const CheckboxLabel2 = styled.label`
  display: flex;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  background-color: var(--color-calendar-5);
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const CalendarListForMemberList = () => {
  return (
    <ListContainer>
      <CheckboxLabel1>
        <Checkbox type='checkbox' />
        공유캘린더1
      </CheckboxLabel1>
      <CheckboxLabel2>
        <Checkbox type='checkbox' />
        공유캘린더2
      </CheckboxLabel2>
    </ListContainer>
  );
};

export default CalendarListForMemberList;
