import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { BsMegaphone, BsGeoAltFill } from 'react-icons/bs';
import 'react-toastify/dist/ReactToastify.css';

const scheduledEvents = [
  {
    id: 'U1-S20250201123045',
    type: 'event',
    calendarId: 'Group-Club1',
    eventName: '동아리 개강 모임',
    eventTime: '2025-03-01T12:00:00',
    isAllDay: false,
    repeat: false,
    location: '카페 베네',
    members: ['U1', 'U3'],
    forceShow: true,
  },
];

const ToastContainerStyled = styled(ToastContainer)`
  .Toastify__toast {
    display: block !important;
  }
  .Toastify__progress-bar {
    background: var(--color-main-inactive);
  }
  .Toastify__progress-bar--bg {
    background: var(--color-main-inactive);
  }
`;

const ToastWrapper = styled.div`
  font-family:
    -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Pretendard Variable', Pretendard, Roboto, 'Noto Sans KR',
    'Segoe UI', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;

  .toastTitle {
    text-align: center;
    margin: auto;
    color: var(--color-text-disabled);
    font-size: var(--font-sm);
    margin: 10px 0 0px;
  }

  .toastInner {
    display: flex;
    align-items: center;
    gap: 10px;
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border-radius: 100px;
      background-color: var(--color-main-active);
      color: var(--color-text-secondary);
      svg {
        font-size: var(--font-xl);
        transform: translate(-1px, -1px);
      }
    }
    .eventDetails {
      .eventName {
        color: var(--color-main-active);

        font-size: var(--font-md);

        font-weight: bold;
        line-height: 1.3;
      }
      .eventLocation {
        color: var(--color-text-disabled);

        font-size: var(--font-sm);
        margin: 3px 0;
        display: flex;
        align-items: center;
        svg {
          margin-right: 3px;
        }
      }
    }
  }
`;

const ToastMessage = ({ event }) => (
  <ToastWrapper>
    <div className='toastInner'>
      <div className='icon'>
        <BsMegaphone />
      </div>
      <div className='eventDetails'>
        <div className='eventName'>{event.eventName}</div>
        <div className='eventLocation'>
          <BsGeoAltFill />
          {event.location}
        </div>
      </div>
    </div>
    <div className='toastTitle'>일정이 곧 시작됩니다.</div>
  </ToastWrapper>
);

const Toast = () => {
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();

      scheduledEvents.forEach((event) => {
        const eventTime = new Date(event.eventTime);
        const timeDiff = eventTime - now;

        if (event.forceShow || (timeDiff > 0 && timeDiff <= 5 * 60 * 1000)) {
          toast.info(<ToastMessage event={event} />, {
            position: 'bottom-right',
            autoClose: 5000,
            // autoClose: event.forceShow ? false : 5000,
            icon: false,
          });
        }
      });
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 30 * 1000);

    return () => clearInterval(interval);
  }, []);

  return <ToastContainerStyled />;
};

export default Toast;
