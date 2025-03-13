import Tab from '../../components/Tab/Tab';
import TabButton from '../../components/Tab/TabButton';
import { useSelect } from '../../hooks/useSelect';

const AddCalendar = () => {
  const [selected, handleSelectButton] = useSelect('event');

  return (
    <div>
      <Tab>
        <TabButton selected={selected === 'event'} onClick={() => handleSelectButton('event')}>
          일정
        </TabButton>
        <TabButton selected={selected === 'todo'} onClick={() => handleSelectButton('todo')}>
          할 일
        </TabButton>
      </Tab>
    </div>
  );
};

export default AddCalendar;
