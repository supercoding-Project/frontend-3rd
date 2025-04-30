import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const baseUrl = apiUrl ? `${apiUrl}/api` : '/api';

const CreateTodoModal = ({ closeModal, addTodo }) => {
  // const SERVER_URL = 'http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080';

  const [todoText, setTodoText] = useState('');
  const [calendarId, setCalendarId] = useState(null);
  const [calendarName, setCalendarName] = useState('');
  const [date, setDate] = useState('');
  const [repeatType, setRepeatType] = useState('NONE');
  const [repeatInterval, setRepeatInterval] = useState(0);
  const [repeatEndDate, setRepeatEndDate] = useState('');
  const [memo, setMemo] = useState('');
  const [calendarList, setCalendarList] = useState([]);
  const [showCalendarDropDown, setShowCalendarDropDown] = useState(false);
  const [repeatContentDropDown, setRepeatContentDropDown] = useState(false);
  const [colorCategory, setColorCategory] = useState('');

  useEffect(() => {
    const fetchCalendars = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      try {
        const response = await axios.get(`${baseUrl}/v1/calendars`, {
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

  const handleAddTodo = async () => {
    if (!todoText.trim() || !calendarId || !date) {
      alert('할 일, 캘린더, 날짜를 입력해주세요.');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const todoData = {
      todoId: 0,
      calendarId: calendarId,
      todoContent: todoText,
      memo: memo,
      todoDate: date,
      repeatSchedule: {
        repeatType: repeatType,
        repeatInterval: repeatType === 'NONE' ? 0 : repeatInterval,
        repeatEndDate: repeatType === 'NONE' ? null : repeatEndDate,
      },
    };

    try {
      const response = await axios.post(`${baseUrl}/v1/todo?calendarId=${calendarId}`, todoData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        addTodo(response.data.data);
        closeModal();
      }
    } catch (error) {
      console.error('할 일 추가 실패', error);
      alert('할 일 추가 중 오류가 발생했습니다.');
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>할 일 등록</h2>
        <InputContainer>
          <label>할 일</label>
          <input value={todoText} onChange={(e) => setTodoText(e.target.value)} placeholder='할 일을 입력하세요.' />
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
          <SubmitButton onClick={handleAddTodo}>등록</SubmitButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateTodoModal;

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
  flex-direction: column; /* 세로로 배치 */
  gap: 10px; /* 항목 간 간격 */
  align-items: flex-start; /* 왼쪽 정렬 */

  & label {
    width: 90px;
    font-size: var(--font-sm);
    font-weight: 400;
    margin-top: 10px;
  }

  & > input {
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
    overflow-y: auto;
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
    border: 1px solid lightgray;
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
    border: 1px solid lightgray;
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
