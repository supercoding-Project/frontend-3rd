import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import CreateTodoModal from './CreateTodoModal';

const TodoHeader = ({ addTodo }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNavToCal = () => navigate('/');
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <ButtonContainer>
        <CalendarButton onClick={handleNavToCal}>일정 보기</CalendarButton>
        <CalendarButton onClick={toggleModal}>할 일 등록</CalendarButton>
      </ButtonContainer>
      {isModalOpen && <CreateTodoModal closeModal={toggleModal} addTodo={addTodo} />}
    </>
  );
};

export default TodoHeader;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 5px;
`;

const CalendarButton = styled.button`
  width: 100px;
  height: 36px;
  background-color: var(--color-main-active);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: bolder;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background-color: var(--color-bg-primary);
    color: black;
  }
`;
