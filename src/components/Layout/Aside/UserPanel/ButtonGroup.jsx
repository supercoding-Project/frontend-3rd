import React from 'react';
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
      <ButtonWithBadge $icon={<BsBellFill />} $badgeCount={5} />
    </ButtonGroupContainer>
  );
};

export default ButtonGroup;
