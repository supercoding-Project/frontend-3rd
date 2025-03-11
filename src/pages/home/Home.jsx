import styled from 'styled-components';
import { BsPlusLg } from 'react-icons/bs';
import { useState } from 'react';
import Month from '../../components/Calendar/Month';
import Week from '../../components/Calendar/Week';
import Day from '../../components/Calendar/Day';

const Home = () => {
  const [selected, setSelected] = useState(0);

  const handleSelectTabButton = (selectedButton) => {
    setSelected(selectedButton);
  };

  return (
    <>
      <Container>
        <Tab>
          <li>
            <TabButton $fontWeight={selected === 0} onClick={() => handleSelectTabButton(0)}>
              Month
            </TabButton>
          </li>
          <li>
            <TabButton $fontWeight={selected === 1} onClick={() => handleSelectTabButton(1)}>
              Week
            </TabButton>
          </li>
          <li>
            <TabButton $fontWeight={selected === 2} onClick={() => handleSelectTabButton(2)}>
              Day
            </TabButton>
          </li>
        </Tab>

        <AddEventButton>
          <BsPlusLg />
          <span>New</span>
        </AddEventButton>
      </Container>

      {[<Month />, <Week />, <Day />][selected]}
    </>
  );
};

export default Home;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 35px;
`;

const Tab = styled.ul`
  width: 200px;
  display: flex;
  justify-content: space-between;

  & li {
    position: relative;
  }

  & li:nth-child(1)::after,
  li:nth-child(2)::after {
    content: '';
    display: block;
    height: 15px;
    border: 0.5px solid var(--color-text-disabled);
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(17px, -50%);
  }
`;

const TabButton = styled.button`
  border: none;
  padding: 0;
  background: transparent;
  font-size: var(--font-lg);
  color: ${({ $fontWeight }) => ($fontWeight ? 'var(--color-text-primary)' : 'var(--color-text-disabled)')};
  cursor: pointer;
`;

const AddEventButton = styled.button`
  border: none;
  background: var(--color-main-active);
  color: var(--color-text-secondary);
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: var(--font-lg);
  padding: 5px 15px 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;
