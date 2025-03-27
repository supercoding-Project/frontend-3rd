// 채팅방 생성 버튼 만들기 직전

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

// const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:9092';
const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080';

const ChatList = () => {
  const [rooms, setRooms] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('❌ 토큰이 없습니다. 다시 로그인하세요.');
        return;
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

        if (response.data.isSuccess) {
          const userId = response.data.data.id; // 서버에서 유저 ID를 가져옴
          localStorage.setItem('userId', userId); // userId를 로컬스토리지에 저장
          setUserId(userId); // 상태에 userId 저장
        } else {
          console.error('❌ 유저 정보를 불러오는데 실패했습니다:', response.data.errorCode);
        }
      } catch (error) {
        console.error('유저 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, []); // 처음 한 번만 실행되도록 설정

  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem('access_token');
      const userId = localStorage.getItem('userId'); // userId 가져오기

      if (!token) {
        console.error('❌ 토큰이 없습니다. 다시 로그인하세요.');
        return;
      }
      if (!userId) {
        console.error('❌ 유저 ID가 없습니다.');
        return;
      }

      try {
        console.log(userId);
        const response = await axios.get(`${SERVER_URL}/api/v1/chat/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId: userId }, // userId를 params로 추가
        });

        console.log('✅ 채팅방 목록:', response.data);
        setRooms(response.data.data); // 채팅방 목록 상태에 저장
      } catch (error) {
        console.error('❌ 채팅방 목록 불러오기 실패:', error);
      }
    };

    if (userId) {
      fetchRooms(); // userId가 있으면 채팅방 목록을 가져옴
    }
  }, [userId]); // userId가 변경될 때마다 실행

  const handleRoomClick = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  return (
    <ChatListContainer>
      <h1>채팅 목록</h1>
      {rooms.length > 0 ? (
        <ul>
          {rooms.map((room) => (
            <li key={room.roomId} onClick={() => handleRoomClick(room.roomId)}>
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

const ChatListContainer = styled.div`
  overflow: auto;
  h1 {
    border-bottom: 1px solid var(--color-border);
    padding: 15px 20px;
    font-weight: bold;
  }
`;
