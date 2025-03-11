import { useState } from 'react';
import Tab from '../../components/Tab/Tab';
import TabButton from '../../components/Tab/TabButton';
import Month from '../../components/Calendar/Month';
import Week from '../../components/Calendar/Week';
import Day from '../../components/Calendar/Day';

const Home = () => {
  const [selected, setSelected] = useState('month');

  const calendar = {
    month: <Month />,
    week: <Week />,
    day: <Day />,
  };

  const handleSelectButton = (selectedButton) => {
    setSelected(selectedButton);
  };

  return (
    <>
      <Tab>
        <TabButton selected={selected === 'month'} onClick={() => handleSelectButton('month')}>
          Month
        </TabButton>
        <TabButton selected={selected === 'week'} onClick={() => handleSelectButton('week')}>
          Week
        </TabButton>
        <TabButton selected={selected === 'day'} onClick={() => handleSelectButton('day')}>
          Day
        </TabButton>
      </Tab>

      {calendar[selected]}
    </>
  );
};

export default Home;
