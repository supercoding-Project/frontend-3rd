import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import userProfileImg from '/Basic-User-Img.png';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const MyInfo = () => {
  const { updateUser } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: userProfileImg,
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const baseUrl = apiUrl ? `${apiUrl}/api` : '/api';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const [pwVisible, setPwVisible] = useState(false);
  const [newPwVisible, setNewPwVisible] = useState(false);
  const [confirmPwVisible, setConfirmPwVisible] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${baseUrl}/v1/mypage`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        const data = response.data?.data;
        if (data) {
          setUserInfo({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            profileImage: data.userImageUrl || userProfileImg,
          });
        }
      } catch (error) {
        console.error('유저 정보 불러오기 실패:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUserInfo((prev) => ({
        ...prev,
        profileImage: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordSubmit = async (data) => {
    try {
      const response = await axios.put(
        `${baseUrl}/v1/mypage/password?oldPassword=${encodeURIComponent(data.currentPassword)}&newPassword=${encodeURIComponent(data.newPassword)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      alert('✅ 비밀번호가 변경되었습니다.');
      reset();
    } catch (error) {
      console.error('비밀번호 변경 실패:', error.response?.data || error);
      alert('🚨 비밀번호 변경 실패');
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('access_token');

      if (userInfo.profileImage.startsWith('data:image')) {
        const blob = await (await fetch(userInfo.profileImage)).blob();
        const formData = new FormData();
        formData.append('image', blob, 'profile.jpg');

        await axios.put(`${baseUrl}/v1/mypage/profileImage`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      const response = await axios.put(
        `${baseUrl}/v1/mypage`,
        {
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.isSuccess) {
        updateUser(response.data.data);
        alert('✅ 회원 정보가 수정되었습니다.');
      } else {
        alert('🚨 회원 정보 수정 실패');
      }
    } catch (error) {
      console.error('회원 정보 수정 오류:', error);
      alert('🚨 오류가 발생했습니다.');
    }
  };

  return (
    <Container>
      <Title>회원 정보 수정</Title>
      <ProfileSection>
        <ProfileImage
          src={
            userInfo.profileImage.startsWith('http') || userInfo.profileImage.startsWith('data')
              ? userInfo.profileImage
              : `${apiUrl}${userInfo.profileImage}`
          }
          alt='profile'
          onError={(e) => (e.target.src = userProfileImg)}
        />
        <UploadButton htmlFor='profileUpload'>프로필 이미지 변경</UploadButton>
        <input
          id='profileUpload'
          type='file'
          accept='image/*'
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />

        <Label>이름</Label>
        <Input value={userInfo.name} onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} />

        <Label>핸드폰 번호</Label>
        <Input value={userInfo.phone} onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })} />

        <Label>이메일</Label>
        <DisabledInput value={userInfo.email} disabled />

        <SectionDivider />
        <TitleSmall>비밀번호 변경</TitleSmall>

        <Label>현재 비밀번호</Label>
        <PasswordWrapper>
          <Input
            type={pwVisible ? 'text' : 'password'}
            placeholder='현재 비밀번호'
            {...register('currentPassword', {
              required: '현재 비밀번호를 입력해주세요.',
              minLength: {
                value: 8,
                message: '8자리 이상 입력해주세요.',
              },
            })}
          />
          {pwVisible ? <CloseEye onClick={() => setPwVisible(false)} /> : <Eye onClick={() => setPwVisible(true)} />}
        </PasswordWrapper>
        {errors.currentPassword && <ErrorMsg>{errors.currentPassword.message}</ErrorMsg>}

        <Label>새 비밀번호</Label>
        <PasswordWrapper>
          <Input
            type={newPwVisible ? 'text' : 'password'}
            placeholder='새 비밀번호'
            {...register('newPassword', {
              required: '새 비밀번호를 입력해주세요.',
              minLength: {
                value: 8,
                message: '8자리 이상 입력해주세요.',
              },
            })}
          />
          {newPwVisible ? (
            <CloseEye onClick={() => setNewPwVisible(false)} />
          ) : (
            <Eye onClick={() => setNewPwVisible(true)} />
          )}
        </PasswordWrapper>
        {errors.newPassword && <ErrorMsg>{errors.newPassword.message}</ErrorMsg>}

        <Label>새 비밀번호 확인</Label>
        <PasswordWrapper>
          <Input
            type={confirmPwVisible ? 'text' : 'password'}
            placeholder='비밀번호 확인'
            {...register('confirmPassword', {
              required: '비밀번호 확인은 필수입니다.',
              validate: (val) => val === watch('newPassword') || '비밀번호가 일치하지 않습니다.',
            })}
          />
          {confirmPwVisible ? (
            <CloseEye onClick={() => setConfirmPwVisible(false)} />
          ) : (
            <Eye onClick={() => setConfirmPwVisible(true)} />
          )}
        </PasswordWrapper>
        {errors.confirmPassword && <ErrorMsg>{errors.confirmPassword.message}</ErrorMsg>}

        <SaveButton onClick={handleSubmit(handlePasswordSubmit)}>비밀번호 변경</SaveButton>
        <SaveButton onClick={handleUpdate}>저장</SaveButton>
      </ProfileSection>
    </Container>
  );
};

