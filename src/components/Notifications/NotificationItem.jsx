import React from 'react';
import styled from 'styled-components';
import {
  BsCalendarCheck,
  BsCalendarPlus,
  BsCalendarX,
  BsPersonPlus,
  BsMegaphone,
  BsFillCalendar2WeekFill,
  BsFillPersonFill,
  BsGeoAltFill,
} from 'react-icons/bs';

const iconMap = {
  event_added: <BsCalendarPlus />,
  event_mentioned: <BsCalendarPlus />,
  event_deleted: <BsCalendarX />,
  event_updated: <BsCalendarCheck />,
  member_added: <BsPersonPlus />,
  member_invited: <BsPersonPlus />,
  event_started: <BsMegaphone />,
};

const formatRelativeTime = (notificationTime) => {
  const now = new Date();
  const notificationDate = new Date(notificationTime);
  const diff = Math.floor((now - notificationDate) / 1000); // 초 단위 차이

  if (diff < 60) return '방금 전'; // 1분 미만
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`; // 1시간 미만
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`; // 24시간 미만

  // 24시간 이상 -> "MM월 DD일" 형식
  const month = notificationDate.getMonth() + 1;
  const day = notificationDate.getDate();
  return `${month.toString().padStart(2, '0')}월 ${day.toString().padStart(2, '0')}일`;
};

const NotificationItem = ({ type, eventName, location, members, mentionedUser, calendarName, eventTime, read }) => {
  const messageMap = {
    event_added: (
      <>
        <span className='highlight'>{calendarName}</span> 캘린더에 <span className='highlight'>{eventName}</span> 일정이
        <span className='highlight'> 추가</span>
        되었습니다.
      </>
    ),
    event_mentioned: (
      <>
        <span className='highlight'>{calendarName}</span> 캘린더에 <span className='highlight'>{mentionedUser}</span>{' '}
        님을 언급한 <span className='highlight'>{eventName}</span> 일정이 <span className='highlight'>추가</span>
        되었습니다.
      </>
    ),
    event_deleted: (
      <>
        <span className='highlight'>{calendarName}</span> 캘린더에 <span className='highlight'>{eventName}</span> 일정이{' '}
        <span className='highlight'>삭제</span>
        되었습니다.
      </>
    ),
    event_updated: (
      <>
        <span className='highlight'>{calendarName}</span> 캘린더에 <span className='highlight'>{eventName}</span> 일정이{' '}
        <span className='highlight'>수정</span>
        되었습니다.
      </>
    ),
    member_added: (
      <>
        <span className='highlight'>{calendarName}</span> 캘린더에 새로운 멤버가 <span className='highlight'>추가</span>
        되었습니다.
      </>
    ),
    member_invited: (
      <>
        <span className='highlight'>{calendarName}</span> 캘린더에 <span className='highlight'>초대</span>
        되었습니다.
      </>
    ),
    event_started: (
      <>
        <span className='highlight'>{calendarName}</span> 캘린더에 <span className='highlight'>{eventName}</span> 일정이
        곧 <span className='highlight'>시작</span>
        합니다.
      </>
    ),
  };

  const eventDate = new Date(eventTime);
  const formattedDate = eventDate.toISOString().split('T')[0]; // YYYY-MM-DD
  const formattedTime = eventDate.toTimeString().split(' ')[0].slice(0, 5); // HH:MM

  return (
    <Notification read={read}>
      <NotificationIcon>{iconMap[type]}</NotificationIcon>
      <NotificationInner>
        <NotificationTitle>{messageMap[type]}</NotificationTitle>
        {type !== 'member_added' && type !== 'personal_event_started' && (
          <NotificationDetails>
            {/* <div className='row'>
              <span className='highlight'>{eventName}</span>
            </div> */}
            <div className='row'>
              <span>
                <BsFillCalendar2WeekFill />
                &nbsp;
                {formattedDate} {formattedTime}
              </span>
              <span>
                <BsGeoAltFill /> {location}
              </span>

              <span>
                <BsFillPersonFill /> {members}
              </span>
            </div>
          </NotificationDetails>
        )}
        <NotificationTime>{formatRelativeTime(eventTime)}</NotificationTime>
      </NotificationInner>
    </Notification>
  );
};

export default NotificationItem;

const Notification = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 10px;
  border-bottom: 1px solid var(--color-border);
  position: relative;
  background-color: ${({ read }) => (read ? 'transparent' : '#f9f9f9')};
`;

const NotificationIcon = styled.div`
  margin-right: 10px;
  background-color: var(--color-main-active-light);
  width: 50px;
  height: 50px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    color: var(--color-main-active);
    font-size: var(--font-xl);
  }
`;

const NotificationInner = styled.div`
  flex-grow: 1;
`;

const NotificationTitle = styled.div`
  font-size: var(--font-lg);
  .highlight {
    font-weight: bold;
  }
`;

const NotificationDetails = styled.div`
  font-size: var(--font-md);
  color: var(--color-text-disabled);
  margin-top: 10px;
  .row {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 7px;
    span {
      display: flex;
      align-items: center;
      svg {
        margin-right: 3px;
      }
    }
    .highlight {
      font-weight: bold;
    }
  }
`;

const NotificationTime = styled.div`
  position: absolute;
  right: 30px;
  top: 20px;
  font-size: var(--font-md);
  color: var(--color-text-disabled);
`;
