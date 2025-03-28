import React, { useState, useEffect } from 'react'; // useEffect 추가
import styled from 'styled-components';
import axios from 'axios';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs'; // 아이콘 추가

const EditTodoModal = ({ closeModal, todo, updateTodoList, calendarId: propCalendarId }) => {
  const [todoText, setTodoText] = useState(todo.todoContent);
  const [memo, setMemo] = useState(todo.memo);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState('');
  const [repeatType, setRepeatType] = useState('NONE');
  const [repeatInterval, setRepeatInterval] = useState(0);
  const [repeatEndDate, setRepeatEndDate] = useState('');
  const [showCalendarDropDown, setShowCalendarDropDown] = useState(false);
  const [repeatContentDropDown, setRepeatContentDropDown] = useState(false);
  const [calendarId, setCalendarId] = useState(propCalendarId); // props에서 calendarId로 초기화
  const [calendarName, setCalendarName] = useState('');
  const [calendarList, setCalendarList] = useState([]); // 캘린더 리스트 상태 추가
  const [colorCategory, setColorCategory] = useState(''); // 색상 관리 상태 추가

  const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080';

  useEffect(() => {
    const fetchCalendars = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      try {
        const response = await axios.get(`${SERVER_URL}/api/v1/calendars`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data) {
          const filteredCalendars = response.data.data.filter((calendar) => calendar.calendarType === 'TODO');
          setCalendarList(filteredCalendars);
        }
      } catch (error) {
        console.error('캘린더 목록 오류', error);
      }
    };
    fetchCalendars();
  }, []);

  // 수정 API 호출
  const handleEditTodo = async () => {
    if (!todoText.trim()) {
      alert('할 일을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('access_token');

    try {
      // 반복 설정 추가
      const todoData = {
        todoContent: todoText,
        memo,
        repeatSchedule: {
          repeatType: repeatType,
          repeatInterval: repeatType === 'NONE' ? 0 : repeatInterval,
          repeatEndDate: repeatType === 'NONE' ? null : repeatEndDate,
        },
        todoDate: date, // 일시 추가
      };

      const response = await axios.put(`${SERVER_URL}/api/v1/todo/${todo.todoId}?calendarId=${calendarId}`, todoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        // 수정된 데이터를 바로 반영하기 위해 updateTodoList 호출
        updateTodoList(response.data);
        alert('할 일 수정되었습니다!');
        closeModal();
      }
    } catch (error) {
      console.error('할 일 수정 오류', error);
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 삭제 API 호출
  const handleDeleteTodo = async () => {
    const token = localStorage.getItem('access_token');

    try {
      const response = await axios.delete(`${SERVER_URL}/api/v1/todo/${todo.todoId}?calendarId=${calendarId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        updateTodoList(null, todo.todoId); // 삭제된 todoId를 전달하여 리스트에서 제거
        alert(response.data.data.message);
        closeModal();
      }
    } catch (error) {
      console.error('할 일 삭제 오류', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>할 일 수정</h2>
        <InputContainer>
          <label>할 일</label>
          <input value={todoText} onChange={(e) => setTodoText(e.target.value)} placeholder='할 일을 수정하세요.' />
        </InputContainer>
        <InputContainer>
          <label>캘린더 선택</label>
          <CalendarDropDown>
            <button type='button' onClick={() => setShowCalendarDropDown(!showCalendarDropDown)}>
              <div style={{ backgroundColor: colorCategory, width: '20px', height: '20px', marginRight: '10px' }} />
              <div style={{ width: '100%' }}>{calendarName || '캘린더를 선택하세요'}</div>
              {showCalendarDropDown ? <BsChevronDown /> : <BsChevronRight />}
            </button>
            {showCalendarDropDown && (
              <ul>
                {calendarList.map((calendarItem) => (
                  <li
                    key={calendarItem.calendarId}
                    onClick={() => {
                      setCalendarId(calendarItem.calendarId);
                      setCalendarName(calendarItem.calendarName);
                      setColorCategory(calendarItem.calendarColor);
                      setShowCalendarDropDown(false);
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: calendarItem.calendarColor,
                        width: '15px',
                        height: '15px',
                        marginRight: '10px',
                        display: 'inline-block',
                      }}
                    />
                    {calendarItem.calendarName}
                  </li>
                ))}
              </ul>
            )}
          </CalendarDropDown>
        </InputContainer>
        <InputContainer>
          <label>일시</label>
          <input type='date' value={date} onChange={(e) => setDate(e.target.value)} />
        </InputContainer>
        <InputContainer>
          <label>설명</label>
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)}></textarea>
        </InputContainer>
        <InputContainer>
          <label>반복 설정</label>
          <RepeatDropDown>
            <button type='button' onClick={() => setRepeatContentDropDown(!repeatContentDropDown)}>
              {repeatType}
              {repeatContentDropDown ? <BsChevronDown /> : <BsChevronRight />}
            </button>
            {repeatContentDropDown && (
              <ul>
                {['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].map((type) => (
                  <li key={type} onClick={() => setRepeatType(type)}>
                    {type}
                  </li>
                ))}
              </ul>
            )}
          </RepeatDropDown>
          {repeatType !== 'NONE' && (
            <>
              <label>반복 간격</label>
              <input
                type='number'
                min={1}
                value={repeatInterval}
                onChange={(e) => setRepeatInterval(Number(e.target.value))}
              />
              <label>반복 종료일</label>
              <input type='date' value={repeatEndDate} onChange={(e) => setRepeatEndDate(e.target.value)} />
            </>
          )}
        </InputContainer>
        <ButtonContainer>
          <CancelButton onClick={closeModal}>취소</CancelButton>
          <SubmitButton onClick={handleEditTodo} disabled={isLoading}>
            {isLoading ? '수정 중...' : '수정'}
          </SubmitButton>
          <DeleteButton onClick={handleDeleteTodo}>삭제</DeleteButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditTodoModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  width: 400px;
  height: auto;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-height: 90vh;
  overflow-y: auto;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;

  & label {
    width: 90px;
    font-size: var(--font-sm);
    font-weight: 400;
    margin-top: 10px;
  }

  & input {
    border: 1px solid var(--color-border);
    width: 330px;
    height: 30px;
    padding: 0 8px;
    outline: none;
  }

  & textarea {
    width: 330px;
    height: 100px;
    resize: none;
    outline: none;
    border: 1px solid var(--color-border);
    padding: 8px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 5px;
`;

const CancelButton = styled.button`
  padding: 5px 10px;
  background: var(--color-bg-primary);
  color: black;
  border: none;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: var(--color-main-active);
    color: white;
  }
`;

const SubmitButton = styled.button`
  padding: 5px 10px;
  background: var(--color-main-active);
  color: white;
  border: none;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: var(--color-main-primary);
    color: black;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  background: #ff6666;
  color: white;
  border: none;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #cc0000;
  }
`;

const CalendarDropDown = styled.div`
  width: 330px;
  position: relative;

  & button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: none;
    background: transparent;
    width: 100%;
    border: 1px solid var(--color-border);
    font-size: var(--font-sm);
    cursor: pointer;
    text-align: left;
  }

  & button svg {
    width: 10px;
    height: 10px;
  }

  & ul {
    position: absolute;
    top: 35px;
    border: 1px solid var(--color-border);
    width: 200px;
    background: white;
    z-index: 1;
  }

  & li {
    padding: 10px 8px;
    font-size: var(--font-sm);
    border-bottom: 1px solid var(--color-border);
    cursor: pointer;
  }

  & li:hover {
    background: var(--color-bg-hover);
    font-weight: 400;
  }

  & li:last-child {
    border: none;
  }
`;

const RepeatDropDown = styled.div`
  width: 200px;
  position: relative;

  & button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: none;
    background: transparent;
    width: 100%;
    border: 1px solid var(--color-border);
    font-size: var(--font-sm);
    cursor: pointer;
    text-align: left;
  }

  & button svg {
    width: 10px;
    height: 10px;
  }

  & ul {
    position: absolute;
    top: 35px;
    border: 1px solid var(--color-border);
    width: 200px;
    background: white;
    z-index: 1;
  }

  & li {
    padding: 10px 8px;
    font-size: var(--font-sm);
    border-bottom: 1px solid var(--color-border);
    cursor: pointer;
  }

  & li:hover {
    background: var(--color-bg-hover);
    font-weight: 400;
  }

  & li:last-child {
    border: none;
  }
`;

const RepeatIntervalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;

  & label {
    width: 80px;
    font-size: var(--font-md);
    font-weight: 400;
    margin-bottom: 10px;
  }

  & input {
    border: 1px solid var(--color-border);
    width: 100px;
    height: 30px;
    padding: 0 8px;
    outline: none;
  }
`;
