import styled from 'styled-components';
import { FaPen } from 'react-icons/fa';

const Todo = () => {
  return (
    <div>
      <CalendarButton>일정보기</CalendarButton>
      <TodoHeader>
        <input type='text' placeholder='내가 해야 할 일을 기록해보세요.'></input>
        <StyledFaPen />
      </TodoHeader>
    </div>
  );
};

export default Todo;

const CalendarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  width: 92px;
  height: 32px;
  background-color: var(--color-main-active);
  border: none;
  border-radius: 6px;
  color: white;
  transition: 0.01;
  &:hover {
    background-color: var(--color-bg-primary);
    color: black;
  }
`;
const TodoHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid var(--color-border);

  & input {
    border: none;
    width: 100%;
    height: 40px;
    padding-left: 15px;
  }
`;

const StyledFaPen = styled(FaPen)`
  margin: 10px;
  color: var(--color-main-inactive);
`;
