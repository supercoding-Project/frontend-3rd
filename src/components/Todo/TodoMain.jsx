import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TodoHeader from './TodoHeader';
import { FaTrash } from 'react-icons/fa';

const TodoMain = () => {
  const [todoList, setTodoList] = useState([]);
  const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080';

  // ✅ API에서 할 일 목록 가져오기
  useEffect(() => {
    const token = localStorage.getItem('access_token');

    fetch(
      'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/api/v1/todo?view=MONTHLY&date=2025-03-28&calendarId=48',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.isSuccess) {
          setTodoList(data.data); // ✅ 서버 응답 데이터에서 'data' 배열 저장
        }
      })
      .catch((error) => console.error('Error fetching todos:', error));
  }, []);

  const addTodo = (newTodoContent) => {
    const token = localStorage.getItem('access_token');

    // 새 할 일이 추가될 때 로그로 확인
    console.log('Adding new todo:', newTodoContent);

    // API 요청을 통해 새 할 일 추가
    fetch('http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/api/v1/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        calendarId: 48, // 예시로 calendarId 48을 사용, 실제 값은 동적으로 설정
        todoContent: newTodoContent,
        todoDate: '2025-03-28', // 예시 날짜, 실제 값에 맞게 수정
      }),
    })
      .then((res) => {
        console.log('API Response:', res); // 응답 확인
        return res.json();
      })
      .then((data) => {
        console.log('Data from API:', data); // 데이터 확인
        if (data.isSuccess) {
          // 새 할 일이 추가된 경우, todoList에 즉시 추가
          setTodoList((prevList) => [...prevList, data.data]); // 새 할 일을 리스트에 추가
        }
      })
      .catch((error) => {
        console.error('Error adding todo:', error);
      });
  };

  const toggleComplete = (index) => {
    setTodoList(todoList.map((todo, i) => (i === index ? { ...todo, completed: !todo.completed } : todo)));
  };

  const handleDeleteTodo = (index) => {
    setTodoList(todoList.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <TodoHeader addTodo={addTodo} />
      <TodoList>
        {todoList.length === 0 ? (
          <NoTodoMessage>등록된 할 일이 없습니다.</NoTodoMessage>
        ) : (
          todoList.map((todo, index) => (
            <TodoItem key={todo.todoId}>
              <Checkbox type='checkbox' checked={todo.completed} onChange={() => toggleComplete(index)} />
              <TodoText completed={todo.completed}>{todo.todoContent}</TodoText> {/* todoContent로 텍스트 출력 */}
              <DeleteIcon onClick={() => handleDeleteTodo(index)} />
            </TodoItem>
          ))
        )}
      </TodoList>
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

const DeleteIcon = styled(FaTrash)`
  color: #ff6666;
  cursor: pointer;

  &:hover {
    color: #cc0000;
  }
`;

const NoTodoMessage = styled.div`
  text-align: center;
  font-size: 16px;
  color: #777;
  padding: 20px 0;
`;
