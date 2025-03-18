import { useState } from 'react';
import Month from '../../components/Calendar/Month';
import Week from '../../components/Calendar/Week';
import Day from '../../components/Calendar/Day';
import styled from 'styled-components';

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
        <TabButton $selected={selected === 'month'}>
          <button onClick={() => handleSelectButton('month')}>월간</button>
        </TabButton>
        <TabButton $selected={selected === 'week'}>
          <button onClick={() => handleSelectButton('week')}>주간</button>
        </TabButton>
        <TabButton $selected={selected === 'day'}>
          <button onClick={() => handleSelectButton('day')}>일간</button>
        </TabButton>
      </Tab>

      {calendar[selected]}
    </>
  );
};

export default Home;

const Tab = styled.ul`
  display: flex;
  gap: 30px;
`;

const TabButton = styled.li`
  position: relative;

  & button {
    font-weight: bold;
    border: none;
    background: transparent;
    font-size: var(--font-md);
    color: ${({ $selected }) => ($selected ? 'var(--color-main-active)' : 'var(--color-main-inactive)')};
    padding: 0;
    cursor: pointer;
  }

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -15px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 15px;
    background-color: var(--color-border);
  }
`;
