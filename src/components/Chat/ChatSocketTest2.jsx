import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:9092';
const API_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/api/v1/mypage';

const ChatSocketTest = () => {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ JWT 토큰이 없습니다.');
      return;
    }

    // 1. 유저 ID 가져오기
    const fetchUserId = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        if (result.isSuccess && result.data) {
          setUserId(result.data.id);
        } else {
          console.error('❌ 유저 정보 가져오기 실패:', result.errorCode);
        }
      } catch (error) {
        console.error('❌ 유저 ID 조회 중 오류 발생:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem('token');
    const calendarId = localStorage.getItem('selectedCalendarId') || 1;
    setSelectedCalendarId(calendarId);

    // 2. 소켓 연결
    const newSocket = io(SERVER_URL, {
      query: { token },
      transports: ['websocket'],
    });

    setSocket(newSocket);

    // 3. 서버 응답 리스닝
    newSocket.on('connect', () => {
      console.log('✅ WebSocket 연결 성공!');
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ WebSocket 연결 실패:', error);
    });

    newSocket.on('createRoomResponse', (data) => {
      console.log('📩 채팅방 생성 응답:', data);
    });

    newSocket.on('joinRoomResponse', (data) => {
      console.log('📩 채팅방 입장 응답:', data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]); // 유저 ID가 설정된 후 소켓 연결

  // 4. 채팅방 생성 요청
  const createRoom = () => {
    if (!socket || !userId || !selectedCalendarId) {
      console.error('❌ 소켓, 유저 ID 또는 캘린더 ID가 없습니다.');
      return;
    }
    console.log('📤 채팅방 생성 요청 전송');
    socket.emit('createRoom', {
      name: `캘린더 ${selectedCalendarId} 채팅방`,
      calendarId: selectedCalendarId,
      userId: userId,
    });
  };

  // 5. 채팅방 입장 요청
  const joinRoom = () => {
    if (!socket || !userId || !selectedCalendarId) {
      console.error('❌ 소켓, 유저 ID 또는 캘린더 ID가 없습니다.');
      return;
    }
    console.log('📤 채팅방 입장 요청 전송');
    socket.emit('joinRoom', {
      userId: userId,
      roomId: selectedCalendarId, // 캘린더 ID를 채팅방 ID로 사용
    });
  };

  return (
    <div>
      <h2>WebSocket 테스트</h2>
      <button onClick={createRoom}>채팅방 생성</button>
      <button onClick={joinRoom}>채팅방 입장</button>
    </div>
  );
};

export default ChatSocketTest;
