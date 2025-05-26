import React from 'react';
import BaseModal from './BaseModal';

const ScheduleDetailModal = ({ schedule, onClose }) => {
  return (
    <BaseModal onClose={onClose}>
      <h3>{schedule.title}</h3>
      <p>시작: {schedule.startTime}</p>
      <p>종료: {schedule.endTime}</p>
      <p>설명: {schedule.description}</p>
      <button onClick={onClose}>닫기</button>
    </BaseModal>
  );
};

export default ScheduleDetailModal;
