import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const SERVER_URL = 'http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080';

const ChatRoomModal = ({ onClose }) => {
  const [calendars, setCalendars] = useState([]);
  const [existingRooms, setExistingRooms] = useState([]);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/v1/calendars`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.isSuccess) {
          setCalendars(response.data.data.filter((c) => c.calendarType === 'SHARED'));
        }
      } catch (error) {
        console.error('캘린더 목록 불러오기 실패:', error);
      }
    };
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/v1/chat/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.isSuccess) {
          setExistingRooms(response.data.data.map((r) => r.calendarId));
        }
      } catch (error) {
        console.error('채팅방 목록 불러오기 실패:', error);
      }
    };
    fetchCalendars();
    fetchChatRooms();
  }, []);

  const handleCreateOrJoin = async (calendarId, isOwner) => {
    try {
      if (isOwner) {
        await axios.post(
          `${SERVER_URL}/api/v1/chat/room/create/${calendarId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        const inviteCode = prompt('초대 코드를 입력하세요');
        if (!inviteCode) return;
        await axios.post(
          `${SERVER_URL}/api/v1/chat/room/join`,
          { inviteCode },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      onClose();
    } catch (error) {
      console.error('채팅방 생성/참여 실패:', error);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>채팅방 추가</h2>
        <ul>
          {calendars.length > 0 ? (
            calendars.map((calendar) => (
              <li key={calendar.calendarId}>
                <div
                  className='addChatList'
                  onClick={() => handleCreateOrJoin(calendar.calendarId, !existingRooms.includes(calendar.calendarId))}
                  disabled={existingRooms.includes(calendar.calendarId)}
                  style={{
                    fontWeight: existingRooms.includes(calendar.calendarId) ? 'normal' : 'bold',
                    color: existingRooms.includes(calendar.calendarId) ? '#999' : '#000',
                  }}
                >
                  {calendar.calendarName}
                </div>
              </li>
            ))
          ) : (
            <p>채팅방을 생성할 수 있는 공유 캘린더가 없습니다.</p>
          )}
        </ul>
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ChatRoomModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  h2 {
    font-weight: bold;
    width: 100%;
    padding: 5px 10px;
    border-bottom: 1px solid var(--color-border);
    font-size: var(--font-lg);
    margin-bottom: 20px;
  }
  .addChatList {
    font-size: var(--font-md);
    padding: 3px;
    cursor: pointer;
  }
`;

const CloseButton = styled.button`
  margin-top: 10px;
  padding: 8px 12px;
  border: none;
  background: #ff4d4d;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #cc0000;
  }
`;
