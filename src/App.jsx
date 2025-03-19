import { Route, Routes, useLocation } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import Layout from './components/Layout/Layout';
import Home from './pages/home/Home';
import { AuthProvider } from './context/AuthContext';
import MyPage from './pages/myPage/MyPage';
import Notifications from './components/Notifications/Notifications';
import Toast from './components/Notifications/Toast';
import ChatList from './components/Chat/ChatList';
import ScheduleEdit from './pages/ScheduleEdit/ScheduleEdit';
import MemberList from './pages/Members/MemberList';

const App = () => {
  const location = useLocation();
  const hideToastPages = ['/chat-list']; // 토스트 알림 안 뜨게 할 페이지 목록
  return (
    <AuthProvider>
      <GlobalStyle />
      {!hideToastPages.includes(location.pathname) && <Toast />}
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/myPage' element={<MyPage />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/schedule-edit' element={<ScheduleEdit />} />
          <Route path='/members' element={<MemberList />} />
        </Route>
        <Route path='/chat-list' element={<ChatList />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
