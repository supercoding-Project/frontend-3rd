import React from 'react';
import styled from 'styled-components';

const TaskContainer = styled.div``;

const TaskProgress = styled.div`
  display: flex;
  justify-content: end;
  gap: 3px;
  font-size: var(--font-sm);
  color: var(--color-text-disabled);
  margin-top: 10px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 7px;
  background-color: var(--color-bg-primary);
  border-radius: 5px;
  position: relative;
  margin: 3px 0 20px 0;
`;

const ProgressBar = styled.div`
  width: ${(props) => (props.$progress / props.$total) * 100}%;
  height: 100%;
  background-color: var(--color-main-active);
  border-radius: 5px;
`;

const TaskStatusContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const TaskStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .TaskStatus-count {
    font-size: var(--font-xl);
    font-weight: bold;
    margin: 10px;
  }
  .TaskStatus-text {
    color: var(--color-text-disabled);
  }
  .bold {
    font-weight: bold;
    font-size: var(--font-md);
  }
  .normal {
    font-size: var(--font-sm);
    margin-top: 3px;
  }
`;

const TaskSection = () => {
  const completedTasks = 12;
  const totalTasks = 34;

  return (
    <TaskContainer>
      <TaskProgress>
        <div>{completedTasks}</div>
        <div>/</div>
        <div>{totalTasks}</div>
      </TaskProgress>

      <ProgressBarContainer>
        <ProgressBar $progress={completedTasks} $total={totalTasks} />
      </ProgressBarContainer>

      <TaskStatusContainer>
        <TaskStatus>
          <div className='TaskStatus-count'>{totalTasks}</div>
          <div className='TaskStatus-text bold'>전체</div>
          <div className='TaskStatus-text normal'>예정된 업무</div>
        </TaskStatus>
        <TaskStatus>
          <div className='TaskStatus-count'>{completedTasks}</div>
          <div className='TaskStatus-text bold'>완료된</div>
          <div className='TaskStatus-text normal'>업무</div>
        </TaskStatus>
        <TaskStatus>
          <div className='TaskStatus-count'>{totalTasks - completedTasks}</div>
          <div className='TaskStatus-text bold'>진행 중인</div>
          <div className='TaskStatus-text normal'>업무</div>
        </TaskStatus>
      </TaskStatusContainer>
    </TaskContainer>
  );
};

export default TaskSection;
