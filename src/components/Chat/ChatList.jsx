import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

// const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:9092';
const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080';

const ChatList = () => {
  const [rooms, setRooms] = useState([]);
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

  const handleRoomClick = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  return (
    <ChatListContainer>
      <h1>채팅 목록</h1>
      {rooms.length > 0 ? (
        <ul>
          {rooms.map((room) => (
            <li key={room.roomId} onClick={() => handleRoomClick(room.roomId)}>
              {room.roomName} - {room.joinedAt}
            </li>
          ))}
        </ul>
      ) : (
        <p>채팅방 목록이 없습니다.</p>
      )}
    </ChatListContainer>
  );
};

export default ChatList;

const ChatListContainer = styled.div`
  overflow: auto;
  h1 {
    border-bottom: 1px solid var(--color-border);
    padding: 15px 20px;
    font-weight: bold;
  }
`;
