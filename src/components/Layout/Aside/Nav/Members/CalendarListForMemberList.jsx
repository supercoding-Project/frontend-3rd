import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCalendar } from '../../../../../context/CalendarContext';
import axios from 'axios';

const CalendarListForMemberList = () => {
  const { selectedCalendarsForMembers, dispatch } = useCalendar();
  const [calendarList, setCalendarList] = useState([]);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080/api/v1/calendars',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
        if (response.data && response.data.data) {
          const filteredCalendars = response.data.data.filter((calendar) => calendar.calendarType === 'SHARED');
          setCalendarList(filteredCalendars); // 필터링된 캘린더 목록 업데이트
        } else {
          console.error('캘린더 데이터를 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('API 요청 에러:', error.response || error.message || error); // 에러 상세 출력
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchMembers(); // 캘린더 목록을 불러옴
  }, []); // selectedCalendarsForMembers가 바뀔 때마다 실행

  const handleCheckboxChange = (calendarId) => {
    // 선택된 캘린더 목록에서 해당 캘린더를 추가하거나 제거
    // 하나의 캘린더만 선택할 수 있도록 처리
    if (selectedCalendarsForMembers.includes(calendarId)) {
      // 이미 선택된 경우 선택 해제
      dispatch({
        type: 'SET_SELECTED_CALENDARS',
        payload: [],
      });
    } else {
      // 새로운 캘린더 선택 시 다른 캘린더는 해제하고 해당 캘린더만 선택
      dispatch({
        type: 'SET_SELECTED_CALENDARS',
        payload: [calendarId],
      });
    }
  };

  return (
    <ListContainer>
      {loading ? (
        <p>공유 캘린더 데이터를 불러오는 중...</p> // 로딩 중 메시지
      ) : calendarList.length > 0 ? (
        <>
          {calendarList.map((calendar) => (
            <CheckboxLabel key={calendar.calendarId}>
              <CheckboxInput
                bgColor={calendar.calendarColor} // calendarColor로 색상 설정
                checked={selectedCalendarsForMembers.includes(calendar.calendarId)} // selectedCalendarsForMembers에 포함된 캘린더만 체크
                onChange={() => handleCheckboxChange(calendar.calendarId)} // 체크박스 상태 변경 시 호출
              />
              {calendar.calendarName}
            </CheckboxLabel>
          ))}
          {/* 선택된 캘린더가 없을 때 메시지 */}
          {/* {selectedCalendarsForMembers.length === 0 && <p>선택된 캘린더가 없습니다.</p>} */}
        </>
      ) : (
        <p>공유 캘린더가 없습니다.</p> // 캘린더 목록이 없을 때 표시
      )}
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
  padding: 5px;
  position: relative;
  padding: 5px 20px 5px 40px;
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
