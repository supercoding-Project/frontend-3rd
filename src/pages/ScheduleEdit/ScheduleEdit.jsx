import { useRef, useState } from 'react';
import { BsChevronDown, BsChevronRight, BsPlusLg } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ScheduleEdit = () => {
  const [showCalendarDropDown, setShowCalendarDropDown] = useState(false);
  const [calendar, setCalendar] = useState('내 캘린더');
  const [showColorCategoryDropDown, setShowColorCategoryDropDown] = useState(false);
  const [colorCategory, setColorCategory] = useState('#E36B15');

  const calendarDropDownRef = useRef();

  const calendars = ['내 캘린더', '공유 캘린더', '할 일'];

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

  const handleShowCalendarDropDown = (e) => {
    setShowCalendarDropDown(!showCalendarDropDown);
  };

  const handleShowColorCategoryDropDown = () => {
    setShowColorCategoryDropDown(!showColorCategoryDropDown);
  };

  return (
    <div>
      <PrevLink to={-1}>이전으로 돌아가기</PrevLink>

      <ScheduleForm>
        <InputContainer>
          <label>제목</label>
          <input type='text' />
        </InputContainer>
        <InputContainer>
          <label>장소</label>
          <input type='text' />
        </InputContainer>
        <InputContainer>
          <label>일시</label>
          <DateInput>
            <input type='date' />
            <input type='time' />
            <div>-</div>
            <input type='date' />
            <input type='time' />
          </DateInput>
        </InputContainer>
        <InputContainer>
          <label>참석자</label>
          <input type='text' />
          <button type='button'>
            <BsPlusLg />
          </button>
        </InputContainer>
        <InputContainer>
          <label>캘린더</label>
          <CalendarDropDown ref={calendarDropDownRef}>
            <button type='button' onClick={handleShowCalendarDropDown}>
              <span>{calendar}</span>
              {showCalendarDropDown ? <BsChevronDown /> : <BsChevronRight />}
            </button>
            {showCalendarDropDown && (
              <ul>
                {calendars.map((calendar) => (
                  <li key={calendar}>{calendar}</li>
                ))}
              </ul>
            )}
          </CalendarDropDown>
        </InputContainer>
        <InputContainer>
          <label>범주</label>
          <ColorCategoryDropDown>
            <button type='button' onClick={handleShowColorCategoryDropDown}>
              <ColorBox $bgColor={colorCategory}></ColorBox>
              {showColorCategoryDropDown ? <BsChevronDown /> : <BsChevronRight />}
            </button>
            {showColorCategoryDropDown && (
              <ul>
                {colors.map((color) => (
                  <li key={color}>
                    <ColorBox $bgColor={color}></ColorBox>
                    <div></div>
                  </li>
                ))}
              </ul>
            )}
          </ColorCategoryDropDown>
        </InputContainer>
        <InputContainer>
          <label>설정</label>
          <textarea></textarea>
        </InputContainer>
        <ButtonContainer>
          <button type='button'>취소</button>
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
