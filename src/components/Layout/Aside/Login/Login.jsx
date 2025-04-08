import React, { useState } from 'react';
import styled from 'styled-components';
import LoginModal from '../../../common/LoginModal';
import SignUpModal from '../../../common/SignUpModal';

const Login = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignupModal, setOpenSignupModal] = useState(false);

  const handleLoginModal = () => {
    setOpenLoginModal(true);
  };

  const handleSignupModal = () => {
    setOpenSignupModal(true);
  };
  return (
    <PanelContainer>
      <ButtonContainer>
        <LogInButton onClick={handleLoginModal}>Log In</LogInButton>
        {openLoginModal ? <LoginModal setOpenLoginModal={setOpenLoginModal} /> : null}
        <SignUpButton onClick={handleSignupModal}>Sign Up</SignUpButton>
        {openSignupModal ? <SignUpModal setOpenSignupModal={setOpenSignupModal} /> : null}
      </ButtonContainer>
    </PanelContainer>
  );
};

export default Login;

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px 20px;
  border-bottom: 1px solid var(--color-border);
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogInButton = styled.button`
  margin: 10px;
  padding-bottom: 5px;
  border-radius: 50px;
  font-size: var(--font-md);
  height: 35px;
  width: 100px;
  border: none;
  background-color: var(--color-main-active);
  color: white;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    background-color: var(--color-bg-primary);
    color: black;
  }
`;

const SignUpButton = styled.button`
  margin: 10px;
  border-radius: 50px;
  padding-bottom: 5px;
  height: 35px;
  width: 100px;
  font-size: var(--font-md);
  border: none;
  background-color: var(--color-bg-primary);
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    background-color: var(--color-main-active);
    color: white;
  }
`;
