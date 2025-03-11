import React, { useState } from 'react';
import styled from 'styled-components';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  width: 380px;
  padding: 20px;
  border-radius: 8px;
  box-shadow:
    0 3px 6px rgba(0, 0, 0, 0.16),
    0 3px 6px rgba(0, 0, 0, 0.23);
  position: relative;
`;

const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  font-weight: bolder;
  font-size: 1.8rem;
`;

const EmailDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const PasswordDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  position: relative;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const Input = styled.input`
  width: 250px;
  height: 40px;
  border: 1px solid #ddd;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 16px;
  transition: 0.1s;
  &:focus {
    border: 2px solid var(--color-main-active);
    outline: none;
  }
`;

const SubmitBtn = styled.button`
  margin-top: 15px;
  width: 250px;
  height: 40px;
  border-radius: 10px;
  background-color: var(--color-main-active);
  transition: 0.5ms;
  color: var(--color-text-secondary);
  border: none;
  &:hover {
    background-color: var(--color-bg-primary);
    color: black;
    border: 1px solid lightgray;
  }
`;

const PwContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  border: 1px solid #ddd; /* 전체 컨테이너 테두리 */
  border-radius: 10px;
  overflow: hidden; /* border-radius 적용 */
  padding: 10px;
  position: relative;
  transition: 0.5ms;
  &:focus-within {
    border: 2px solid var(--color-main-active);
    outline: none;
  }
`;

const PwInput = styled.input`
  border: none;
  outline: none;
  padding: 7px;
  //  font-size: 1rem;
  color: #333;
  background: transparent;
  border-radius: 10px;
  transition: 0.1s;
  &:focus {
    outline: none;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #ddd; /* 입력 필드 사이 경계선 */
`;

const Eye = styled(AiFillEye)`
  cursor: pointer;
  width: 20px;
  height: 20px;
  margin: auto;
  position: absolute;
  fill: gray;
  right: 10px;
  top: 22px;
  transform: translateY(-50%);
`;

const CloseEye = styled(AiFillEyeInvisible)`
  cursor: pointer;
  width: 20px;
  height: 20px;
  margin: auto;
  position: absolute;
  fill: gray;
  right: 10px;
  top: 22px;
  transform: translateY(-50%);
`;

const SignUpModal = ({ setOpenSignupModal }) => {
  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      setOpenSignupModal(false);
    }
  };

  const handlePwCheck = () => {
    setPwCheck(() => {
      if (!pwCheck.value) {
        return { type: 'text', value: true };
      }
      return { type: 'password', value: false };
    });
  };
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwCheck, setPwCheck] = useState({
    type: 'password',
    value: false,
  });
  return (
    <Overlay onClick={handleCloseModal}>
      <ModalContainer>
        <SignupContainer>Sign Up</SignupContainer>
        <LoginForm>
          <EmailDiv>
            <Input type='text' placeholder='Name' />
          </EmailDiv>
          <EmailDiv>
            <Input type='text' placeholder='Email' />
          </EmailDiv>
          <PwContainer>
            <PwInput
              type={pwCheck.type}
              placeholder='비밀번호'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!pwCheck.value ? <Eye onClick={handlePwCheck} /> : <CloseEye onClick={handlePwCheck} />}
            <Divider />
            <PwInput
              type={pwCheck.type}
              placeholder='비밀번호 확인'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </PwContainer>
          <SubmitBtn type='submit'>Sign Up</SubmitBtn>
        </LoginForm>
      </ModalContainer>
    </Overlay>
  );
};

export default SignUpModal;
