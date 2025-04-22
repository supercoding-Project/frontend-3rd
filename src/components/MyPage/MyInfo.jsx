import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import userProfileImg from '/Basic-User-Img.png';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const MyInfo = () => {
  const { updateUser } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    email: '',
    profileImage: userProfileImg,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const baseUrl = 'http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080';

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/api/v1/mypage', {
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
        } else {
          console.error('유저 정보 응답 구조 이상');
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

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return alert('모든 비밀번호 항목을 입력해주세요.');
    }

    if (newPassword !== confirmPassword) {
      return alert('새 비밀번호가 일치하지 않습니다.');
    }

    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/mypage/password?oldPassword=${encodeURIComponent(currentPassword)}&newPassword=${encodeURIComponent(newPassword)}`,
        {}, // 바디 없음!
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      console.log('비밀번호 변경 성공:', response.data);
      alert('비밀번호가 성공적으로 변경되었습니다!');
    } catch (error) {
      console.error('비밀번호 변경 오류:', error.response?.data || error);
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('access_token');

      if (userInfo.profileImage.startsWith('data:image')) {
        const blob = await (await fetch(userInfo.profileImage)).blob();
        const formData = new FormData();
        formData.append('image', blob, 'profile.jpg');

        await axios.put('/api/v1/mypage/profileImage', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      const response = await axios.put(
        '/api/v1/mypage',
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
              : `${baseUrl}${userInfo.profileImage}`
          }
          alt='profile'
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
        <Input
          type='password'
          value={passwords.currentPassword}
          onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
        />

        <Label>새 비밀번호</Label>
        <Input
          type='password'
          value={passwords.newPassword}
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
        />

        <Label>새 비밀번호 확인</Label>
        <Input
          type='password'
          value={passwords.confirmPassword}
          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
        />

        <SaveButton onClick={handlePasswordChange}>비밀번호 변경</SaveButton>
        <SaveButton onClick={handleUpdate}>저장</SaveButton>
      </ProfileSection>
    </Container>
  );
};

export default MyInfo;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const TitleSmall = styled.h3`
  font-size: 1.3rem;
  margin: 1.5rem 0 1rem;
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
`;

const UploadButton = styled.label`
  cursor: pointer;
  background-color: #6c63ff;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  width: 100%;
  font-weight: bold;
  margin-top: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const DisabledInput = styled(Input)`
  background-color: #f5f5f5;
`;

const SaveButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.7rem 1.5rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #45a049;
  }
`;

const SectionDivider = styled.hr`
  width: 100%;
  margin: 2rem 0;
  border: none;
  border-top: 1px solid #eee;
`;
