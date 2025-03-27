import React from 'react';
import ProfileInfo from './ProfileInfo';
import ButtonGroup from './ButtonGroup';
import TaskInfo from './TaskInfo';
import styled from 'styled-components';

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px 20px;
  border-bottom: 1px solid var(--color-border);
`;

const UserPanel = () => {
  return (
    <PanelContainer>
      <ProfileInfo />
      <ButtonGroup />
      <TaskInfo />
    </PanelContainer>
  );
};

export default UserPanel;
