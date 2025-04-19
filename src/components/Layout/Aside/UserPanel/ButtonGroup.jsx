import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsGearFill, BsChatRightDotsFill, BsBellFill } from 'react-icons/bs';
import styled from 'styled-components';
import ButtonWithBadge from './ButtonWithBadge';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const baseUrl = 'http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080';

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
  const [alarmCount, setAlarmCount] = useState(0);

  const fetchAlarmCount = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.warn('No access token found.');
        return;
      }
  
      const response = await axios.get(`${baseUrl}/api/v1/alarms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('알림 API 응답:', response.data);
      setAlarmCount(response.data.data);
    } catch (error) {
      console.error('알림 개수 조회 실패:', error);
    }
  };
  
  

  useEffect(() => {
    fetchAlarmCount();
  
    const interval = setInterval(() => {
      fetchAlarmCount();
    }, 10000);
  
    const onAlarmUpdated = () => {
      const count = localStorage.getItem("alarmCount");
      setAlarmCount(parseInt(count) || 0);
    };
  
    window.addEventListener("alarmCountUpdated", onAlarmUpdated);
  
    return () => {
      clearInterval(interval);
      window.removeEventListener("alarmCountUpdated", onAlarmUpdated);
    };
  }, []);
  

  return (
    <ButtonGroupContainer>
      <ButtonWithBadge $icon={<BsGearFill />} onClick={() => navigate('/myPage')} />
      <ButtonWithBadge $icon={<BsChatRightDotsFill />} $badgeCount={4} onClick={openChatList} />
      <Link to="/notifications">
      <ButtonWithBadge $icon={<BsBellFill />} $badgeCount={alarmCount > 0 ? alarmCount : 0} />
      </Link>
    </ButtonGroupContainer>
  );
};

export default ButtonGroup;
