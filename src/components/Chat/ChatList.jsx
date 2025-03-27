import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import ChatRoomModal from './ChatRoomModal';
import { BsPersonFill } from 'react-icons/bs';

const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080';

const ChatList = () => {
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('❌ 토큰이 없습니다. 다시 로그인하세요.');
        return;
      }
      try {
        const response = await axios.get(`${SERVER_URL}/api/v1/chat/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(response.data.data);
      } catch (error) {
        console.error('❌ 채팅방 목록 불러오기 실패:', error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <ChatListContainer>
      <Header>
        <h1>채팅 목록</h1>
        <AddButton onClick={() => setIsModalOpen(true)}>+ 추가</AddButton>
      </Header>
      <ChatRow>
        {rooms.length > 0 ? (
          <ul>
            {rooms.map((room) => (
              <li key={room.roomId} onClick={() => navigate(`/chat/${room.roomId}`)}>
                <div className='rowTop'>
                  <div className='calendar'>
                    <div className='name'>{room.roomName}</div>
                    <div className='member'>
                      <BsPersonFill />3
                    </div>
                  </div>
                  <div className='messageBadge'>12</div>
                </div>
                <div className='rowBottom'>
                  <div className='chatContents'>
                    <div className='chatUserName'>유저이름</div>
                    <div className='chatMark'>:</div>
                    <div className='chatText'>대화내용</div>
                  </div>
                  <div className='chatTime'>3월 26일</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>채팅방 목록이 없습니다.</p>
        )}
      </ChatRow>
      {isModalOpen && <ChatRoomModal onClose={() => setIsModalOpen(false)} />}
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
