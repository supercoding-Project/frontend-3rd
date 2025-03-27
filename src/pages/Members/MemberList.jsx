import React from 'react';
import MemberTitle from '../../components/Members/MemberTitle';
import ListOfMember from '../../components/Members/ListOfMember';
import { useCalendar } from '../../context/CalendarContext';

const mockMembers = {
  1: [
    { id: 101, name: '영서', email: 'test@test.com' },
    { id: 102, name: '소리', email: 'test2@google.com' },
    { id: 103, name: '영욱', email: 'test3@naver.com' },
  ],
  2: [{ id: 201, name: '슈퍼코딩', email: 'supercoding@google.com' }],
};

const MemberList = () => {
  const { selectedCalendar } = useCalendar();
  return (
    <div>
      <MemberTitle />
      <ListOfMember members={selectedCalendar ? mockMembers[selectedCalendar] : []} />
    </div>
  );
};

export default MemberList;
