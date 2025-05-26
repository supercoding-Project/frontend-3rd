import React from 'react';
import BaseModal from './BaseModal';

const ScheduleEditModal = ({ schedule, onClose }) => {
  return (
    <BaseModal onClose={onClose}>
      <div>
        <h3>{schedule.title}</h3>
        {/* 폼 요소 등등 */}
        <button onClick={onClose}>닫기</button>
      </div>
    </BaseModal>
  );
};

export default ScheduleEditModal;
