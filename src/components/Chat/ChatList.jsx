import React from 'react';
import styled from 'styled-components';
import ChatListRow from './ChatListRow';

const ChatListContainer = styled.div`
  overflow: auto;
  h1 {
    border-bottom: 1px solid var(--color-border);
    padding: 15px 20px;
    font-weight: bold;
  }
`;

const ChatList = () => {
  return (
    <ChatListContainer>
      <h1>채팅 목록</h1>
      <ChatListRow
        calendarColor='var(--color-calendar-7)'
        eventName='워크샵 회의'
        members={4}
        eventDate='2025-03-14'
        eventTime='16:00 - 18:00'
        chatUserName='김길동'
        chatText='확인했습니다.'
        chatTime='12 : 30'
        newChatCount='22'
      />
      <ChatListRow
        calendarColor='var(--color-calendar-1)'
        eventName='동아리 정기모임'
        members={13}
        eventDate='2025-03-16'
        eventTime='18:00 - 19:00'
        chatUserName='김마리아'
        chatText='또 다른 사람은?'
        chatTime='14 : 22'
        newChatCount='7'
      />
    </ChatListContainer>
  );
};

export default ChatList;
