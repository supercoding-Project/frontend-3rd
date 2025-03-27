import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useCalendar } from '../../../../../context/CalendarContext';
import axios from 'axios';

const CalendarList = () => {
  const { selectedCalendar, calendarList, dispatch } = useCalendar();

  useEffect(() => {
    axios
      .get('http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/api/v1/calendars', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((response) => {
        console.log('API 응답:', response.data);
        // calendarList 업데이트
        dispatch({ type: 'SET_CALENDAR_LIST', payload: response.data.data }); // 상태 업데이트
      })
      .catch((error) => {
        console.error('API 요청 에러:', error);
      });
  }, [dispatch]); // 의존성 추가 (필수)

  const handleCheckboxChange = (calendarId) => {
    const updated = selectedCalendar.includes(calendarId)
      ? selectedCalendar.filter((id) => id !== calendarId)
      : [...selectedCalendar, calendarId];

    dispatch({ type: 'SET_SELECTED_CALENDAR', payload: updated });
  };

  return (
    <ListContainer>
      {calendarList.length > 0 ? (
        calendarList.map((calendar) => (
          <CheckboxLabel key={calendar.calendarId}>
            <CheckboxInput
              $bgColor={calendar.calendarColor}
              checked={selectedCalendar.includes(calendar.calendarId)}
              onChange={() => handleCheckboxChange(calendar.calendarId)}
              style={{ backgroundColor: calendar.calendarColor }}
            />
            {calendar.calendarName}
          </CheckboxLabel>
        ))
      ) : (
        <p>캘린더 데이터를 불러오는 중...</p>
      )}
    </ListContainer>
  );
};

export default CalendarList;

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
  font-size: 14px;
  cursor: pointer;
  padding: 5px;
  position: relative;
`;

const CheckboxInput = styled.input.attrs(() => ({
  type: 'checkbox',
}))`
  appearance: none;
  width: 18px;
  height: 18px;
  margin-right: 10px;
  position: relative;
  background-color: ${(props) => props.bgColor || 'lightgray'};

  &:checked::after {
    content: '✔';
    color: white;
    font-size: 12px;
    font-weight: bold;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
