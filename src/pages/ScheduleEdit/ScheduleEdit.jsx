import { useState, useEffect } from 'react';
import axios from 'axios';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';

const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080';

const ScheduleEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const [showCalendarDropDown, setShowCalendarDropDown] = useState(false);
  const [repeatContentDropDown, setRepeatContentDropDown] = useState(false);
  const [calendar, setCalendar] = useState('');
  const [calendarList, setCalendarList] = useState([]);
  const [colorCategory, setColorCategory] = useState('');
  const [title, setTitle] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [memo, setMemo] = useState('');
  const [mentionUserIds, setMentionUserIds] = useState([]);
  const [repeatType, setRepeatType] = useState('NONE');
  const [repeatInterval, setRepeatInterval] = useState(0);
  const [repeatEndDate, setRepeatEndDate] = useState('');
  const [userId, setUserId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [mentionUsers, setMentionUsers] = useState([]); // 멘션 가능한 유저 목록
  const [showMentionSelect, setShowMentionSelect] = useState(false); // 멘션 유저 선택 UI 표시 여부부

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      try {
        const response = await axios.get(`${SERVER_URL}/api/v1/mypage`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.isSuccess) setUserId(response.data.data.id);
      } catch (error) {
        console.error('유저 정보 오류', error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchCalendars = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      try {
        const response = await axios.get(`${SERVER_URL}/api/v1/calendars`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.isSuccess) setCalendarList(response.data.data);
      } catch (error) {
        console.error('캘린더 목록 오류', error);
      }
    };
    fetchCalendars();
  }, []);

  useEffect(() => {
    if (state?.selectedDate) setStartDate(state.selectedDate);
  }, [state?.selectedDate]);

  const handleSaveSchedule = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token || !userId || !startDate || !startTime || !endDate || !endTime) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // start < end 검사
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    if (start >= end) {
      setErrorMsg('시작 시간이 종료 시간보다 같거나 클 수 없습니다.');
      return;
    }

    // calendarId 찾기
    const selectedCalendar = calendarList.find((item) => item.calendarName === calendar);
    if (!selectedCalendar) {
      setErrorMsg('캘린더를 선택해주세요.');
      return;
    }

    const formatDateTime = (date) => {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    };

    const repeatSchedule =
      repeatType === 'NONE'
        ? { repeatType: 'NONE', repeatInterval: 0, repeatEndDate: null }
        : {
            repeatType,
            repeatInterval: repeatInterval || 0,
            repeatEndDate: repeatEndDate ? dayjs(repeatEndDate).format('YYYY-MM-DD') : undefined,
          };

    // 데이터 구성
    const scheduleData = {
      title,
      location: locationInput,
      startTime: formatDateTime(start),
      endTime: formatDateTime(end),
      repeatSchedule,
      memo,
      mentionUserIds: mentionUserIds.length > 0 ? mentionUserIds : [],
    };

    const calendarId = selectedCalendar.calendarId;

    try {
      const response = await axios.post(`${SERVER_URL}/api/v1/schedules?calendarId=${calendarId}`, scheduleData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.isSuccess) {
        alert('일정이 성공적으로 등록되었습니다.');
        navigate('/');
      } else {
        setErrorMsg('일정 등록 실패: 서버 응답 오류');
      }
    } catch (error) {
      if (error.response) {
        console.error('서버 응답:', error.response);
        setErrorMsg(`등록 실패 - ${error.response.status}: ${error.response.data.message || '서버 오류'}`);
      } else {
        setErrorMsg('일정 등록 중 오류 발생');
      }
    }
  };

  const getRepeatTypeText = (type) => {
    switch (type) {
      case 'NONE':
        return '반복 안함';
      case 'DAILY':
        return '매일';
      case 'WEEKLY':
        return '매주';
      case 'MONTHLY':
        return '매월';
      case 'YEARLY':
        return '매년';
      default:
        return type;
    }
  };

  const handleRepeatTypeClick = (type) => {
    setRepeatType(type);
    setRepeatContentDropDown(false); // 드롭박스를 닫음
  };

  return (
    <div>
      <PrevLink to={-1}>이전으로 돌아가기</PrevLink>
      <ScheduleForm onSubmit={handleSaveSchedule}>
        <InputContainer>
          <label>제목</label>
          <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
        </InputContainer>
        <InputContainer>
          <label>장소</label>
          <input type='text' value={locationInput} onChange={(e) => setLocationInput(e.target.value)} />
        </InputContainer>
        <InputContainer>
          <label>일시</label>
          <DateInput>
            <input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type='time' value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <div>-</div>
            <input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <input type='time' value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </DateInput>
        </InputContainer>
        <InputContainer>
          <label>반복 설정</label>
          <RepeatDropDown>
            <button type='button' onClick={() => setRepeatContentDropDown(!repeatContentDropDown)}>
              {getRepeatTypeText(repeatType)}
              {repeatContentDropDown ? <BsChevronDown /> : <BsChevronRight />}
            </button>
            {repeatContentDropDown && (
              <ul>
                <li onClick={() => handleRepeatTypeClick('NONE')}>반복 안함</li>
                <li onClick={() => handleRepeatTypeClick('DAILY')}>매일</li>
                <li onClick={() => handleRepeatTypeClick('WEEKLY')}>매주</li>
                <li onClick={() => handleRepeatTypeClick('MONTHLY')}>매월</li>
                <li onClick={() => handleRepeatTypeClick('YEARLY')}>매년</li>
              </ul>
            )}
          </RepeatDropDown>
          {repeatType !== 'NONE' && (
            <RepeatIntervalContainer>
              <label>반복 간격</label>
              <input
                type='number'
                min={0}
                max={1}
                value={repeatInterval}
                onChange={(e) => setRepeatInterval(Number(e.target.value))}
              />
            </RepeatIntervalContainer>
          )}
          {repeatType !== 'NONE' && (
            <InputContainer>
              <label>반복 종료일</label>
              <input type='date' value={repeatEndDate} onChange={(e) => setRepeatEndDate(e.target.value)} />
            </InputContainer>
          )}
        </InputContainer>
        <InputContainer>
          <label>캘린더</label>
          <CalendarDropDown>
            <button type='button' onClick={() => setShowCalendarDropDown(!showCalendarDropDown)}>
              <div style={{ backgroundColor: colorCategory, width: '20px', height: '20px', marginRight: '10px' }} />
              <div style={{ width: '100%' }}>{calendar || '캘린더를 선택하세요'}</div>
              {showCalendarDropDown ? <BsChevronDown /> : <BsChevronRight />}
            </button>
            {showCalendarDropDown && (
              <ul>
                {calendarList.map((calendarItem) => (
                  <li
                    key={calendarItem.calendarId}
                    onClick={() => {
                      setCalendar(calendarItem.calendarName);
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

        {/* 멘션 유저 선택 (공유 캘린더인 경우에만 표시)
        {showMentionSelect && (
          <InputContainer>
            <label>멘션할 유저</label>
            <MentionsDropDown>
              <button type='button' onClick={() => setShowMentionSelect(!showMentionSelect)}>
                멘션할 유저 {mentionUserIds.length > 0 && `(${mentionUserIds.length})`}
                {showMentionSelect ? <BsChevronDown /> : <BsChevronRight />}
              </button>
              {showMentionSelect && (
                <ul>
                  {mentionUsers.map((user) => (
                    <li
                      key={user.id}
                      onClick={() => handleMentionUserChange}
                      style={{
                        backgroundColor: mentionUserIds.includes(user.id) ? '#e0e0e0' : 'transparent',
                      }}
                    >
                      {user.username}
                    </li>
                  ))}
                </ul>
              )}
            </MentionsDropDown>
          </InputContainer>
        )} */}
        <InputContainer>
          <label>설명</label>
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)}></textarea>
        </InputContainer>
        <ButtonContainer>
          <button type='button' onClick={() => navigate('/')}>
            취소
          </button>
          <button type='submit'>저장</button>
        </ButtonContainer>
      </ScheduleForm>
    </div>
  );
};

export default ScheduleEdit;

const PrevLink = styled(Link)`
  text-decoration: none;
  font-size: var(--font-sm);
  font-weight: bold;
  color: var(--color-main-active);
`;

const ScheduleForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 1px solid var(--color-border);
  padding: 20px 0;
  margin-top: 20px;

  & div:nth-child(7) {
    align-items: start;

    & label {
      margin-top: 8px;
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column; /* 세로로 배치 */
  gap: 10px; /* 항목 간 간격 */
  align-items: flex-start; /* 왼쪽 정렬 */

  & label {
    width: 90px;
    font-size: var(--font-md);
    font-weight: 400;
  }

  & > input {
    border: 1px solid var(--color-border);
    width: 550px;
    height: 30px;
    padding: 0 8px;
    outline: none;
  }

  & button {
    width: 30px;
    height: 30px;
    background: transparent;
    border: none;
    border-top: 1px solid var(--color-border);
    border-right: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  & textarea {
    width: 550px;
    height: 200px;
    resize: none;
    outline: none;
    border: 1px solid var(--color-border);
    padding: 8px;
    overflow-y: auto;
  }
`;

const DateInput = styled.div`
  display: flex;
  gap: 5px;

  & div {
    color: var(--color-border);
    margin-top: 4px;
  }

  & input {
    height: 30px;
    border: 1px solid var(--color-border);
    padding: 0px 8px;
    outline: none;
  }

  & input[type='time'] {
    width: 130px;
  }
`;

const CalendarDropDown = styled.div`
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

const ButtonContainer = styled.div`
  border-top: 1px solid var(--color-border);
  padding-top: 20px;

  & button {
    border: 1px solid var(--color-border);
    padding: 5px 16px;
    background: transparent;
    cursor: pointer;
  }

  & button:hover {
    background: var(--color-bg-hover);
  }

  & button:last-child {
    margin-left: 10px;
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

const MentionsDropDown = styled.div`
  width: 200px;
  position: relative;

  & button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid var(--color-border);
    background: transparent;
    width: 100%;
    padding: 8px 10px;
    font-size: var(--font-sm);
    cursor: pointer;
    text-align: left;
  }

  & ul {
    position: absolute;
    top: 35px;
    width: 100%;
    background: white;
    border: 1px solid var(--color-border);
    z-index: 1;
    max-height: 150px;
    overflow-y: auto;
  }

  & li {
    padding: 8px 10px;
    font-size: var(--font-sm);
    cursor: pointer;
  }

  & li:hover {
    background: var(--color-bg-hover);
    font-weight: 400;
  }

  & li.selected {
    background-color: #e0e0e0;
  }
`;
