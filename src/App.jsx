import { Route, Routes } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import Layout from './components/Layout/Layout';
import Home from './pages/home/Home';
import Notifications from './components/Notifications/Notifications';
import Toast from './components/Notifications/Toast';

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Toast />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/notifications' element={<Notifications />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
