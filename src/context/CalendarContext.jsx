import { Children, createContext, useContext, useState } from 'react';

const CalendarContext = createContext();

//Context provider
export const CalendarProvider = ({ children }) => {
  const [selectedCalendar, setSelectedCalendar] = useState(null);

  return (
    <CalendarContext.Provider value={{ selectedCalendar, setSelectedCalendar }}>{children}</CalendarContext.Provider>
  );
};

//Custom hook
export const useCalendar = () => {
  return useContext(CalendarContext);
};
