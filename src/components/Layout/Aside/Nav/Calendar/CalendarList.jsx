import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { useCalendar } from '../../../../../context/CalendarContext';
import { AuthContext } from '../../../../../context/AuthContext'; // 🔹 추가
import axios from 'axios';
import { FaCheck } from 'react-icons/fa';

const apiUrl = import.meta.env.VITE_API_URL;
const baseUrl = apiUrl ? `${apiUrl}/api` : '/api';

const CalendarList = () => {
  const { selectedCalendar, calendarList, dispatch } = useCalendar();
  const { isAuthenticated } = useContext(AuthContext); // 🔹 로그인 여부
  const [chatRooms, setChatRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calendarToDelete, setCalendarToDelete] = useState(null);
  const [roomIdToDelete, setRoomIdToDelete] = useState(null);
  const [loading, setLoading] = useState(false); // 🔹 로딩 상태

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    const fetchData = async () => {
      try {
        // 캘린더 목록
        const calendarResponse = await axios.get(`${baseUrl}/v1/calendars`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        dispatch({ type: 'SET_CALENDAR_LIST', payload: calendarResponse.data.data });

        // 채팅방 목록
        const chatResponse = await axios.get(`${baseUrl}/v1/chat/rooms`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setChatRooms(chatResponse.data.data);
      } catch (err) {
        console.error('캘린더 또는 채팅방 목록 요청 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, isAuthenticated]);

  const handleCheckboxChange = (calendarId) => {
    const updated = selectedCalendar.includes(calendarId)
      ? selectedCalendar.filter((id) => id !== calendarId)
      : [...selectedCalendar, calendarId];
    dispatch({ type: 'SET_SELECTED_CALENDAR', payload: updated });
  };

  const openDeleteModal = (calendarId, calendarName) => {
    const matchingRoom = chatRooms.find((room) => room.calendarId === calendarId);
    const roomId = matchingRoom ? matchingRoom.roomId : null;

    setCalendarToDelete({ id: calendarId, name: calendarName });
    setRoomIdToDelete(roomId);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!calendarToDelete) return;

    try {
      if (roomIdToDelete) {
        await axios.delete(`${baseUrl}/v1/chat/room/${roomIdToDelete}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
      }

      const calendarDeleteResponse = await axios.delete(`${baseUrl}/v1/calendar/${calendarToDelete.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });

      if (calendarDeleteResponse.data.isSuccess) {
        dispatch({
          type: 'SET_CALENDAR_LIST',
          payload: calendarList.filter((calendar) => calendar.calendarId !== calendarToDelete.id),
        });
      } else {
        console.error('캘린더 삭제 실패:', calendarDeleteResponse.data.errorCode);
      }
    } catch (error) {
      console.error('삭제 요청 에러:', error);
    }

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (!isAuthenticated) {
    return <CalendarLoading>로그인 후에 사용해주세요.</CalendarLoading>;
  }

  if (loading) {
    return <CalendarLoading>캘린더 데이터를 불러오는 중...</CalendarLoading>;
  }

  if (calendarList.length === 0) {
    return <CalendarLoading>캘린더가 없습니다.</CalendarLoading>;
  }

  return (
    <div>
      <ListContainer>
        {calendarList.map((calendar) => (
          <CheckboxLabel key={calendar.calendarId}>
            <div className='calendar'>
              <CheckboxInput
                checked={selectedCalendar.includes(calendar.calendarId)}
                onChange={() => handleCheckboxChange(calendar.calendarId)}
                style={{ backgroundColor: calendar.calendarColor }}
                id={`checkbox-${calendar.calendarId}`}
              />
              <CheckboxStyle bgColor={calendar.calendarColor}>
                {selectedCalendar.includes(calendar.calendarId) && (
                  <CheckStyle>
                    <FaCheck />
                  </CheckStyle>
                )}
              </CheckboxStyle>
              <div className='calendarName'>{calendar.calendarName}</div>
            </div>
            <div className='Delete' onClick={() => openDeleteModal(calendar.calendarId, calendar.calendarName)}>
              X
            </div>
          </CheckboxLabel>
        ))}
      </ListContainer>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <ModalNotification>
              {calendarToDelete && `${calendarToDelete.name} 캘린더를 삭제하시겠습니까?`}
            </ModalNotification>
            <ModalButtons>
              <ModalButtonCancel onClick={handleCancel}>취소</ModalButtonCancel>
              <ModalButtonConfirm onClick={handleDelete}>확인</ModalButtonConfirm>
            </ModalButtons>
          </ModalContainer>
        </ModalOverlay>
      )}
    </div>
  );
};

export default CalendarList;

// 💅 styled-components 정의는 기존과 동일하므로 생략 없이 그대로 유지

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 30px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 20px 5px 60px;
  justify-content: space-between;
  .calendar {
    display: flex;
    align-items: center;
  }
  .Delete {
    color: var(--color-text-secondary);
    cursor: pointer;
  }
  &:hover {
    background-color: #eee;
    .Delete {
      color: var(--color-text-disabled);
    }
  }
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
  margin-right: 10px;
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

// 모달 오버레이
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// 모달 컨테이너
const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalNotification = styled.p`
  font-size: 15px;
`;

// 모달 버튼들
const ModalButtons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 25px;
`;

// 취소 버튼
const ModalButtonCancel = styled.button`
  font-size: 14px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-disabled);
  padding: 6px 16px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: var(--color-bg-hover);
  }
`;

// 확인 버튼
const ModalButtonConfirm = styled.button`
  font-size: 14px;
  background-color: var(--color-main-active);
  color: #fff;
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: var(--color-main-active-hover);
  }
`;

const CalendarLoading = styled.p`
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
