import { createContext, useContext, useState } from 'react';

const CalendarContext = createContext();

// ✅ Context Provider
export const CalendarProvider = ({ children }) => {
  const [selectedCalendar, setSelectedCalendar] = useState([]); // 선택한 캘린더
  //const [events, setEvents] = useState([]); // 일정 데이터
  const [calendarList, setCalendarList] = useState([]); //캘린더목록 상태 추가

  // const fetchEvent = async () => {
  //   if (!selectedCalendar.length) {
  //     setEvents([]); // 선택한 캘린더가 없으면 빈 배열 유지
  //     return;
  //   }

  //   try {
  //     // 캘린더 ID를 쉼표(,)로 구분하여 쿼리 파라미터로 전달
  //     const calendarIds = selectedCalendar.join(',');
  //     const response = await fetch(`http://localhost:8080/api/events?calendarIds=${calendarIds}`);

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch events');
  //     }

  //     const data = await response.json();
  //     setEvents(data);
  //   } catch (error) {
  //     console.error('Error fetching events:', error);
  //   }
  // };

  // // ✅ 컴포넌트가 마운트될 때 이벤트 로드
  // useEffect(() => {
  //   fetchEvent();
  // }, []);

  return (
    <CalendarContext.Provider value={{ selectedCalendar, setSelectedCalendar, calendarList, setCalendarList }}>
      {children}
    </CalendarContext.Provider>
  );
};

// ✅ Custom hook
export const useCalendar = () => {
  return useContext(CalendarContext);
};
