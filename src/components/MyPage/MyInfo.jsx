import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import userProfileImg from '/Basic-User-Img.png';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 50px;
  color: var(--color-text-primary);
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bolder;
  margin-bottom: 20px;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  background: var(--color-bg-secondary);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 400px;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid var(--color-main-active);
  object-fit: cover;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    border: 2px solid var(--color-main-active);
    outline: none;
  }
`;

const Label = styled.label`
  width: 100%;
  font-weight: bold;
  margin-bottom: 5px;
  color: var(--color-main-active);
  font-size: 1rem;
`;

const UploadButton = styled.label`
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

const SaveButton = styled.button`
  width: 100%;
  padding: 10px;
  background: var(--color-main-active);
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: var(--color-bg-primary);
    color: black;
  }
`;

const MyInfo = () => {
  // const [name, setName] = useState('김하진');
  // const [email, setEmail] = useState('hajin.kim27@example.com');
  // const [phoneNumber, setPhoneNumber] = useState('010-1234-5678');
  // const [profileImage, setProfileImage] = useState(userProfileImg);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    profileImage: userProfileImg,
  });

  // 🔹 로그인한 유저 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('access_token');
        console.log('저장된 토큰:', token);
        if (!token) {
          console.error('❌ 토큰이 없습니다. 다시 로그인하세요.');
          return;
        }
        const response = await axios.get(
          'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/api/v1/mypage',
          {
            headers: {
              Authorization: `Bearer ${token}`, // JWT 토큰 포함
            },
          }
        );
        console.log('✅ 응답 데이터:', response.data);
        setUserInfo({
          name: response.data.name,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          profileImage: response.data.profileImage || userProfileImg,
        });
      } catch (error) {
        console.error('유저 정보를 불러오는 중 오류 발생:', error);
        if (error.response) {
          console.log('🔴 서버 응답 상태 코드:', error.response.status);
          console.log('🔴 서버 응답 데이터:', error.response.data);
        }
      }
    };

    fetchUserInfo();
  }, []);

  // 프로필 이미지 변경 핸들러
  const handleImageChange = (e) => {
    // const file = e.target.files[0];
    // if (file) {
    //   const imageUrl = URL.createObjectURL(file);
    //   setProfileImage(imageUrl);
    // }
    const file = e.target.files[0];
    if (file) {
      console.log('선택된 파일:', file);
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('변환된 이미지 URL:', reader.result);
        setUserInfo((prevState) => ({
          ...prevState,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 정보 저장 핸들러
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userInfo.name);
      formData.append('phoneNumber', userInfo.phoneNumber);

      // 프로필 이미지가 변경되었을 경우 추가
      if (userInfo.profileImage !== userProfileImg) {
        formData.append('profileImage', userInfo.profileImage);
      }

      await axios.put('http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/api/v1/mypage', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('회원 정보가 수정되었습니다.');
    } catch (error) {
      console.error('유저 정보 수정 오류:', error);
      alert('🚨 회원 정보 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container>
      <Title>회원 정보 수정</Title>
      <ProfileSection>
        <ProfileImage src={userInfo.profileImage} alt='profile' />
        <UploadButton htmlFor='profileUpload'>프로필 이미지 변경</UploadButton>
        <input
          id='profileUpload'
          type='file'
          accept='image/*'
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />

        <Label>이름</Label>
        <Input type='text' value={userInfo.name} onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} />

        <Label>핸드폰</Label>
        <Input
          type='phoneNumber'
          value={userInfo.phoneNumber}
          onChange={(e) => setUserInfo({ ...userInfo, phoneNumber: e.target.value })}
        />

        <Label>이메일</Label>
        <Input
          type='email'
          value={userInfo.email}
          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
        />

        <SaveButton onClick={handleSave}>저장</SaveButton>
      </ProfileSection>
    </Container>
  );
};

export default MyInfo;
