import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { AuthContext } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const LoginModal = ({ setOpenLoginModal }) => {
  const { login } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitted, errors },
  } = useForm();

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

  const onSubmit = async (data) => {
    // await new Promise((r) => setTimeout(r, 1000));
    // const userData = { email: data.email, password: data.password };
    // login(userData); // login 함수 호출, 가짜 JWT 토큰 사용
    // setOpenLoginModal(false);
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || 'http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080';
      const res = await axios.post(`${apiUrl}/api/login`, {
        email: data.email,
        password: data.password,
      });

      console.log(res);

      const { isSuccess, data: responseData } = res.data;

      if (isSuccess) {
        const { access_token, refresh_token, username, email, profileImage } = responseData;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user', JSON.stringify({ username, email, profileImage }));

        //로그인 상태를 AuthContext에 반영
        login({ username, email, access_token, profileImage });
        alert(responseData.message + '🎉'); //로그인 성공하였습니다.
        setOpenLoginModal(false);
      } else {
        alert('🚨 로그인 실패하였습니다.');
      }
    } catch (error) {
      console.error(error);
      console.log(data);
      alert('🚨 로그인 실패하였습니다.');
    }
  };
  return (
    <Overlay onClick={handleCloseModal}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <LoginContainer>Log In</LoginContainer>
        <LoginForm onSubmit={handleSubmit(onSubmit)}>
          <EmailDiv>
            <Input
              type='text'
              id='email'
              onChange={handleEmailInput}
              placeholder='Email'
              aria-invalid={isSubmitted ? (errors.email ? 'true' : 'false') : undefined}
              {...register('email', {
                required: '🚨이메일은 필수 입력입니다.',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: '🚨이메일 형식에 맞지 않습니다.',
                },
              })}
            />
            {errors.email && <ErrorMsg role='alert'>{errors.email.message}</ErrorMsg>}
          </EmailDiv>
          <PasswordDiv>
            <Input
              id='password'
              type={pwCheck.type}
              onChange={handlePasswordInput}
              placeholder='Password'
              aria-invalid={isSubmitted ? (errors.password ? 'true' : 'false') : undefined}
              {...register('password', {
                required: '🚨비밀번호는 필수 입력입니다.',
                minLength: {
                  value: 8,
                  message: '🚨8자리 이상 비밀번호를 입력하세요. ',
                },
              })}
            />
            {errors.password && <ErrorMsg role='alert'>{errors.password.message}</ErrorMsg>}
            {!pwCheck.value ? <Eye onClick={handlePwCheck} /> : <CloseEye onClick={handlePwCheck} />}
          </PasswordDiv>
          <SubmitBtn type='submit' disabled={isSubmitting}>
            Log In
          </SubmitBtn>
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
  font-size: var(--font-md);
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
  font-size: var(--font-md);
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

const ErrorMsg = styled.small`
  font-size: 12px;
  margin-top: 10px;
`;
