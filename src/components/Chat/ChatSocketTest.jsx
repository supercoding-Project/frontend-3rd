import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import MessageTest from './MessageTest';

const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:9092';

const ChatSocketTest = () => {
  const [socket, setSocket] = useState(null);
  const userId = 1; // 🔥 하드코딩된 유저 ID
  const selectedCalendarId = 8; // 🔥 하드코딩된 캘린더 ID

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ JWT 토큰이 없습니다.');
      return;
    }

    // 1. 소켓 연결
    const newSocket = io(SERVER_URL, {
      query: { token },
      transports: ['websocket'],
    });

    setSocket(newSocket);

    // 2. 서버 응답 리스닝
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
  }, []); // 이 부분은 컴포넌트가 마운트될 때만 실행됩니다.

  // 3. 채팅방 생성 요청
  const createRoom = () => {
    if (!socket) {
      console.error('❌ 소켓이 없습니다.');
      return;
    }
    console.log('📤 채팅방 생성 요청 전송');
    socket.emit('createRoom', {
      name: `캘린더 ${selectedCalendarId} 채팅방`,
      calendarId: selectedCalendarId,
      userId: userId,
    });
  };

  // 4. 채팅방 입장 요청
  const joinRoom = () => {
    if (!socket) {
      console.error('❌ 소켓이 없습니다.');
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
      <h2>WebSocket 테스트 (하드코딩 버전)</h2>
      <button onClick={createRoom}>채팅방 생성</button>
      <button onClick={joinRoom}>채팅방 입장</button>
      {/* socket이 준비되었을 때만 MessageTest 렌더링 */}
      {socket && <MessageTest socket={socket} />}
    </div>
  );
};

export default ChatSocketTest;
