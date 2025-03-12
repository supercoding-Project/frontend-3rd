import React from 'react';
import { Link } from 'react-router-dom';
import { BsGearFill, BsChatRightDotsFill, BsBellFill } from 'react-icons/bs';
import styled from 'styled-components';
import ButtonWithBadge from './ButtonWithBadge'; // 나중에 배지 컴포넌트 사용

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
      <ButtonWithBadge $icon={<BsChatRightDotsFill />} $badgeCount={2} />
      <Link to='/notifications'>
        <ButtonWithBadge $icon={<BsBellFill />} $badgeCount={5} />
      </Link>
    </ButtonGroupContainer>
  );
};

export default ButtonGroup;
