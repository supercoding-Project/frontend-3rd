import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import ChatRoomModal from './ChatRoomModal';
import { BsPersonFill } from 'react-icons/bs';
import ChatTest from './ChatTest';

//const SERVER_URL = 'http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080';

const ChatList = () => {
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('❌ 토큰이 없습니다. 다시 로그인하세요.');
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const baseUrl = apiUrl ? `${apiUrl}/api` : '/api';
      const response = await axios.get(`${baseUrl}/v1/chat/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 채팅방 목록 불러오기 성공 후 안읽은 메시지 개수와 최신 메시지 추가
      const roomsWithUnreadMessages = await Promise.all(
        response.data.data.map(async (room) => {
          const unreadResponse = await axios.get(`${baseUrl}/v1/chat/message/unread/${room.roomId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const lastMessageResponse = await axios.get(`${baseUrl}/v1/chat/message/load/${room.roomId}?pageNumber=0`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // 가장 최근 메시지 정보 추출
          const lastMessage =
            lastMessageResponse.data.isSuccess && lastMessageResponse.data.data.length > 0
              ? lastMessageResponse.data.data[0]
              : { message: '대화 내용 없음', senderName: '알 수 없음', createdAt: '' };

          return {
            ...room,
            unreadCount: unreadResponse.data.data || 0,
            lastMessage,
          };
        })
      );

      setRooms(roomsWithUnreadMessages);
    } catch (error) {
      console.error('❌ 채팅방 목록 불러오기 실패:', error);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('❌ 토큰이 없습니다. 다시 로그인하세요.');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const baseUrl = apiUrl ? `${apiUrl}/api` : '/api';
      await axios.delete(`${baseUrl}/v1/chat/room/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRooms((prevRooms) => prevRooms.filter((room) => room.roomId !== roomId));
      console.log(`✅ 채팅방 ${roomId} 삭제 완료!`);
    } catch (error) {
      console.error(`❌ 채팅방 ${roomId} 삭제 실패:`, error);
    }
  };

  return (
    <ChatListContainer>
      <Header>
        <h1>채팅 목록</h1>
        <AddButton onClick={() => setIsModalOpen(true)}>+ 추가</AddButton>
      </Header>
      <ChatRow>
        {rooms.length > 0 ? (
          <ul>
            {rooms.map((room) => {
              console.log('room 객체:', room); // 여기!
              return (
                <li key={room.roomId}>
                  <div className='rowTop'>
                    <div className='calendar' onClick={() => navigate(`/chat/${room.roomId}`)}>
                      <div className='name'>{room.roomName}</div>
                      <div className='member'>
                        <BsPersonFill />3
                      </div>
                    </div>
                    <div className='messageBadge'>{room.unreadCount}</div>
                  </div>
                  <div className='rowBottom'>
                    <div className='chatContents'>
                      <div className='chatUserName'>{room.lastMessage.senderName}</div>
                      <div className='chatMark'>:</div>
                      <div className='chatText'>{room.lastMessage.message}</div>
                    </div>
                    <div className='chatTime'>
                      {new Date(room.lastMessage.createdAt).toLocaleString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>채팅방 목록이 없습니다.</p>
        )}
      </ChatRow>
      {isModalOpen && <ChatRoomModal onClose={() => setIsModalOpen(false)} />}
      <ChatTest />
    </ChatListContainer>
  );
};

export default ChatList;

const ChatListContainer = styled.div`
  overflow: auto;
  h1 {
    padding: 15px 20px;
    font-weight: bold;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  border-bottom: 1px solid var(--color-border);
`;

const ChatRow = styled.div`
  cursor: pointer;
  li {
    padding: 10px 15px;
    position: relative;
    &::after {
      content: '';
      width: 7px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      /* background-color: ${(props) => props.$calendarColor || 'var(--color-calendar-1)'}; */
    }
    .rowTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .calendar {
        display: flex;
        align-items: center;
        .name {
          font-weight: bold;
          font-size: var(--font-lg);
        }
        .member {
          margin-left: 5px;
          display: flex;
          align-items: center;
          color: var(--color-text-disabled);
          font-size: var(--font-sm);
        }
      }
      .messageBadge {
        width: 22px;
        height: 22px;
        border-radius: 100px;
        background-color: var(--color-badge);
        color: var(--color-text-secondary);
        font-size: var(--font-sm);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .rowBottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 5px;
      .chatContents {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: var(--font-md);
      }
      .chatTime {
        font-size: var(--font-sm);
        color: var(--color-text-disabled);
      }
    }
  }
`;

const AddButton = styled.button`
  background-color: var(--color-main-active);
  color: #fff;
  padding: 5px 8px;
  border: none;
  border-radius: 4px;
  font-size: var(--font-sm);
  cursor: pointer;
  &:hover {
    background-color: var(--color-main-active-light);
    color: var(--color-main-active);
  }
`;

const DeleteButton = styled.button`
  margin-top: 8px;
  padding: 5px 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: darkred;
  }
`;
