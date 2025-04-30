import { useEffect } from 'react';
import io from 'socket.io-client';

const useAlarmSocket = (onAlarm) => {
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL2, {
      query: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => console.log('✅ 알림 소켓 연결됨'));
    socket.on('disconnect', () => console.log('❌ 알림 소켓 끊김'));
    socket.on('connect_error', (e) => console.error('❗연결 오류:', e.message));

    // 알림 수신
    socket.on('sendAlarm', (data) => {
      console.log('🔔 알림 수신:', data);
      if (onAlarm) onAlarm(data); // 받은 알림 데이터를 처리
    });

    // 정리 작업
    return () => {
      socket.disconnect();
      console.log('🔌 알림 소켓 종료');
    };
  }, [onAlarm]);

  return;
};

export default useAlarmSocket;
