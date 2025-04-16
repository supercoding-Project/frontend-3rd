import React, { useState } from 'react';
import NotificationItem from './NotificationItem';
import useAlarmSocket from './AlarmSocket';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  useAlarmSocket((data) => {
    setNotifications((prev) => [...prev, data]);
  });

  return (
    <div>
      {notifications.map((n) => (
        <NotificationItem key={n.id} {...n} />
      ))}
    </div>
  );
};

export default Notifications;
