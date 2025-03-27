import { createContext, useContext, useReducer, useState } from 'react';

// 초기 상태
const initialState = {
  calendarList: [], // 캘린더 목록 초기화
  selectedCalendarsForMembers: [], // 선택한 캘린더 멤버
  selectedCalendarsForEvents: [], // 선택한 캘린더 이벤트
  selectedCalendar: [], // 선택한 캘린더
};

// Reducer 함수
const calendarReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CALENDAR_LIST':
      return { ...state, calendarList: action.payload };

    case 'CLEAR_CALENDAR_LIST': // 캘린더 리스트 초기화 (로그아웃 시 실행)
      return { ...state, calendarList: [] };

    case 'SET_SELECTED_CALENDARS':
      return { ...state, selectedCalendarsForMembers: action.payload };

    case 'SET_SELECTED_CALENDAR': // 선택한 캘린더 업데이트
      return { ...state, selectedCalendar: action.payload };

    case 'SET_SELECTED_CALENDARS_FOR_EVENTS': // 이벤트 관련 선택된 캘린더 설정
      return { ...state, selectedCalendarsForEvents: action.payload };

    default:
      return state;
  }
};

export const CalendarContext = createContext();

// ✅ Context Provider
export const CalendarProvider = ({ children }) => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);
  // const [calendarList, setCalendarList] = useState([]); //캘린더목록 상태 추가
  // const [selectedCalendar, setSelectedCalendar] = useState([]); // 선택한 캘린더
  // const [selectedCalendarsForEvents, setSelectedCalendarsForEvents] = useState([]);
  // const [selectedCalendarsForMembers, setSelectedCalendarsForMembers] = useState([]);

  return (
    <CalendarContext.Provider
      value={{
        selectedCalendar: state.selectedCalendar,
        dispatch,
        calendarList: state.calendarList,
        selectedCalendarsForEvents: state.selectedCalendarsForEvents,
        selectedCalendarsForMembers: state.selectedCalendarsForMembers,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

// ✅ Custom hook
export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
