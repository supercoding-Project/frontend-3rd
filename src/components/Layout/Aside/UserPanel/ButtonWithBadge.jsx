import React from 'react';
import styled from 'styled-components';

const ButtonContainer = styled.button`
  position: relative;
  border: none;
  cursor: pointer;
  background-color: var(--color-bg-primary);
  color: var(--color-main-active);
  font-size: var(--font-xl);
  padding-top: 7px;
  width: 50px;
  height: 50px;
  border-radius: 100px;
`;

const Badge = styled.div`
  position: absolute;
  top: -3px;
  right: -3px;
  background-color: var(--color-badge);
  color: white;
  font-size: var(--font-sm);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonWithBadge = ({ $icon, $badgeCount, onClick }) => {
  return (
    <ButtonContainer onClick={onClick}>
      {$icon}
      {$badgeCount > 0 && <Badge>{$badgeCount}</Badge>} {/* 배지가 있을 때만 표시 */}
    </ButtonContainer>
  );
};

export default ButtonWithBadge;
