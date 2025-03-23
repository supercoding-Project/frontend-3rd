import React from 'react';

const ListOfMember = ({ members }) => {
  return (
    <div>
      멤버 리스트
      <ul>
        {members.length > 0 ? (
          members.map((member) => (
            <li key={member.id}>
              {member.name}({member.email})
            </li>
          ))
        ) : (
          <li>선택된 캘린더가 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

export default ListOfMember;
