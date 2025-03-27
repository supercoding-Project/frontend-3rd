// 이미 캘린더에 가입 되어있는 경우 채팅창에 못들어가서 잠깐 각주처리

import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const JoinPage = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!inviteCode) {
      setError('초대 코드를 입력하세요.');
      return;
    }

    setLoading(true);
    try {
      // **캘린더 가입 요청 부분을 주석 처리**
      // const response = await axios.post(
      //   'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/api/v1/calendar/join',
      //   { inviteCode },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem('access_token')}`, // 인증 토큰을 헤더에 추가
      //     },
      //   }
      // );

      // **캘린더 가입이 이미 되어있다는 전제로 진행**

      // 채팅방 가입 요청
      const chatRoomResponse = await axios.post(
        'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/api/v1/chat/room/join',
        { inviteCode }, // 초대 코드로 채팅방 가입
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // 인증 토큰을 헤더에 추가
          },
        }
      );

      if (chatRoomResponse.data.isSuccess) {
        // 채팅방 가입 성공 메시지 콘솔에 출력
        console.log('✅ 채팅방 가입 성공:', chatRoomResponse.data.data);
        navigate('/'); // 채팅방 가입 후 메인 페이지로 이동
      } else {
        console.error('❌ 채팅방 가입 실패:', chatRoomResponse.data.errorCode);
        setError('채팅방 가입 실패: ' + chatRoomResponse.data.errorCode);
      }
    } catch (error) {
      console.error('초대 코드 확인 실패:', error);
      setError(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Form>
        <Title>초대 코드 입력</Title>
        <Input
          type='text'
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          placeholder='초대 코드를 입력하세요'
        />
        {error && <ErrorText>{error}</ErrorText>}
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? '로딩 중...' : '가입'}
        </Button>
      </Form>
    </Container>
  );
};

export default JoinPage;

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--color-bg-primary);
`;

const Form = styled.div`
  background-color: var(--color-text-secondary);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: var(--font-xl);
  font-weight: 600;
  color: var(--color-main-active); /* 보라색 계열 */
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: var(--font-md);
  border-radius: 8px;
  border: 1px solid var(--color-border); /* 회색 테두리 */
  margin-bottom: 15px;
  outline: none;

  &:focus {
    border-color: var(--color-main-active);
    box-shadow: 0 0 5px rgba(106, 121, 248, 0.3); /* 보라색 포커스 */
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: var(--color-main-active); /* 보라색 */
  color: var(--color-text-secondary);
  font-size: var(--font-md);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5b6bef; /* 보라색 어두운 버전 */
  }

  &:disabled {
    background-color: var(--color-main-inactive); /* 비활성화 시 색상 */
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: #e74c3c; /* 오류 메시지 빨간색 */
  font-size: var(--font-sm);
  margin-bottom: 15px;
`;
