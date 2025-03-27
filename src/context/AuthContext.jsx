import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { useCalendar } from './CalendarContext'; // useCalendar 훅을 통해 CalendarContext 사

// 1. 초기 상태
const initialState = {
  user: null,
  isAuthenticated: false,
  access_token: null,
  refresh_token: null,
};

// 2. Reducer 함수
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        access_token: action.payload.access_token,
        refresh_token: action.payload.refresh_token,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return { ...state, user: null, access_token: null, isAuthenticated: false, refresh_token: null };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

// 3. Context 생성
export const AuthContext = createContext();

// 4. Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  //const { dispatch: calendarDispatchFunc } = useContext(CalendarContext); // ✅ useContext로 CalendarContext 사용
  const { dispatch: calendarDispatch } = useCalendar(); // useCalendar 훅으로 calendarDispatch 가져오기

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAccessToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');
    if (storedUser && storedAccessToken && storedRefreshToken) {
      dispatch({
        type: 'LOGIN',
        payload: { user: JSON.parse(storedUser), access_token: storedAccessToken, refresh_token: storedRefreshToken },
      });
    }
  }, []);

  useEffect(() => {
    console.log('Auth State:', state); // 상태 확인
  }, [state]);

  const login = (userData) => {
    const { username, email, access_token, profileImage } = userData;

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('access_token', access_token);
    dispatch({ type: 'LOGIN', payload: { user: userData, access_token } });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    dispatch({ type: 'LOGOUT' });
    // 캘린더 리스트 초기화
    calendarDispatch({ type: 'CLEAR_CALENDAR_LIST' });
    // // calendarDispatchFunc가 존재할 때만 실행
    // if (calendarDispatchFunc) {
    //   calendarDispatchFunc({ type: 'CLEAR_CALENDAR_LIST' });
    // }
  };

  const updateUser = (updatedUser) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: updatedUser,
    });
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>{children}</AuthContext.Provider>;
};
