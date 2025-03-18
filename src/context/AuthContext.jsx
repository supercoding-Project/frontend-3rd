import React, { createContext, useReducer, useEffect } from 'react';

// 1. 초기 상태
const initialState = {
  user: null,
  isAuthenticated: false,
  token: null, // JWT 토큰을 추가
};

// 2. Reducer 함수
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, token: null, isAuthenticated: false };
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
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      dispatch({ type: 'LOGIN', payload: { user: JSON.parse(storedUser), token: storedToken } });
    }
  }, []);

  const login = (userData) => {
    // 가짜 JWT 토큰 생성 (실제 환경에서는 백엔드에서 받음)
    const fakeToken = 'fake-jwt-token-1234567890';

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', fakeToken);
    dispatch({ type: 'LOGIN', payload: { user: userData, token: fakeToken } });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>;
};
