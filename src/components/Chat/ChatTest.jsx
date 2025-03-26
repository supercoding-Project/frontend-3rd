import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const ChatTest = () => {
  const socketRef = useRef(null); // 🔹 소켓을 한 번만 연결하도록 관리

  useEffect(() => {
    const token = localStorage.getItem('token'); // 저장된 토큰 불러오기
    if (!token) {
      console.error('❌ JWT 토큰이 없습니다.');
      return;
    }

    // 🔹 이미 연결된 소켓이 있으면 새로 연결하지 않음
    if (socketRef.current) {
      console.log('🔄 기존 소켓 연결 유지');
      return;
    }

    socketRef.current = io('ws://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:9092', {
      transports: ['websocket'], // polling을 사용하지 않고 websocket만 사용
      auth: { token },
    });

    socketRef.current.on('connect', () => {
      console.log('✅ 소켓 연결 성공!', socketRef.current.id);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('❌ 소켓 연결 실패:', err);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        console.log('🔌 소켓 연결 종료');
      }
    };
  }, []);

  return <div>채팅 테스트 중...</div>;
};

export default ChatTest;
