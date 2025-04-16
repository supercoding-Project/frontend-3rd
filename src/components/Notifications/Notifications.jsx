import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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

    axios
      .get('http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080/api/v1/alarms/unread', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.isSuccess && res.data.data) {
          console.log('🗂️ 읽지 않은 알림:', res.data.data);
          setNotifications(res.data.data);
        } else {
          console.warn('🚫 알림 불러오기 실패', res.data.errorCode);
        }
      })
      .catch((err) => {
        console.error('📡 알림 불러오기 에러:', err);
      });

    const socket = io('http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:9093', {
      query: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ 알림 소켓 연결됨');
    });

    socket.on('disconnect', () => {
      console.log('🔌 소켓 연결 해제됨');
    });

    socket.on('connect_error', (e) => {
      console.error('❗ 소켓 연결 오류:', e.message);
    });

    socket.on('sendAlarm', (data) => {
      console.log('📩 실시간 알림 수신:', data);
      setNotifications((prev) => [...prev, data]);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      console.log('🔌 알림 소켓 종료');
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
