import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NotificationItem from './NotificationItem';
import { BsCheckLg } from 'react-icons/bs';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

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

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'event_added',
      calendarName: '동아리',
      eventName: '전야제',
      location: '슈퍼 코인노래방',
      members: 7,
      eventTime: '2025-03-10T17:00:00',
    },
  ]);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/alarms');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: 'Bearer YOUR_TOKEN_HERE',
      },
      onConnect: (frame) => {
        console.log('WebSocket 연결됨:', frame);
        stompClient.subscribe('/user/queue/alarms', (message) => {
          const newNotification = JSON.parse(message.body);
          console.log('새 알림 수신:', newNotification);
          setNotifications((prev) => [newNotification, ...prev]);
        });
      },
      onStompError: (error) => {
        console.error('WebSocket 연결 실패:', error);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
      console.log('WebSocket 연결 종료');
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

      {/* <NotificationItem
        id={1}
        type='event_added'
        calendarName='동아리'
        eventName='전야제'
        location='슈퍼 코인노래방'
        members={7}
        eventTime='2025-03-10T17:00:00'
      />
      <NotificationItem
        id={2}
        type='event_mentioned'
        mentionedUser='김하진'
        calendarName='동아리'
        eventName='동아리 창립 기념일 MT'
        location='제부도, 아침해 뜨는 펜션'
        members={31}
        eventTime='2025-03-10T14:00:00'
      />
      <NotificationItem
        id={3}
        type='event_deleted'
        calendarName='회사'
        eventName='2025 춘계 워크샵'
        location='회사 1층 카페 > 부산 해운대'
        members={45}
        eventTime='2025-03-10T12:30:00'
      />
      <NotificationItem
        id={4}
        type='event_updated'
        calendarName='회사'
        eventName='점심회식'
        date='2025-03-10'
        time='11:30'
        location='맛있는 뼈해장국'
        members={8}
        eventTime='2025-03-10T11:00:00'
      />

      <NotificationItem id={5} type='member_added' calendarName='회사' eventTime='2025-03-08T11:00:00' />

      <NotificationItem
        id={6}
        type='event_started'
        calendarName='개인'
        eventName='미용실 예약'
        date='2025-03-03'
        time='14:00'
        location='슈퍼매직 미용실'
        members={5}
        eventTime='2025-03-03T14:00:00'
      /> */}
    </NotificationsContainer>
  );
};

export default Notifications;
