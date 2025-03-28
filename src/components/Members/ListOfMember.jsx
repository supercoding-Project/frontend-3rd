import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCalendar } from '../../context/CalendarContext';
import styled from 'styled-components';

const ListOfMember = () => {
  const { selectedCalendarsForMembers } = useCalendar();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]); // 이메일 리스트 상태
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState(''); // 오류 메시지 상태
  const [showModal, setShowModal] = useState(false); // 모달 상태 관리
  const [sharedEmails, setSharedEmails] = useState([]); // 이미 공유된 이메일 리스트

  useEffect(() => {
    if (!selectedCalendarsForMembers || selectedCalendarsForMembers.length === 0) {
      setMembers([]); // 멤버 목록 초기화
      return; // API 호출을 하지 않음
    }

    const fetchMembers = async () => {
      setLoading(true);
      try {
        const calendarId = Array.isArray(selectedCalendarsForMembers)
          ? selectedCalendarsForMembers[0] // 배열이라면 첫 번째 ID를 사용
          : selectedCalendarsForMembers; // 단일 값이면 그대로 사용

        // calendarId가 정의되어 있는지 확인
        if (!calendarId) {
          throw new Error('유효하지 않은 캘린더 ID입니다.');
        }

        const response = await axios.get(
          `http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/api/v1/calendar/${calendarId}/member`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
        setMembers(response.data.data);
        setSharedEmails(response.data.data.map((member) => member.email)); // 이미 공유된 이메일 목록 설정
      } catch (error) {
        console.error('멤버 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [selectedCalendarsForMembers]);

  const handleInvite = async () => {
    if (emails.length === 0) {
      setError('적어도 하나의 이메일을 입력해야 합니다.');
      return;
    }

    // 이미 공유된 이메일을 제외한 이메일 리스트 생성
    const filteredEmails = emails.filter((email) => !sharedEmails.includes(email));

    if (filteredEmails.length === 0) {
      setError('이미 공유된 이메일은 초대할 수 없습니다.');
      return;
    }

    try {
      const calendarId = Array.isArray(selectedCalendarsForMembers)
        ? selectedCalendarsForMembers[0]
        : selectedCalendarsForMembers;

      const response = await axios.post(
        `http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/api/v1/calendar/${calendarId}/send-invite`,
        { emailList: filteredEmails }, // 중복 이메일 제외한 리스트로 초대
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (response.data.isSuccess) {
        alert('초대 이메일을 보냈습니다.');
        setEmails([]); // 이메일 리스트 초기화
        setShowModal(false); // 모달 닫기
        setError(''); // 오류 메시지 초기화
      }
    } catch (error) {
      console.error('초대 실패:', error);
      setError('초대 이메일 전송에 실패했습니다.');
    }
  };

  const handleAddEmail = () => {
    if (!emailInput || !validateEmail(emailInput)) {
      setError('유효한 이메일을 입력해주세요.');
      return;
    }
    setEmails((prevEmails) => [...prevEmails, emailInput]);
    setEmailInput(''); // 이메일 입력 초기화
    setError('');
  };

  const handleDeleteEmail = (emailToDelete) => {
    setEmails((prevEmails) => {
      const updatedEmails = prevEmails.filter((email) => email !== emailToDelete);
      // 중복 이메일을 삭제한 경우, 오류 메시지 초기화
      if (!sharedEmails.includes(emailToDelete) && updatedEmails.length === emails.length - 1) {
        setError('');
      }
      return updatedEmails;
    });
  };

  const validateEmail = (email) => {
    // 간단한 이메일 정규식
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // 모달 외부 클릭 시 모달 닫기 처리
  const handleModalClose = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false); // 모달 닫기
    }
  };

  return (
    <Container>
      <Title>
        멤버 리스트
        <InviteButton onClick={() => setShowModal(true)}>멤버 추가</InviteButton>
      </Title>
      {loading ? (
        <LoadingText>로딩 중...</LoadingText>
      ) : members.length > 0 ? (
        <MemberList>
          {members.map((member) => (
            <MemberItem key={member.email}>
              <div>
                <strong>{member.username}</strong>
              </div>
              <Info>
                {member.email} ({member.role})
              </Info>
            </MemberItem>
          ))}
        </MemberList>
      ) : (
        <LoadingText>선택된 캘린더에 멤버가 없습니다.</LoadingText>
      )}

      {/* 모달 */}
      {showModal && (
        <ModalOverlay onClick={handleModalClose}>
          <ModalContainer>
            <ModalTitle>새 멤버 초대</ModalTitle>
            <ModalInput
              type='email'
              placeholder='초대할 이메일을 입력하세요'
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
            />

            {/* 이메일 리스트 */}
            <EmailList>
              {emails.map((email) => (
                <EmailItem key={email}>
                  <div>{email}</div>
                  <DeleteButton onClick={() => handleDeleteEmail(email)}>X</DeleteButton>
                </EmailItem>
              ))}
            </EmailList>

            {/* 오류 메시지 */}
            {error && <ErrorText>{error}</ErrorText>}

            <ModalButtons>
              <CancelButton onClick={() => setShowModal(false)}>취소</CancelButton>
              <InviteSubmitButton onClick={handleInvite}>초대</InviteSubmitButton>
            </ModalButtons>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default ListOfMember;

const Container = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 40px auto;
`;

const Title = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
  display: flex;
  justify-content: space-between;
`;

const InviteButton = styled.button`
  height: 30px;
  background-color: var(--color-main-active);
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.01;
  &:hover {
    background-color: var(--color-bg-primary);
    color: black;
  }
`;

const MemberList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin-top: 10px;
`;

const MemberItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  color: #555;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const Info = styled.div`
  font-size: 14px;
  color: #777;
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #888;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease-out;
`;

const ModalTitle = styled.h3`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
  font-weight: 600;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: var(--color-main-active);
  }
`;

const EmailList = styled.div`
  display: flex;
  flex-direction: column; /* 이메일들을 세로로 나열 */
  justify-content: flex-start;
  margin-left: 30px;
  margin-bottom: 10px;
  font-size: 16px;
  color: #444;
`;

const EmailItem = styled.div`
  display: block; /* 항목을 블록 형태로 만들어 세로로 나열되게 */
  margin-bottom: 10px;
  font-size: 16px;
  color: #444;
  display: flex;
  gap: 10px;
`;

const DeleteButton = styled.button`
  font-size: small;
  background-color: #ff4747;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff2a2a;
  }
`;

const InviteSubmitButton = styled.button`
  height: 30px;
  width: 55px;
  font-size: small;
  font-weight: bolder;
  background-color: var(--color-main-active);
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.01;
  &:hover {
    background-color: var(--color-bg-primary);
    color: black;
  }
`;

const ModalButtons = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const CancelButton = styled.button`
  height: 30px;
  width: 55px;
  font-size: small;
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e0e0e0;
  }
`;
