import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCalendar } from '../../../../../context/CalendarContext';
import axios from 'axios';

const CalendarList = () => {
  const { selectedCalendar, calendarList, dispatch } = useCalendar(); // 🔹 chatRooms 제거
  const [chatRooms, setChatRooms] = useState([]); // 🔹 채팅방 데이터를 상태로 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calendarToDelete, setCalendarToDelete] = useState(null);
  const [roomIdToDelete, setRoomIdToDelete] = useState(null);

  useEffect(() => {
    // 캘린더 목록 가져오기
    axios
      .get('http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080/api/v1/calendars', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((calendarResponse) => {
        console.log('캘린더 리스트 응답 데이터:', calendarResponse.data.data);
        dispatch({ type: 'SET_CALENDAR_LIST', payload: calendarResponse.data.data });
      })
      .catch((calendarError) => {
        console.error('캘린더 목록 요청 에러:', calendarError);
      });

    // 채팅방 목록 가져오기
    axios
      .get('http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080/api/v1/chat/rooms', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((chatResponse) => {
        console.log('채팅방 리스트 응답 데이터:', chatResponse.data.data);
        setChatRooms(chatResponse.data.data); // ✅ 상태 업데이트
      })
      .catch((chatError) => {
        console.error('채팅방 목록 요청 에러:', chatError);
      });
  }, [dispatch]);

  const handleCheckboxChange = (calendarId) => {
    const updated = selectedCalendar.includes(calendarId)
      ? selectedCalendar.filter((id) => id !== calendarId)
      : [...selectedCalendar, calendarId];

    dispatch({ type: 'SET_SELECTED_CALENDAR', payload: updated });
  };

  // 🔹 삭제 모달 열기 (calendarId를 이용해서 roomId 찾기)
  const openDeleteModal = (calendarId, calendarName) => {
    console.log('calendarId:', calendarId);
    console.log('calendarName:', calendarName);

    if (!chatRooms.length) {
      console.error('chatRooms가 아직 로드되지 않음.');
      return;
    }

    console.log('chatRooms', chatRooms);
    const matchingRoom = chatRooms.find((room) => room.calendarId === calendarId);
    const roomId = matchingRoom ? matchingRoom.roomId : null;

    console.log('찾은 roomId:', roomId);

    setCalendarToDelete({ id: calendarId, name: calendarName });
    setRoomIdToDelete(roomId);
    setIsModalOpen(true);
  };

  // 🔹 캘린더 및 채팅방 삭제 처리
  const handleDelete = async () => {
    if (!calendarToDelete) return;

    console.log('삭제할 캘린더:', calendarToDelete);

    try {
      // 1️⃣ 채팅방 먼저 삭제
      if (roomIdToDelete) {
        console.log('삭제할 채팅방 ID:', roomIdToDelete);

        await axios.delete(
          `http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080/api/v1/chat/room/${roomIdToDelete}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
          }
        );

        console.log(`채팅방 ${roomIdToDelete} 삭제 성공`);
      }

      // 2️⃣ 채팅방 삭제 후, 캘린더 삭제 요청
      const calendarDeleteResponse = await axios.delete(
        `http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080/api/v1/calendar/${calendarToDelete.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        }
      );

      console.log('캘린더 삭제 응답:', calendarDeleteResponse);

      if (calendarDeleteResponse.data.isSuccess) {
        dispatch({
          type: 'SET_CALENDAR_LIST',
          payload: calendarList.filter((calendar) => calendar.calendarId !== calendarToDelete.id),
        });
        console.log(`${calendarToDelete.name} 캘린더 삭제 성공`);
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

  return (
    <div>
      <ListContainer>
        {calendarList.length > 0 ? (
          calendarList.map((calendar) => (
            <CheckboxLabel key={calendar.calendarId}>
              <div className='calendar'>
                <CheckboxInput
                  $bgColor={calendar.calendarColor}
                  checked={selectedCalendar.includes(calendar.calendarId)}
                  onChange={() => handleCheckboxChange(calendar.calendarId)}
                  style={{ backgroundColor: calendar.calendarColor }}
                />
                <div className='calendarName'>{calendar.calendarName}</div>
              </div>
              <div
                className='Delete'
                onClick={() => {
                  openDeleteModal(calendar.calendarId, calendar.calendarName);
                }}
              >
                X
              </div>
            </CheckboxLabel>
          ))
        ) : (
          <p>캘린더를 생성해주세요.</p>
        )}
      </ListContainer>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <p>{calendarToDelete && `${calendarToDelete.name} 캘린더를 삭제하시겠습니까?`}</p>
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

// 모달 버튼들
const ModalButtons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

// 취소 버튼
const ModalButtonCancel = styled.button`
  background-color: var(--color-bg-primary);
  color: var(--color-text-disabled);
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: var(--color-bg-hover);
  }
`;

// 확인 버튼
const ModalButtonConfirm = styled.button`
  background-color: var(--color-main-active);
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: var(--color-main-active-hover);
  }
`;
