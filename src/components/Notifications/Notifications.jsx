import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { BsCheckLg } from 'react-icons/bs';
import io from 'socket.io-client';
import axios from 'axios';
import NotificationItem from './NotificationItem';
import { fetchAlarmCount } from '../Layout/Aside/UserPanel/alarmUtils';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  const fetchUnreadNotifications = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return console.error('토큰이 없습니다. 다시 로그인하세요.');

    try {
      const { data } = await axios.get(
        'http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080/api/v1/alarms/unread',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.isSuccess && data.data) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('❌ 알림 불러오기 실패', error);
    }
  };

  const initSocket = (token) => {
    const socket = io('http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:9093', {
      query: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => console.log('✅ 알림 소켓 연결됨'));
    socket.on('disconnect', () => console.log('🔌 알림 소켓 해제됨'));
    socket.on('connect_error', (e) => console.error('❗ 소켓 오류:', e.message));

    socket.on('sendAlarm', (data) => {
      setNotifications((prev) => {
        const exists = prev.some((alarm) => alarm.alarmId === data.alarmId);
        return exists ? prev : [...prev, data];
      });
    });

    socketRef.current = socket;
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    fetchUnreadNotifications();
    initSocket(token);

    return () => {
      socketRef.current?.disconnect();
      console.log('🔌 알림 소켓 종료');
    };
  }, []);

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.put('http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080/api/v1/alarms/all', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);

      const count = await fetchAlarmCount();
      localStorage.setItem('alarmCount', count); // 임시 저장
      window.dispatchEvent(new Event('alarmCountUpdated')); // 이벤트 발생시켜서 ButtonGroup도 반응하도록
    } catch (error) {
      console.error('❌ 전체 읽음 처리 실패', error);
    }
  };

  const handleNotificationClick = async (id, alarmType) => {
    const accessToken = localStorage.getItem('access_token');
    try {
      await axios.put(
        `http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080/api/v1/alarms/${id}?alarmType=${alarmType}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setNotifications((prev) => prev.filter((alarm) => alarm.id !== id));

      const count = await fetchAlarmCount();
      localStorage.setItem('alarmCount', count); // 임시 저장
      window.dispatchEvent(new Event('alarmCountUpdated')); // 이벤트 발생시켜서 ButtonGroup도 반응하도록
    } catch (error) {
      console.error('❌ 알림 읽음 처리 실패', error);
    }
  };

  return (
    <NotificationsContainer>
      <NotificationsHeader>
        <h1>알림</h1>
        <button onClick={handleMarkAllAsRead}>
          <BsCheckLg />
          전체 확인
        </button>
      </NotificationsHeader>
      {notifications.length === 0 ? (
        <p>📭 새로운 알림이 없습니다.</p>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            alarmId={notification.id}
            {...notification}
            onClick={handleNotificationClick}
          />
        ))
      )}
    </NotificationsContainer>
  );
};

export default Notifications;

const NotificationsContainer = styled.div`
  padding: 20px;
`;

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
    cursor: pointer;
  }
`;
