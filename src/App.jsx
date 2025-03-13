import { Route, Routes } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import ScheduleEdit from './pages/ScheduleEdit/ScheduleEdit';

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/schedule-edit' element={<ScheduleEdit />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
