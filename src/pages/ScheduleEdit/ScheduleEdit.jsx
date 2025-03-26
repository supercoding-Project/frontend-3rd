import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BsArrowRepeat } from 'react-icons/bs';
import { useEffect, useRef, useState } from 'react';

const ScheduleEdit = () => {
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [currentCalendarDropdownOption, setCurrentCalendarDropdownOption] = useState('내 캘린더');
  const [currentColorDropdownOption, setCurrentColorDropdownOption] = useState('#E36B15');

  const navigate = useNavigate();

  const calendarDropdownRef = useRef(null);
  const colorDropdownRef = useRef(null);

  const calendarOptions = ['내 캘린더', '공유 캘린더', '할 일'];
  const colorOptions = [
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

  const handleOpenCalendarDropdown = () => {
    setShowCalendarDropdown((prevShowCalendarDropdown) => !prevShowCalendarDropdown);
  };

  const handleChangeCalendarDropdownOption = (event) => {
    setCurrentCalendarDropdownOption(event.target.innerHTML);
  };

  const handleOpenColorDropdown = () => {
    setShowColorDropdown((prevShowColorDropdown) => !prevShowColorDropdown);
  };

  const handleChangeColorDropdownOption = (event) => {
    setCurrentColorDropdownOption(event.target.innerHTML);
  };

  const handleClickOutside = (event) => {
    if (calendarDropdownRef.current && !calendarDropdownRef.current.contains(event.target)) {
      setShowCalendarDropdown(false);
    }
    if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target)) {
      setShowColorDropdown(false);
    }
  };

  const handleClickCancelButton = () => {
    const confirm = window.confirm('정말 취소하시겠습니까?');

    if (confirm) {
      navigate('/');
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <Container>
      <Nav>
        <Link to={-1}>이전으로 돌아가기</Link>
      </Nav>

      <SchedulesForm>
        <FromGroup>
          <label>제목</label>
          <input type='text' />
        </FromGroup>
        <FromGroup>
          <label>장소</label>
          <input type='text' />
        </FromGroup>
        <FromGroup>
          <label>일시</label>
          <DateTimeGroup>
            <input type='date' />
            <input type='time' />
            <span>-</span>
            <input type='date' />
            <input type='time' />
          </DateTimeGroup>
          <SchedulesRepeatButton type='button'>
            <BsArrowRepeat />
            <span>반복</span>
          </SchedulesRepeatButton>
        </FromGroup>
        <FromGroup>
          <label>참석자</label>
          <input type='text' />
        </FromGroup>
        <FromGroup>
          <label>캘린더</label>
          <Dropdown onClick={handleOpenCalendarDropdown} ref={calendarDropdownRef}>
            <CalendarDropdownTrigger $isOpen={showCalendarDropdown}>
              <span>{currentCalendarDropdownOption}</span>
            </CalendarDropdownTrigger>
            {showCalendarDropdown && (
              <CalendarDropdownMenu>
                {calendarOptions.map((option) => (
                  <CalendarDropdownItem key={option} onClick={handleChangeCalendarDropdownOption}>
                    {option}
                  </CalendarDropdownItem>
                ))}
              </CalendarDropdownMenu>
            )}
          </Dropdown>
        </FromGroup>
        <FromGroup>
          <label>범주</label>
          <Dropdown onClick={handleOpenColorDropdown} ref={colorDropdownRef}>
            <ColorDropdownTrigger $isOpen={showColorDropdown} $color={currentColorDropdownOption}>
              <span>{currentColorDropdownOption}</span>
            </ColorDropdownTrigger>
            {showColorDropdown && (
              <ColorDropdownMenu>
                {colorOptions.map((option) => (
                  <ColorDropdownItem key={option} $color={option} onClick={handleChangeColorDropdownOption}>
                    {option}
                  </ColorDropdownItem>
                ))}
              </ColorDropdownMenu>
            )}
          </Dropdown>
        </FromGroup>
        <FromGroup>
          <label>설명</label>
          <textarea></textarea>
        </FromGroup>
        <ButtonGroup>
          <button type='button' onClick={handleClickCancelButton}>
            취소
          </button>
          <button type='submit'>저장</button>
        </ButtonGroup>
      </SchedulesForm>
    </Container>
  );
};

export default ScheduleEdit;

const Container = styled.div``;

const Nav = styled.nav`
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 20px;

  & a {
    font-size: var(--font-sm);
    color: black;
  }
`;

const SchedulesForm = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FromGroup = styled.div`
  display: flex;

  & label {
    font-size: var(--font-md);
    font-weight: bold;
    width: 100px;
    margin-top: 6px;
  }

  & input,
  textarea {
    width: 665px;
    border: 1px solid var(--color-border);
    outline: none;
    padding: 5px;

    &:focus {
      border-color: var(--color-main-active);
    }
  }

  & input {
    height: 30px;
  }

  & textarea {
    height: 200px;
    resize: none;
    overflow-y: auto;
  }
`;

const DateTimeGroup = styled.div`
  width: 600px;
  display: flex;
  align-items: center;
  gap: 5px;

  & input {
    width: 100%;
  }
`;

const SchedulesRepeatButton = styled.button`
  width: 60px;
  height: 30px;
  margin-left: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: none;
  background: var(--color-bg-primary);
  cursor: pointer;

  &:hover {
    background: var(--color-main-active);
    color: white;
  }
`;

const Dropdown = styled.div`
  width: 200px;
  height: 30px;
  border: 1px solid var(--color-border);
  font-size: var(--font-sm);
  position: relative;
`;

const CalendarDropdownTrigger = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
  font-weight: 400;
  cursor: pointer;

  &::after {
    content: '';
    display: block;
    width: 5px;
    height: 5px;
    border-top: 1px solid black;
    border-right: 1px solid black;
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(135deg)' : 'rotate(45deg)')};
    margin-right: 2px;
    margin-bottom: ${({ $isOpen }) => ($isOpen ? '5px' : '2px')};
  }
`;

const CalendarDropdownMenu = styled.ul`
  width: 100%;
  border: 0.5px solid black;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  background: white;
  z-index: 1;
  position: absolute;
  top: 28px;
`;

const CalendarDropdownItem = styled.li`
  height: 30px;
  display: flex;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    font-weight: 400;
    background: var(--color-bg-hover);
  }
`;

const ColorDropdownTrigger = styled(CalendarDropdownTrigger)`
  & span {
    width: 90px;
    height: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-primary);
    border-left: 15px solid ${({ $color }) => $color};
  }
`;

const ColorDropdownMenu = styled(CalendarDropdownMenu)`
  width: 500px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
`;

const ColorDropdownItem = styled.li`
  height: 15px;
  width: calc((100% - 4 * 10px) / 5);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-primary);
  border-left: 15px solid ${({ $color }) => $color};
  cursor: pointer;

  &:hover {
    font-weight: 400;
    background: var(--color-bg-hover);
  }
`;

const ButtonGroup = styled.div`
  border-top: 1px solid var(--color-border);
  padding-top: 20px;
  display: flex;
  gap: 10px;

  & button {
    border: none;
    background: var(--color-bg-primary);
    height: 30px;
    padding: 0px 16px;
    cursor: pointer;
  }

  & button:first-child:hover {
    background: var(--color-bg-hover);
  }

  & button:last-child:hover {
    background: var(--color-main-active);
    color: white;
  }
`;
