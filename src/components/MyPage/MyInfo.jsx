import React, { useState } from 'react';
import styled from 'styled-components';
import userProfileImg from '/Basic-User-Img.png';

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
  const [name, setName] = useState('김하진');
  const [email, setEmail] = useState('hajin.kim27@example.com');
  const [phoneNumber, setPhoneNumber] = useState('010-1234-5678');
  const [profileImage, setProfileImage] = useState(userProfileImg);

  // 프로필 이미지 변경 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // 정보 저장 핸들러
  const handleSave = () => {
    alert(`이름: ${name}, 이메일: ${email}`);
    // 실제로는 API 요청을 보내서 정보 업데이트해야 함
  };

  return (
    <Container>
      <Title>회원 정보 수정</Title>
      <ProfileSection>
        <ProfileImage src={profileImage} alt='profile' />
        <UploadButton htmlFor='profileUpload'>프로필 이미지 변경</UploadButton>
        <input
          id='profileUpload'
          type='file'
          accept='image/*'
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />

        <Label>이름</Label>
        <Input type='text' value={name} onChange={(e) => setName(e.target.value)} />

        <Label>핸드폰</Label>
        <Input type='phoneNumber' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

        <Label>이메일</Label>
        <Input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />

        <SaveButton onClick={handleSave}>저장</SaveButton>
      </ProfileSection>
    </Container>
  );
};

export default MyInfo;
