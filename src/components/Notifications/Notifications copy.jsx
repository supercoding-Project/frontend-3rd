
// socket.io 방식으로 구현된 알림 리스트 (React)
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import NotificationItem from './NotificationItem';
import { BsCheckLg } from 'react-icons/bs';
import io from 'socket.io-client';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    console.log('Socket.IO 연결 중...');
    const token = localStorage.getItem('access_token');
    console.log(token);
    if (!token) {
      console.error('유효한 토큰이 없습니다. 다시 로그인해 주세요.');
      return;
    }

    const socket = io('http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:9093', {
      query: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ Socket.IO 연결 성공!');
    });

    socket.on('disconnect', () => {
      console.log('🔌 연결이 종료되었습니다.');
    });

    socket.on('sendAlarm', (data) => {
      console.log('📩 새로운 알림 수신:', data);
      setNotifications((prev) => [...prev, data]);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ 연결 오류 발생:', error.message);
    });

    socketRef.current = socket;

    return () => {
      if (socketRef.current) {
        console.log('🔌 소켓 연결 해제');
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <NotificationsContainer>
      <NotificationsHeader>
        <h1>알림</h1>
        <button>
          <BsCheckLg />
          전체 확인
        </button>
      </NotificationsHeader>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} {...notification} />
      ))}
    </NotificationsContainer>
  );
};

export default Notifications;

const NotificationsContainer = styled.div``;

const NotificationsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 20px;

  h1 {
    font-size: var(--font-xl);
    font-weight: bold;
    padding: 20px 0;
  }

  button {
    border: 1px solid var(--color-main-active);
    background-color: var(--color-bg-primary);
    color: var(--color-main-active);
    font-weight: bold;
    padding: 3px 10px;
    margin-right: 20px;
    border-radius: 5px;
  }
`;
