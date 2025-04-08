import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const DEFAULT_PROFILE_IMAGE = '/Basic-User-Img.png';

const SignUpModal = ({ setOpenSignupModal }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isSubmitted, errors },
  } = useForm();

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [emailError, setEmailError] = useState(null);

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      setOpenSignupModal(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setProfileImage(file);
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

  const handleConfirmPwCheck = () => {
    setConfirmPwCheck(() => {
      if (!confirmPwCheck.value) {
        return { type: 'text', value: true };
      }
      return {
        type: 'password',
        value: false,
      };
    });
  };

  const handleDuplicateCheck = async (email) => {
    try {
      const res = await axios.post('/api/check-email', { email });
      if (res.data.data === '사용 가능한 이메일입니다.') {
        setIsEmailChecked(true);
        setEmailError(null);
        console.log(res.data);
        alert('✅ ' + res.data.data);
      } else {
        console.log(res.data);
        alert('🚨' + res.data.data);
        setIsEmailChecked(false);
      }
    } catch (error) {
      console.error(error);
      setEmailError('🚨이메일 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const onSubmit = async (data) => {
    if (!isEmailChecked) {
      alert('🚨 이메일 중복 확인을 해주세요');
      return;
    }

    console.log(data);
    const formData = new FormData();
    const dto = {
      email: data.email,
      password: data.password,
      username: data.name,
      phone: data.phoneNumber,
    };

    formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    if (profileImage) {
      formData.append('image', profileImage);
    }
    try {
      await axios.post('/api/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('회원가입이 완료되었습니다.');
      setOpenSignupModal(false);
    } catch (error) {
      console.error(error);
      alert('🚨회원가입 중 오류가 발생했습니다. 다시 시도하여 주십시오.');
    }
  };

  const [pwCheck, setPwCheck] = useState({
    type: 'password',
    value: false,
  });

  const [confirmPwCheck, setConfirmPwCheck] = useState({
    type: 'password',
    value: false,
  });

  return (
    <Overlay onClick={handleCloseModal}>
      <ModalContainer>
        <SignupContainer>Sign Up</SignupContainer>
        <LoginForm onSubmit={handleSubmit(onSubmit)}>
          <ProfileImageContainer>
            <ProfileImage src={previewImage} alt='Profile Preview' />
            <ImageUploadLabel htmlFor='profileImage'>프로필 이미지 업로드</ImageUploadLabel>
            <input id='profileImage' type='file' style={{ display: 'none' }} onChange={handleImageChange} />
          </ProfileImageContainer>
          <ContentDiv>
            <Input
              id='name'
              type='text'
              placeholder='이름을 입력하세요.'
              aria-invalid={isSubmitted ? (errors.name ? 'true' : 'false') : undefined}
              {...register('name', {
                required: '🚨이름은 필수 입력입니다.',
              })}
            />
            {errors.name && <ErrorMsg role='alert'>{errors.name.message}</ErrorMsg>}
          </ContentDiv>
          <ContentDiv>
            <Input
              id='phoneNumber'
              type='text'
              placeholder='ex) 010-1234-5678'
              aria-invalid={isSubmitted ? (errors.phoneNumber ? 'true' : 'false') : undefined}
              {...register('phoneNumber', {
                required: '🚨핸드폰번호는 필수 입력입니다.',
                pattern: {
                  value: /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/,
                  message: '🚨 010-1234-5678 형식으로 입력해주세요.',
                },
                minLength: {
                  value: 13,
                  message: '🚨핸드폰 번호가 정확하지 않습니다. ',
                },
                maxLength: {
                  value: 13,
                  message: '🚨핸드폰 번호가 정확하지 않습니다. ',
                },
              })}
            />
            {errors.phoneNumber && <ErrorMsg role='alert'>{errors.phoneNumber.message}</ErrorMsg>}
          </ContentDiv>
          <EmailContentDiv>
            <EmailInputWrapper>
              <Input
                id='email'
                type='text'
                placeholder='Email을 입력하세요.'
                aria-invalid={isSubmitted ? (errors.email ? 'true' : 'false') : undefined}
                {...register('email', {
                  required: '🚨Email은 필수 입력입니다.',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: '🚨Email 형식에 맞지 않습니다.',
                  },
                })}
              />
              <DupCheckBtn onClick={() => handleDuplicateCheck(watch('email'))}>중복 확인</DupCheckBtn>
            </EmailInputWrapper>
            {errors.email && <ErrorMsg role='alert'>{errors.email.message}</ErrorMsg>}
          </EmailContentDiv>
          <ContentDiv>
            <Input
              id='password'
              type={pwCheck.type}
              placeholder='비밀번호를 입력하세요.'
              aria-invalid={isSubmitted ? (errors.password ? 'true' : 'false') : undefined}
              {...register('password', {
                required: '🚨비밀번호는 필수 입력입니다.',
                minLength: {
                  value: 8,
                  message: '🚨8자리 이상 비밀번호를 입력하세요. ',
                },
              })}
            />
            {!pwCheck.value ? <Eye onClick={handlePwCheck} /> : <CloseEye onClick={handlePwCheck} />}
            {errors.password && <ErrorMsg role='alert'>{errors.password.message}</ErrorMsg>}
          </ContentDiv>
          <ContentDiv>
            <Input
              id='passwordCheck'
              type={confirmPwCheck.type}
              placeholder='비밀번호를 한번 더 입력하세요.'
              aria-invalid={isSubmitted ? (errors.passwordCheck ? 'true' : 'false') : undefined}
              {...register('passwordCheck', {
                required: '🚨비밀번호 확인은 필수 입력입니다.',
                minLength: {
                  value: 8,
                  message: '🚨8자리 이상 비밀번호를 입력하세요. ',
                },
                validate: (value) => value === watch('password') || '🚨비밀번호가 일치하지 않습니다.',
              })}
            />
            {!confirmPwCheck.value ? (
              <Eye onClick={handleConfirmPwCheck} />
            ) : (
              <CloseEye onClick={handleConfirmPwCheck} />
            )}
            {errors.passwordCheck && <ErrorMsg role='alert'>{errors.passwordCheck.message}</ErrorMsg>}
          </ContentDiv>

          <SubmitBtn type='submit' disabled={isSubmitting}>
            Sign Up
          </SubmitBtn>
        </LoginForm>
      </ModalContainer>
    </Overlay>
  );
};

export default SignUpModal;

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
  width: 480px;
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

const ContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  position: relative;
`;

const EmailContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  margin-left: 95px;
  gap: 10px;
`;

const EmailInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const DupCheckBtn = styled.button`
  height: 40px;
  padding: 0 10px;
  margin-left: 10px;
  border: none;
  background-color: var(--color-main-active);
  color: white;
  font-size: 0.8rem;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: var(--color-bg-primary);
    color: black;
  }
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
  font-size: var(--font-sm);
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
  font-size: var(--font-md);
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

const Eye = styled(AiFillEye)`
  cursor: pointer;
  width: 20px;
  height: 20px;
  margin: auto;
  position: absolute;
  fill: gray;
  right: 10px;
  top: 20px;
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
  top: 20px;
  transform: translateY(-50%);
`;

const ErrorMsg = styled.small`
  font-size: 12px;
  margin-top: 5px;
`;

const ProfileImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  background: var(--color-bg-secondary);
  padding: 20px;
  border-radius: 10px;
  width: 400px;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid var(--color-main-active);
  object-fit: cover;
`;

const ImageUploadLabel = styled.label`
  background: var(--color-main-active);
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: 0.3s;
  text-align: center;

  &:hover {
    background-color: var(--color-bg-primary);
    color: black;
  }
`;
