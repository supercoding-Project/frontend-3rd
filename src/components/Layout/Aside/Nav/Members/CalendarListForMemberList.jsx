import React, { useContext } from 'react';
import styled from 'styled-components';
import { useCalendar } from '../../../../../context/CalendarContext';
import { FaCheck } from 'react-icons/fa';
import { AuthContext } from '../../../../../context/AuthContext';

const CalendarListForMemberList = () => {
  const { calendarList, selectedCalendarsForMembers, dispatch } = useCalendar();
  const { isAuthenticated } = useContext(AuthContext);

  // 공유 캘린더만 필터링
  const sharedCalendars = calendarList.filter((calendar) => calendar.calendarType === 'SHARED');

  const handleCheckboxChange = (calendarId) => {
    const isAlreadySelected = selectedCalendarsForMembers.includes(calendarId);

    dispatch({
      type: 'SET_SELECTED_CALENDARS',
      payload: isAlreadySelected ? [] : [calendarId],
    });
  };

  if (!isAuthenticated) {
    return <CalendarLoading>로그인 후에 사용해주세요.</CalendarLoading>;
  }

  if (sharedCalendars.length === 0) {
    return <CalendarLoading>공유 캘린더가 없습니다.</CalendarLoading>;
  }

  return (
    <ListContainer>
      {sharedCalendars.map((calendar) => (
        <CheckboxLabel key={calendar.calendarId}>
          <CheckboxInput
            checked={selectedCalendarsForMembers.includes(calendar.calendarId)}
            onChange={() => handleCheckboxChange(calendar.calendarId)}
            id={`checkbox-${calendar.calendarId}`}
          />
          <CheckboxStyle bgColor={calendar.calendarColor}>
            {selectedCalendarsForMembers.includes(calendar.calendarId) && (
              <CheckStyle>
                <FaCheck />
              </CheckStyle>
            )}
          </CheckboxStyle>
          {calendar.calendarName}
        </CheckboxLabel>
      ))}
    </ListContainer>
  );
};

export default CalendarListForMemberList;

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
  padding: 5px 20px 5px 40px;
`;

const CheckboxInput = styled.input.attrs(() => ({
  type: 'checkbox',
}))`
  display: none;
`;

const CheckboxStyle = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'bgColor',
})`
  width: 18px;
  height: 18px;
  margin-right: 10px;
  background-color: ${(props) => props.bgColor || 'lightgray'};
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
`;

const CheckStyle = styled(FaCheck)`
  color: white;
  font-size: 12px;
  position: absolute;
  font-weight: bold;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const CalendarLoading = styled.p`
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;
