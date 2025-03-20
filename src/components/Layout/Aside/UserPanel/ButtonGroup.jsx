import React from 'react';
import { Link } from 'react-router-dom';
import { BsGearFill, BsChatRightDotsFill, BsBellFill } from 'react-icons/bs';
import styled from 'styled-components';
import ButtonWithBadge from './ButtonWithBadge'; // 나중에 배지 컴포넌트 사용
import { useNavigate } from 'react-router-dom';

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
  return (
    <ButtonGroupContainer>
      <ButtonWithBadge $icon={<BsGearFill />} onClick={() => navigate('/myPage')} />
      <ButtonWithBadge
        $icon={<BsChatRightDotsFill />}
        $badgeCount={2}
        onClick={() => {
          openChatList();
        }}
      />
      <Link to='/notifications'>
        <ButtonWithBadge $icon={<BsBellFill />} $badgeCount={5} />
      </Link>
    </ButtonGroupContainer>
  );
};

export default ButtonGroup;
