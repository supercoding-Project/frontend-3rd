import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BsGearFill, BsChatRightDotsFill, BsBellFill } from 'react-icons/bs';
import styled from 'styled-components';
import ButtonWithBadge from './ButtonWithBadge';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const openChatList = () => {
  window.open('/chat-list', '_blank', 'width=500, height=700, top=300, left=500, noopener,noreferrer');
};

const ButtonGroupContainer = styled.div`
  display: flex;
  margin: 20px 10px;
  justify-content: space-around;
  align-items: center;
`;

const ButtonGroup = () => {
  const navigate = useNavigate();
  const [unreadChats, setUnreadChats] = useState(0); // 웹소켓으로 읽지 않은 채팅 수
  const [unreadNotifications, setUnreadNotifications] = useState(0); // HTTP로 읽지 않은 알림 수

  // 알림 읽지 않은 개수 가져오기 (HTTP 요청)
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log(token);
    if (!token) {
      console.error('유효한 토큰이 없습니다. 다시 로그인해 주세요.');
      return;
    }
    axios
      .get('http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080/api/v1/alarms/unread', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.isSuccess && res.data.data) {
          const unreadCount = res.data.data.filter((alarm) => alarm.read === false).length;
          setUnreadNotifications(unreadCount);
        } else {
          console.warn('🚫 알림 불러오기 실패', res.data.errorCode);
        }
      })
      .catch((err) => {
        console.error('📡 알림 불러오기 에러:', err);
      });
  }, []);

  // 채팅 읽지 않은 개수 가져오기 (웹소켓을 통한 실시간 처리)
  // 예시로 웹소켓 연결 후 unreadChats를 실시간으로 갱신
  useEffect(() => {
    const socket = new WebSocket('http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:9092');

    socket.onmessage = (message) => {
      // 서버에서 읽지 않은 채팅 메시지가 도착했을 때 처리
      const newUnreadCount = parseInt(message.data, 10); // 예시로 서버에서 읽지 않은 메시지 개수를 받는다고 가정
      setUnreadChats(newUnreadCount);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <ButtonGroupContainer>
      <ButtonWithBadge $icon={<BsGearFill />} onClick={() => navigate('/myPage')} />
      <ButtonWithBadge
        $icon={<BsChatRightDotsFill />}
        $badgeCount={unreadChats} // 웹소켓에서 받은 읽지 않은 채팅 수
        onClick={() => {
          openChatList();
        }}
      />
      <Link to='/notifications'>
        <ButtonWithBadge $icon={<BsBellFill />} $badgeCount={unreadNotifications} />
      </Link>
    </ButtonGroupContainer>
  );
};

export default ButtonGroup;
