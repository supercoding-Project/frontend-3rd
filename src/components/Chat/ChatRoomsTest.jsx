import { useEffect, useState } from 'react';
import axios from 'axios';

const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:9092';

const FetchChatRoomsTest = () => {
  const [rooms, setRooms] = useState(null);
  const userId = 1; // 🔥 하드코딩된 유저 ID

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ JWT 토큰이 없습니다.');
      return;
    }

    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/v1/chat/rooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId: userId,
          },
        });

        console.log('✅ 채팅방 목록:', response.data);
        setRooms(response.data);
      } catch (error) {
        console.error('❌ 채팅방 목록 불러오기 실패:', error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div>
      <h2>채팅방 목록 테스트</h2>
      {rooms ? (
        <ul>
          {rooms.map((room) => (
            <li key={room.id}>{room.name}</li>
          ))}
        </ul>
      ) : (
        <p>채팅방 정보를 불러오는 중...</p>
      )}
    </div>
  );
};

export default FetchChatRoomsTest;
