import { Route, Routes, useLocation } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import Layout from './components/Layout/Layout';
import Home from './pages/home/Home';
import Notifications from './components/Notifications/Notifications';
import Toast from './components/Notifications/Toast';
import ChatList from './components/Chat/ChatList';

const App = () => {
  const location = useLocation();
  const hideToastPages = ['/chat-list']; // 토스트 알림 안 뜨게 할 페이지 목록
  return (
    <>
      <GlobalStyle />
      {!hideToastPages.includes(location.pathname) && <Toast />}
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/notifications' element={<Notifications />} />
        </Route>
        <Route path='/chat-list' element={<ChatList />} />
      </Routes>
    </>
  );
};

export default App;
