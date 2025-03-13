import { Route, Routes } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import AddCalendar from './pages/AddCalendar/AddCalendar';

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/add-calendar' element={<AddCalendar />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
