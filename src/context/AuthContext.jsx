import React, { createContext, useReducer, useEffect } from 'react';

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
  };

  const updateUser = (updatedUser) => {
    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          ...state.user, // 기존 유저 정보 유지
          ...updatedUser, // 업데이트된 정보 덮어쓰기
        },
        access_token: state.access_token,
        refresh_token: state.refresh_token,
      },
    });

    // localStorage도 업데이트
    localStorage.setItem('user', JSON.stringify({ ...state.user, ...updatedUser }));
  };

  return <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>{children}</AuthContext.Provider>;
};
