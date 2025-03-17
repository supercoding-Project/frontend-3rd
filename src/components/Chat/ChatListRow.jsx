import React from 'react';
import styled from 'styled-components';
import userProfileImg from '/Basic-User-Img.png';
import { BsFillCalendar2WeekFill } from 'react-icons/bs';

const ChatLow = styled.div`
  position: relative;
  padding: 15px 10px 15px 20px;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;

  .schedule {
    &::after {
      content: '';
      width: 7px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: ${(props) => props.$calendarColor || 'var(--color-calendar-1)'};
    }
    display: flex;
    align-items: center;
    .scheduleUser {
      position: relative;
      img {
        width: 50px;
        height: 50px;
      }
      .scheduleUser-badge {
        position: absolute;
        width: 30px;
        height: 30px;
        top: 30px;
        left: 30px;
        border-radius: 100px;
        border: 3px solid #fff;
        background-color: var(--color-bg-primary);
        color: var(--color-text-disabled);
        font-size: var(--font-sm);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .scheduleDetiles {
      margin-left: 15px;

      .scheduleTitle {
        font-weight: bold;
        font-size: var(--font-lg);
      }
      .scheduleTime {
        color: var(--color-text-disabled);
        font-size: var(--font-md);
        display: flex;
        align-items: center;
        gap: 5px;
        margin-top: 5px;
      }
    }
  }
  .chat {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin-top: 15px;
    .chatContents {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: var(--font-lg);
    }
    .chat-time {
      font-size: var(--font-md);
      color: var(--color-text-disabled);
    }
    .chat-badge {
      position: absolute;
      width: 25px;
      height: 25px;
      top: -55px;
      right: 10px;
      border-radius: 100px;
      background-color: var(--color-badge);
      color: var(--color-text-secondary);
      font-size: var(--font-sm);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const ChatListRow = ({
  eventName,
  members,
  eventDate,
  eventTime,
  chatUserName,
  chatText,
  chatTime,
  newChatCount,
  calendarColor,
}) => {
  return (
    <ChatLow $calendarColor={calendarColor}>
      <div className='schedule'>
        <div className='scheduleUser'>
          <img src={userProfileImg} alt='profile' />
          <div className='scheduleUser-badge'>{members - 1}+</div>
        </div>
        <div className='scheduleDetiles'>
          <div className='scheduleTitle'>{eventName}</div>
          <div className='scheduleTime'>
            <BsFillCalendar2WeekFill />
            {eventDate} &nbsp; {eventTime}
          </div>
        </div>
      </div>
      <div className='chat'>
        <div className='chatContents'>
          <div className='chatUserName'>{chatUserName}</div>
          <div className='chatMark'>:</div>
          <div className='chatText'>{chatText}</div>
        </div>
        <div className='chat-time'>{chatTime}</div>
        <div className='chat-badge'>{newChatCount}</div>
      </div>
    </ChatLow>
  );
};

export default ChatListRow;
