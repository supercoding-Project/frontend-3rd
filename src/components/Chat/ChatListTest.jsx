import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ChatListRow from './ChatListRow';
import ChatTest from './ChatTest';
import ChatSocketTest from './ChatSocketTest';
import FetchChatRoomsTest from './ChatRoomsTest';

const ChatListContainer = styled.div`
  overflow: auto;
  h1 {
    border-bottom: 1px solid var(--color-border);
    padding: 15px 20px;
    font-weight: bold;
  }
`;

const ChatList = () => {
  // const [chatRooms, setChatRooms] = useState([]);

  // useEffect(() => {
  //   const fetchChatRooms = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       if (!token) {
  //         console.error('❌ JWT 토큰이 없습니다.');
  //         return;
  //       }

  //       const response = await axios.get(
  //         'http://서버주소/api/chat/rooms', // 백엔드 API 엔드포인트 확인 필요!
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       setChatRooms(response.data); // 백엔드 응답 데이터에 맞게 수정 필요
  //     } catch (error) {
  //       console.error('❌ 채팅방 목록 불러오기 실패:', error);
  //     }
  //   };

  //   fetchChatRooms();
  // }, []);

  return (
    <ChatListContainer>
      <h1>채팅 목록</h1>
      <ChatSocketTest />
      <FetchChatRoomsTest />
      {/* {chatRooms.map((room) => (
        <ChatListRow
          key={room.chatRoomId}
          calendarColor='var(--color-calendar-7)'
          eventName={room.roomName} // 서버 데이터에 맞게 수정 필요
          members={room.members?.length || 0} // 유저 리스트 길이 기반
          eventDate={room.createAt?.split(' ')[0]} // 날짜만 가져오기
          eventTime='시간 정보 없음' // API에서 시간 정보 확인 필요
          chatUserName='최근 메시지 보낸 유저' // API 데이터 확인 필요
          chatText='최근 메시지 내용' // API 데이터 확인 필요
          chatTime='시간' // API 데이터 확인 필요
          newChatCount={0} // API에서 안 주면 0으로 설정
        />
      ))} */}
      {/* <ChatListRow
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
      /> */}
      <ChatTest />
    </ChatListContainer>
  );
};

export default ChatList;
