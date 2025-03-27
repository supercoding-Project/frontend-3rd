import { useState, useEffect } from 'react';
import axios from 'axios';
import { BsChevronDown, BsChevronRight, BsPlusLg } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080';

const ScheduleEdit = () => {
  const navigate = useNavigate();
  const [showCalendarDropDown, setShowCalendarDropDown] = useState(false);
  const [calendar, setCalendar] = useState('');
  const [calendarList, setCalendarList] = useState([]);
  const [colorCategory, setColorCategory] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [memo, setMemo] = useState('');
  const [mentionUserIds, setMentionUserIds] = useState([]);
  const [repeatType, setRepeatType] = useState('');
  const [repeatInterval, setRepeatInterval] = useState(0);
  const [repeatEndDate, setRepeatEndDate] = useState('');
  const [userId, setUserId] = useState(null);

  // 유저 ID 가져오기
  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('❌ 토큰이 없습니다. 다시 로그인하세요.');
        return;
      }

      try {
        const response = await axios.get(
          'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/api/v1/mypage',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('✅ 유저 정보:', response.data);
        if (response.data.isSuccess) {
          setUserId(response.data.data.id); // 유저 ID 설정
        } else {
          console.error('❌ 유저 정보를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('❌ 유저 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchUserId();
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행

  // 캘린더 목록 불러오기
  useEffect(() => {
    const fetchCalendars = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('❌ 토큰이 없습니다. 다시 로그인하세요.');
        return;
      }

      try {
        const response = await axios.get(`${SERVER_URL}/api/v1/calendars`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.isSuccess) {
          setCalendarList(response.data.data); // 캘린더 목록 상태 업데이트
        } else {
          console.error('❌ 캘린더 목록을 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('❌ 캘린더 목록 불러오기 실패:', error);
      }
    };

    fetchCalendars();
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행

  const handleSaveSchedule = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('❌ 토큰이 없습니다. 다시 로그인하세요.');
      return;
    }

    if (!userId) {
      console.error('❌ 유저 ID가 없습니다.');
      return;
    }

    if (!startDate || !startTime || !endDate || !endTime) {
      alert('❌ 모든 필드를 입력해주세요');
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`).toISOString().split('.')[0]; // 밀리초 제거
    const endDateTime = new Date(`${endDate}T${endTime}`).toISOString().split('.')[0]; // 밀리초 제거

    console.log('✅ 시작 시간:', startDateTime);
    console.log('✅ 종료 시간:', endDateTime);

    const scheduleData = {
      createUserId: userId,
      calendarId: calendarList.find((item) => item.calendarName === calendar)?.calendarId || 1,
      title,
      location,
      startTime: startDateTime,
      endTime: endDateTime,
      repeatSchedule: repeatType
        ? {
            repeatType,
            repeatInterval,
            repeatEndDate,
          }
        : null,
      memo,
      mentionUserIds: mentionUserIds.length > 0 ? mentionUserIds : [0],
    };

    try {
      const response = await axios.post(`${SERVER_URL}/api/v1/schedules`, scheduleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.isSuccess) {
        alert('✅ 일정이 성공적으로 등록되었습니다.');
        navigate('/');
      } else {
        alert('❌ 일정 등록 실패');
      }
    } catch (error) {
      console.error('❌ 일정 등록 실패:', error);
      if (error.response) {
        alert(`❌ 오류: ${error.response.data}`);
      } else {
        alert('❌ 네트워크 오류가 발생했습니다.');
      }
    }
  };

  const handleCancel = () => {
    navigate('/'); // 취소하면 메인 페이지로 돌아가기
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
          <input type='text' value={location} onChange={(e) => setLocation(e.target.value)} />
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
          <label>참석자</label>
          <input
            type='text'
            value={mentionUserIds.join(', ')}
            onChange={(e) => setMentionUserIds(e.target.value.split(', '))}
          />
          <button type='button'>
            <BsPlusLg />
          </button>
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
        <InputContainer>
          <label>설정</label>
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)}></textarea>
        </InputContainer>
        <ButtonContainer>
          <button type='button' onClick={handleCancel}>
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
  color: black;
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
  align-items: center;

  & label {
    width: 80px;
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
    font-size: var(--font-md);
    padding: 0 8px;
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
    font-size: var(--font-md);
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

const ColorCategoryDropDown = styled.div`
  width: 200px;
  position: relative;

  & button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border: 1px solid var(--color-border);
    background: transparent;
    font-size: var(--font-md);
    padding: 0 8px;
    cursor: pointer;
  }

  & button svg {
    width: 10px;
    height: 10px;
  }

  & ul {
    width: 500px;
    padding: 8px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    position: absolute;
    top: 35px;
    border: 1px solid var(--color-border);
    background: white;
    z-index: 1;
  }

  & li {
    display: flex;
    cursor: pointer;
  }

  & li div:last-child {
    flex-grow: 1;
    height: 15px;
    background: var(--color-bg-primary);
  }

  & li:hover div:last-child {
    background: var(--color-bg-hover);
  }
`;

const ColorBox = styled.div`
  background: ${({ $bgColor }) => $bgColor};
  width: 15px;
  height: 15px;
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
