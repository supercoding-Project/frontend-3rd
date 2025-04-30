import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TodoHeader from './TodoHeader';
import CreateTodoModal from './CreateTodoModal';
import EditTodoModal from './EditTodoModal'; // EditTodoModal 임포트
import { MdOutlineModeEdit } from 'react-icons/md';

const apiUrl = import.meta.env.VITE_API_URL;
const baseUrl = apiUrl ? `${apiUrl}/api` : '/api';

const TodoMain = () => {
  const [todoList, setTodoList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태
  const [selectedTodo, setSelectedTodo] = useState(null); // 선택된 할 일

  //const SERVER_URL = 'http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080';

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    fetch(`${baseUrl}/v1/todo?view=MONTHLY&date=2025-03-28&calendarId=59`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isSuccess) {
          setTodoList(data.data);
        }
      })
      .catch((error) => console.error('Error fetching todos:', error));
  }, []);

  const addTodo = (newTodo) => {
    setTodoList((prevList) => [...prevList, newTodo]);
  };

  const handleEditClick = (todo) => {
    setSelectedTodo(todo);
    setIsEditModalOpen(true); // 수정 모달 열기
  };

  const updateTodoList = (updatedTodo, todoIdToDelete) => {
    if (updatedTodo) {
      setTodoList((prevTodoList) =>
        prevTodoList.map((todo) => (todo.todoId === updatedTodo.todoId ? updatedTodo : todo))
      );
    }
    if (todoIdToDelete) {
      setTodoList((prevList) => prevList.filter((todo) => todo.todoId !== todoIdToDelete));
    }
  };

  const handleDeleteTodo = (todoId) => {
    setTodoList(todoList.filter((todo) => todo.todoId !== todoId));
  };

  const toggleComplete = (index) => {
    setTodoList(todoList.map((todo, i) => (i === index ? { ...todo, completed: !todo.completed } : todo)));
  };

  return (
    <Container>
      <TodoHeader addTodo={addTodo} openModal={() => setIsModalOpen(true)} />
      <TodoList>
        {todoList.length === 0 ? (
          <NoTodoMessage>등록된 할 일이 없습니다.</NoTodoMessage>
        ) : (
          todoList.map((todo) => (
            <TodoItem key={todo.todoId}>
              <Checkbox type='checkbox' checked={todo.completed} onChange={() => toggleComplete(todo)} />
              <TodoText completed={todo.completed}>{todo.todoContent}</TodoText>
              <EditIcon onClick={() => handleEditClick(todo)} />
            </TodoItem>
          ))
        )}
      </TodoList>
      {isModalOpen && <CreateTodoModal closeModal={() => setIsModalOpen(false)} addTodo={addTodo} />}
      {isEditModalOpen && (
        <EditTodoModal
          closeModal={() => setIsEditModalOpen(false)}
          todo={selectedTodo}
          updateTodoList={updateTodoList}
          calendarId={59} // 캘린더 ID를 필요에 맞게 전달
        />
      )}
    </Container>
  );
};

export default TodoMain;

const Container = styled.div`
  width: 600px;
`;

const TodoList = styled.div`
  background: #fafafa;
  border-radius: 8px;
  padding: 10px;
  margin-top: 20px;
`;

const TodoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const TodoText = styled.span`
  flex: 1;
  margin-left: 10px;
  text-decoration: ${(props) => (props.completed ? 'line-through' : 'none')};
  color: ${(props) => (props.completed ? '#aaa' : '#333')};
`;

const EditIcon = styled(MdOutlineModeEdit)`
  color: #4caf50;
  cursor: pointer;

  &:hover {
    color: #388e3c;
  }
`;

const NoTodoMessage = styled.div`
  text-align: center;
  font-size: 16px;
  color: #777;
  padding: 20px 0;
`;
