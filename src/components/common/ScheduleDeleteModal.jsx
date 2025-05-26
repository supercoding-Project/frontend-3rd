import React from 'react';
import BaseModal from './BaseModal';

// ScheduleDeleteModal.jsx
const ScheduleDeleteModal = ({ schedule, onClose, onDelete }) => {
  return (
    <BaseModal onClose={onClose}>
      <div>
        <h3>{schedule.title} 삭제하시겠습니까?</h3>
        <button onClick={onDelete}>삭제</button>
        <button onClick={onClose}>취소</button>
      </div>
    </BaseModal>
  );
};

export default ScheduleDeleteModal;
