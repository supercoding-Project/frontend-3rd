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
      return { ...state, user: action.payload.user, access_token: action.payload.token, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, access_token: null, isAuthenticated: false };
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
    const storedToken = localStorage.getItem('access_token');
    if (storedUser && storedToken) {
      dispatch({ type: 'LOGIN', payload: { user: JSON.parse(storedUser), token: storedToken } });
    }
  }, []);

  useEffect(() => {
    console.log('Auth State:', state); // 상태 확인
  }, [state]);

  const login = (userData) => {
    const { username, email, access_token } = userData;

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('access_token', access_token);
    dispatch({ type: 'LOGIN', payload: { user: userData, access_token: access_token } });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    dispatch({ type: 'LOGOUT' });
  };

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>;
};
