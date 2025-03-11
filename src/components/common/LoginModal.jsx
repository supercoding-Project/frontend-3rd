import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { AuthContext } from '../../context/AuthContext';

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

const LoginContainer = styled.div`
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
  border-radius: 10px;
  border: 1px solid #ddd;
  padding: 10px;
  transition: 0.1s;
  &:focus {
    border: 2px solid var(--color-main-active);
    outline: none;
  }
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

const Separator = styled.div`
  display: flex;
  align-items: center;
  width: 320px;
  margin: 15px 0 15px 10px;
  font-size: 0.8rem;
  color: gray;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: lightgray;
    margin: 0 10px;
  }
`;

const SocialLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  cursor: pointer;
`;

const GoogleLoginIcon = styled(FcGoogle)`
  display: flex;
  width: 38px;
  height: 38px;
  border-radius: 20px;
  padding: 5px;
  background-color: #f1f1f1;
  cursor: pointer;
`;

const KakaoLoginIcon = styled(RiKakaoTalkFill)`
  display: flex;
  width: 38px;
  height: 38px;
  border-radius: 20px;
  background-color: #ffd429;
  padding: 5px;
`;

const LoginModal = ({ setOpenLoginModal }) => {
  const { login } = useContext(AuthContext);
  const [pwCheck, setPwCheck] = useState({
    type: 'password',
    value: false,
  });
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      setOpenLoginModal(false);
    }
  };

  const handleEmailInput = (e) => {
    const email = e.target.value;
    setEnteredEmail(email);
    console.log(enteredEmail);
  };

  const handlePasswordInput = (e) => {
    const password = e.target.value;
    setEnteredPassword(password);
    console.log(enteredPassword);
  };

  const handlePwCheck = () => {
    setPwCheck(() => {
      if (!pwCheck.value) {
        return { type: 'text', value: true };
      }
      return { type: 'password', value: false };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { email: enteredEmail, password: enteredPassword };
    login(userData); // login 함수 호출, 가짜 JWT 토큰 사용
    setOpenLoginModal(false);
  };
  return (
    <Overlay onClick={handleCloseModal}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <LoginContainer>Log In</LoginContainer>
        <LoginForm onSubmit={handleSubmit}>
          <EmailDiv>
            {/* <Label htmlFor='email'>Email</Label> */}
            <Input type='text' onChange={handleEmailInput} placeholder='Email' />
          </EmailDiv>
          <PasswordDiv>
            {/* <Label htmlFor='password'>Password</Label> */}
            <Input type={pwCheck.type} onChange={handlePasswordInput} placeholder='Password' />
            {!pwCheck.value ? <Eye onClick={handlePwCheck} /> : <CloseEye onClick={handlePwCheck} />}
          </PasswordDiv>
          <SubmitBtn type='submit'>Log In</SubmitBtn>
        </LoginForm>
        <Separator> 또는</Separator>
        <SocialLoginContainer>
          <GoogleLoginIcon />
          <KakaoLoginIcon />
        </SocialLoginContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default LoginModal;
