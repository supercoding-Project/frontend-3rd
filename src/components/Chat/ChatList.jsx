import { useEffect, useState } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import styled from 'styled-components';

// const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:9092';
const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080';

const ChatListContainer = styled.div`
  overflow: auto;
  h1 {
    border-bottom: 1px solid var(--color-border);
    padding: 15px 20px;
    font-weight: bold;
  }
`;

const ChatList = () => {
  const [rooms, setRooms] = useState([]);
  const [client, setClient] = useState(null);
  const [userId, setUserId] = useState(null); // 유저 ID 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('❌ 토큰이 없습니다. 다시 로그인하세요.');
        return; // 토큰이 없으면 더 이상 진행하지 않음
      }

      // 1. 유저 정보 가져오기
      try {
        const response = await axios.get(
          'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/api/v1/mypage',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('✅ 응답 데이터:', response.data);
        console.log('현재 저장된 access_token:', token);

        if (response.data.isSuccess) {
          const userId = response.data.data.id; // 서버에서 유저 ID를 가져옴
          setUserId(userId);
          console.log('✅ 유저 정보:', response.data.data);
        } else {
          console.error('❌ 유저 정보를 불러오는데 실패했습니다:', response.data.errorCode);
        }
      } catch (error) {
        console.error('유저 정보를 불러오는 중 오류 발생:', error);
        if (error.response) {
          console.log('🔴 서버 응답 상태 코드:', error.response.status);
          console.log('🔴 서버 응답 데이터:', error.response.data);
        }
      }

      // 2. 유저 ID가 설정되면 채팅방 목록을 가져오기
      if (userId) {
        console.log('userId :', userId);
        try {
          const response = await axios.get(`${SERVER_URL}/api/v1/chat/rooms`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            // params: {
            //   userId: userId,
            // },
          });

          console.log('✅ 채팅방 목록:', response.data);
          setRooms(response.data.data); // 채팅방 목록 상태에 저장
        } catch (error) {
          console.error('❌ 채팅방 목록 불러오기 실패:', error);
        }
      }

      // 3. 웹소켓 연결 설정
      const sock = new SockJS(`${SERVER_URL}/ws/chat`);
      const stompClient = new Client({
        webSocketFactory: () => sock,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        onConnect: () => {
          console.log('✅ WebSocket 연결 성공!');
        },
        onStompError: (frame) => {
          console.error('❌ STOMP 오류:', frame);
        },
      });

      stompClient.activate();
      setClient(stompClient);

      // 클린업 함수
      return () => {
        stompClient.deactivate();
      };
    };

    fetchData(); // 비동기 함수 호출
  }, [userId]); // userId가 바뀔 때마다 실행됩니다.

  return (
    <ChatListContainer>
      <h1>채팅 목록</h1>
      {rooms.length > 0 ? (
        <ul>
          {rooms.map((room) => (
            <li key={room.roomId}>
              {room.roomName} - {room.joinedAt}
            </li>
          ))}
        </ul>
      ) : (
        <p>채팅방 목록이 없습니다.</p>
      )}
    </ChatListContainer>
  );
};

export default ChatList;