export default MyInfo;

// const Container = styled.div`
//   max-width: 600px;
//   margin: 0 auto;
//   padding: 2rem;
// `;

// const Title = styled.h2`
//   font-size: 1.8rem;
//   margin-bottom: 1.5rem;
//   text-align: center;
// `;

// const TitleSmall = styled.h3`
//   font-size: 1.3rem;
//   font-weight: bold;
//   color: var(--color-main-active);
//   margin: 2rem 0 1rem;
// `;

// const ProfileSection = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;

// const ProfileImage = styled.img`
//   width: 120px;
//   height: 120px;
//   border-radius: 50%;
//   object-fit: cover;
//   margin-bottom: 1rem;
// `;

// const UploadButton = styled.label`
//   cursor: pointer;
//   background-color: #6c63ff;
//   color: white;
//   padding: 0.5rem 1rem;
//   border-radius: 20px;
//   font-size: 0.9rem;
//   margin-bottom: 1rem;
// `;

// const Label = styled.label`
//   width: 100%;
//   font-weight: bold;
//   margin-top: 1rem;
//   color: var(--color-main-active);
//   font-size: 1rem;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 10px;
//   margin-top: 0.4rem;
//   border: 1px solid #ddd;
//   border-radius: 5px;
//   font-size: 1rem;

//   &:focus {
//     border: 2px solid var(--color-main-active);
//     outline: none;
//   }

//   &::placeholder {
//     color: #aaa;
//   }
// `;

// const DisabledInput = styled(Input)`
//   background-color: #f5f5f5;
// `;

// const SaveButton = styled.button`
//   width: 100%;
//   padding: 10px;
//   background: var(--color-main-active);
//   color: white;
//   font-size: 1rem;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   transition: 0.3s;

//   &:hover {
//     background-color: var(--color-bg-primary);
//     color: black;
//   }
// `;

// const SectionDivider = styled.hr`
//   width: 100%;
//   margin: 2rem 0;
//   border: none;
//   border-top: 1px solid #eee;
// `;

// const PasswordWrapper = styled.div`
//   width: 100%;
//   position: relative;
// `;

// const Eye = styled(AiFillEye)`
//   position: absolute;
//   top: 50%;
//   right: 12px;
//   transform: translateY(-50%);
//   width: 20px;
//   height: 20px;
//   fill: gray;
//   cursor: pointer;
// `;

// const CloseEye = styled(AiFillEyeInvisible)`
//   position: absolute;
//   top: 50%;
//   right: 12px;
//   transform: translateY(-50%);
//   width: 20px;
//   height: 20px;
//   fill: gray;
//   cursor: pointer;
// `;

// const ErrorMsg = styled.small`
//   color: red;
//   font-size: 0.8rem;
//   margin-top: 5px;
//   align-self: flex-start;
// `;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
`;

const TitleSmall = styled.h3`
  font-size: 1.3rem;
  margin: 2rem 0 1rem;
  font-weight: 600;
  color: #34495e;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 4px solid #6c63ff;
`;

const UploadButton = styled.label`
  cursor: pointer;
  background: linear-gradient(to right, #6c63ff, #7e68f7);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(to right, #574b90, #6c63ff);
  }
`;

const Label = styled.label`
  width: 100%;
  font-weight: 600;
  margin-top: 1rem;
  color: #2c3e50;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: 0.2s ease;

  &:focus {
    border-color: #6c63ff;
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
    outline: none;
  }
`;

const DisabledInput = styled(Input)`
  background-color: #f0f0f0;
  cursor: not-allowed;
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SaveButton = styled.button`
  margin-top: 2rem;
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(to right, #4caf50, #43a047);
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(to right, #388e3c, #2e7d32);
  }
`;

const SectionDivider = styled.hr`
  width: 100%;
  margin: 2rem 0;
  border: none;
  border-top: 1px solid #e0e0e0;
`;

const Eye = styled(AiFillEye)`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
`;

const CloseEye = styled(AiFillEyeInvisible)`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
`;

const ErrorMsg = styled.small`
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.4rem;
  align-self: flex-start;
`;
