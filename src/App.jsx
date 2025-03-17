import { Route, Routes } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import Layout from './components/Layout/Layout';
import Home from './pages/home/Home';
import { AuthProvider } from './context/AuthContext';
import MyPage from './pages/myPage/MyPage';

const App = () => {
  return (
    <AuthProvider>
      <GlobalStyle />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/myPage' element={<MyPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
