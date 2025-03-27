import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import NotificationItem from './NotificationItem';
import { BsCheckLg } from 'react-icons/bs';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// WebSocket 연결을 위한 설정
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const stompClientRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // WebSocket 연결
  useEffect(() => {
    console.log('🚀 WebSocket 연결 시도...');
    const token = localStorage.getItem('access_token');
    console.log('토큰:', token);
    if (!token) {
      console.error('❌ 토큰이 없습니다. 다시 로그인하세요.');
      return;
    }

    const connectWebSocket = () => {
      if (stompClientRef.current) {
        console.log('⏳ 이미 WebSocket이 연결 중입니다. 중복 연결 방지');
        return;
      }

      console.log('🔄 WebSocket 연결 중...');

      const socket = new SockJS('http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/alarms'); // 서버 주소
      const stompClient = new Client({
        webSocketFactory: () => {
          console.log('🟢 웹소켓 팩토리 실행됨!');
          return socket; // 기존 SockJS 인스턴스를 사용
        },
        connectHeaders: {
          Authorization: `Bearer ${token}`, // JWT 토큰 헤더에 추가
        },
        debug: (str) => console.log('🟡 STOMP 디버그:', str),
        onConnect: (frame) => {
          console.log('✅ STOMP 연결 성공!', frame);
          console.log('🟢 웹소켓 연결 성공!'); // 연결 성공 메시지 출력 추가
          stompClient.subscribe('/user/queue/alarms', (message) => {
            const alarmDto = JSON.parse(message.body);
            console.log('🔔 새 알림 수신:', alarmDto);
            setNotifications((prevNotifications) => [...prevNotifications, alarmDto]); // 알림이 수신될 때마다 상태 업데이트
          });
        },
        onStompError: (error) => {
          console.error('❌ STOMP 오류 발생:', error);
        },
        onWebSocketClose: () => {
          console.log('🚨 웹소켓 연결 끊김');
        },
      });

      stompClient.activate(); // STOMP 클라이언트 활성화
      stompClientRef.current = stompClient;
    };

    connectWebSocket();

    return () => {
      if (stompClientRef.current) {
        console.log('🛑 WebSocket 연결 해제됨');
        stompClientRef.current.deactivate(); // 연결 해제
        stompClientRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current); // 재연결 타이머 클리어
        reconnectTimeoutRef.current = null;
      }
    };
  }, []); // 처음 마운트될 때만 실행

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
