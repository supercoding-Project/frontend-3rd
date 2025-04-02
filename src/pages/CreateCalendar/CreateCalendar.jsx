import { useRef, useState } from 'react';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { useCalendar } from '../../context/CalendarContext';
import styled from 'styled-components';

const CreateCalendar = () => {
  const { calendarList, dispatch } = useCalendar();
  const [showCalendarDropDown, setShowCalendarDropDown] = useState(false);
  const [showColorCategoryDropDown, setShowColorCategoryDropDown] = useState(false);
  const [colorCategory, setColorCategory] = useState(''); // 선택된 색상 상태
  const [calendarName, setCalendarName] = useState('');
  const [calendarDescription, setCalendarDescription] = useState('');
  const [selectedCalendarLabel, setSelectedCalendarLabel] = useState('내 캘린더'); // 화면에 표시할 label
  const [calendar, setCalendar] = useState('PERSONAL'); // API에 보낼 value 값
  const navigate = useNavigate();

  const calendarDropDownRef = useRef();

  const calendars = [
    { label: '내 캘린더', value: 'PERSONAL' },
    { label: '공유 캘린더', value: 'SHARED' },
    { label: '할 일', value: 'TODO' },
  ];

  const colors = [
    '#E36B15',
    '#F5A623',
    '#17A589',
    '#145A32',
    '#1F7A8C',
    '#3B5998',
    '#AE81FF',
    '#7D3C98',
    '#5D6D7E',
    '#6E2C00',
  ];

  const handleShowCalendarDropDown = () => {
    setShowCalendarDropDown(!showCalendarDropDown);
  };

  const handleShowColorCategoryDropDown = () => {
    setShowColorCategoryDropDown(!showColorCategoryDropDown);
  };

  // const handleCalendarChange = (calendarValue) => {
  //   setCalendar(calendarValue);
  //   setShowCalendarDropDown(false);
  // };

  const handleColorChange = (colorValue) => {
    setColorCategory(colorValue);
    setShowColorCategoryDropDown(false);
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleCalendarChange = (calendarLabel, calendarValue) => {
    setSelectedCalendarLabel(calendarLabel); // UI에서 표시할 label 저장
    setCalendar(calendarValue); // API 요청 시 사용할 value 저장
    setShowCalendarDropDown(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    const dto = {
      calendarName: calendarName,
      calendarType: calendar,
      calendarDescription: calendarDescription,
      calendarColor: colorCategory, // 선택된 색상 값 추가
    };

    console.log('보낼 데이터:', dto); // 확인용 로그

    try {
      const response = await fetch('http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      if (response.ok) {
        const data = await response.json();
        alert('캘린더가 생성되었습니다!');
        dispatch({ type: 'SET_CALENDAR_LIST', payload: [...calendarList, data.data] });
        navigate('/'); // 성공 시 리디렉션
      } else {
        console.error('Error creating calendar');
        // Error handling: 서버가 에러를 반환하면 여기서 처리
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 채팅방 생성 API 호출
  const createChatRoom = async (calendarId) => {
    try {
      const response = await fetch(
        `http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080/api/v1/chat/room/create/${calendarId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (response.ok) {
        const chatRoomData = await response.json();
        console.log('채팅방 생성 완료:', chatRoomData);
      } else {
        console.error('채팅방 생성 실패');
      }
    } catch (error) {
      console.error('채팅방 생성 에러:', error);
    }
  };

  return (
    <div>
      <PrevLink to={-1}>이전으로 돌아가기</PrevLink>

      <ScheduleForm onSubmit={submit}>
        <InputContainer $bgColor={colorCategory}>
          <label>캘린더명</label>
          <input type='text' id='calendarName' value={calendarName} onChange={(e) => setCalendarName(e.target.value)} />
          <ColorCategoryDropDown>
            <button type='button' onClick={handleShowColorCategoryDropDown}>
              <ColorBox $bgColor={colorCategory} /> {/* 선택한 색상 표시 */}
              색상변경
            </button>
            {showColorCategoryDropDown && (
              <ul>
                {colors.map((color) => (
                  <li key={color} onClick={() => handleColorChange(color)}>
                    <ColorBox $bgColor={color}></ColorBox>
                  </li>
                ))}
              </ul>
            )}
          </ColorCategoryDropDown>
        </InputContainer>

        <InputContainer>
          <label>캘린더타입</label>
          <CalendarDropDown ref={calendarDropDownRef}>
            <button id='calendarType' type='button' onClick={handleShowCalendarDropDown}>
              <span>{selectedCalendarLabel}</span> {/* UI에는 label을 표시 */}
              {showCalendarDropDown ? <BsChevronDown /> : <BsChevronRight />}
            </button>
            {showCalendarDropDown && (
              <ul>
                {calendars.map((calendar) => (
                  <li key={calendar.value} onClick={() => handleCalendarChange(calendar.label, calendar.value)}>
                    {calendar.label} {/* UI에 표시할 값 */}
                  </li>
                ))}
              </ul>
            )}
          </CalendarDropDown>
        </InputContainer>

        <InputContainer>
          <label>캘린더 설명</label>
          <textarea
            id='calendarDescription'
            value={calendarDescription}
            onChange={(e) => setCalendarDescription(e.target.value)}
          />
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

export default CreateCalendar;

const PrevLink = styled(Link)`
  text-decoration: none;
  font-size: var(--font-sm);
  color: var(--color-main-active);
  font-weight: bold;
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
    width: 100px;
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
    margin-left: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px; /* 컬러박스와 텍스트 간격 */
    width: 100px;
    height: 30px;
    border: 1px solid var(--color-border);
    font-size: var(--font-sm);
    cursor: pointer;
  }

  & ul {
    width: 100px;
    padding: 8px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    position: absolute;
    top: 35px;
    border: 1px solid var(--color-border);
    background: white;
    z-index: 1;
  }

  & li {
    display: flex;
    justify-content: center;
    cursor: pointer;
  }
`;

const ColorBox = styled.div`
  background: ${({ $bgColor }) => $bgColor || '#ccc'}; /* 기본값 추가 */
  width: 15px;
  height: 15px;
  border-radius: 50%; /* 원형으로 변경 */
  border: 1px solid var(--color-border); /* 경계선 추가 */
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
