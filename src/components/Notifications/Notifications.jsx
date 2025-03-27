import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import styled from 'styled-components';
import NotificationItem from './NotificationItem';
import { BsCheckLg } from 'react-icons/bs';

const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('❌ 토큰이 없습니다. 다시 로그인하세요.');
        return;
      } else {
        console.log('토큰 확인', token);
      }

      // WebSocket 연결 설정 (wss:// 사용)
      const ws = new WebSocket(`wss://${SERVER_URL.replace('http', 'ws')}/alarms`);

      // WebSocket 연결 시도
      ws.onopen = () => {
        console.log('✅ WebSocket 연결 성공!');
        // 서버로 JWT 토큰을 전송
        ws.send(JSON.stringify({ type: 'AUTH', token }));
      };

      ws.onmessage = (message) => {
        console.log('🔔 새 알림 수신:', message.data);
        const alarmDto = JSON.parse(message.data);
        setNotifications((prevNotifications) => [...prevNotifications, alarmDto]);
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket 오류:', error);
        if (error instanceof ErrorEvent) {
          console.log('Error message:', error.message);
        }
      };

      ws.onclose = () => {
        console.log('🚨 WebSocket 연결 끊김');
      };

      socketRef.current = ws;

      return () => {
        if (ws) {
          ws.close();
        }
      };
    };

    fetchData();
  }, []);

  return (
    <NotificationsContainer>
      <NotificationsHeader>
        <h1>알림</h1>
        <button>전체 확인</button>
      </NotificationsHeader>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationItem key={notification.id}>{notification.message}</NotificationItem>
        ))
      ) : (
        <p>새로운 알림이 없습니다.</p>
      )}
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
