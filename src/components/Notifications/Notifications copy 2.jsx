// 하드코딩 버전

import React, { useState } from 'react';
import styled from 'styled-components';
import NotificationItem from './NotificationItem';
import { BsCheckLg } from 'react-icons/bs';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'event_added',
      calendarName: '동아리',
      eventName: '전야제',
      location: '슈퍼 코인노래방',
      members: 7,
      eventTime: '2025-03-28T15:55:50',
      read: false,
    },
    {
      id: 2,
      type: 'event_mentioned',
      mentionedUser: '김하진',
      calendarName: '동아리',
      eventName: '동아리 창립 기념일 MT',
      location: '제부도, 아침해 뜨는 펜션',
      members: 31,
      eventTime: '2025-03-28T14:00:00',
      read: false,
    },
    {
      id: 3,
      type: 'event_deleted',
      calendarName: '회사',
      eventName: '2025 춘계 워크샵',
      location: '회사 1층 카페 > 부산 해운대',
      members: 45,
      eventTime: '2025-03-28T12:30:00',
      read: true,
    },
    {
      id: 4,
      type: 'event_updated',
      calendarName: '회사',
      eventName: '점심회식',
      date: '2025-03-10',
      time: '11:30',
      location: '맛있는 뼈해장국',
      members: 8,
      eventTime: '2025-03-27T12:00:00',
      read: true,
    },
    {
      id: 5,
      type: 'member_added',
      calendarName: '회사',
      eventTime: '2025-03-27T11:00:00',
      read: true,
    },
    {
      id: 6,
      type: 'event_started',
      calendarName: '개인',
      eventName: '미용실 예약',
      date: '2025-03-03',
      time: '14:00',
      location: '슈퍼매직 미용실',
      members: 5,
      eventTime: '2025-03-26T14:00:00',
      read: true,
    },
  ]);
  const allCheckBtn = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((noti) => (noti.read ? noti : { ...noti, read: true }))
    );
  };

  return (
    <NotificationsContainer>
      <NotificationsHeader>
        <h1>알림</h1>
        <button onClick={allCheckBtn}>
          <BsCheckLg />
          전체 확인
        </button>
      </NotificationsHeader>
      {notifications.map((noti) => (
        <NotificationItem key={noti.id} {...noti} />
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
    display: flex;
    align-items: center;
    border: 1px solid var(--color-main-active);
    background-color: var(--color-bg-primary);
    color: var(--color-main-active);
    font-weight: bold;
    font-size: var(--font-md);
    padding: 5px 7px;
    margin-right: 20px;
    border-radius: 5px;
    cursor: pointer;
    svg {
      margin-right: 3px;
    }
  }
`;
