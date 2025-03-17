import React from 'react';
import { Link } from 'react-router-dom';
import { BsGearFill, BsChatRightDotsFill, BsBellFill } from 'react-icons/bs';
import styled from 'styled-components';
import ButtonWithBadge from './ButtonWithBadge';

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
  return (
    <ButtonGroupContainer>
      <ButtonWithBadge $icon={<BsGearFill />} />
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
