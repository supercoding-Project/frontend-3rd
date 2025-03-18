import { useEffect } from 'react';
import { io } from 'socket.io-client';

const ChatTest = () => {
  useEffect(() => {
    const token = 'JWT_토큰';

    const socket = io('http://localhost:9092', {
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('✅ 소켓 연결 성공!', socket.id);

      // 방 생성 테스트
      socket.emit('createRoom', {
        name: 'test',
        calendarId: 1,
        userId: '1',
      });
    });

    socket.on('connect_error', (err) => {
      console.error('❌ 소켓 연결 실패:', err);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>채팅 테스트 중...</div>;
};

export default ChatTest;
