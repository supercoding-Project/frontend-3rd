import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import userProfileImg from '/Basic-User-Img.png';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const MyInfo = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: userProfileImg,
  });

  const updateUser = useContext(AuthContext);
  console.log('🔵 updateUser:', updateUser); // 추가된 디버깅 로그

  //const [isLoading, setIsLoading] = useState(true);

  // 로그인한 유저 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(
          'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/api/v1/mypage',
          {
            headers: {
              Authorization: `Bearer ${token}`, // JWT 토큰 포함
            },
          }
        );
        console.log('✅ 응답 데이터:', response);
        console.log('✅ 응답 데이터:', response.data);

        // 응답 데이터의 구조가 맞는지 확인
        if (response.data && response.data.data) {
          setUserInfo({
            name: response.data.data.name || '',
            email: response.data.data.email || '',
            phone: response.data.data.phone || '',
            profileImage: response.data.data.userImageUrl || userProfileImg,
          });
          //setIsLoading(false); // 데이터 로딩 완료 후 로딩 상태 변경
        } else {
          console.error('응답 데이터가 올바르지 않습니다.');
        }
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
  const handleUpdate = async () => {
    try {
      console.log('🟢 회원 정보 수정 요청 시작');
      const requestData = {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        userImageUrl: userInfo.profileImage,
      };

      console.log('📤 보낸 데이터:', requestData); // 보낸 데이터 확인

      const response = await axios.put(
        'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080/api/v1/mypage',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('✅ 서버 응답 데이터:', response.data);

      if (response.data.isSuccess && response.data.data) {
        // const updateUserInfo = {
        //   name: response.data.data.name,
        //   email: response.data.data.email,
        //   phone: response.data.data.phone,
        //   profileImage: response.data.data.userImageUrl || userProfileImg,
        // };

        // setUserInfo(updateUserInfo);
        // updateUser(updateUserInfo);

        // 🔍 디버깅 로그 추가
        if (!response.data.isSuccess) {
          console.error('🚨 서버 응답 isSuccess가 false입니다.');
          alert('🚨 서버에서 오류가 발생했습니다.');
          return;
        }

        if (!response.data.data) {
          console.error('🚨 response.data.data가 없습니다:', response.data);
          alert('🚨 서버에서 유효한 데이터를 받지 못했습니다.');
          return;
        }

        const updatedUser = response.data.data;
        console.log('🔄 업데이트된 유저 정보:', updatedUser);
        // 전역 상태 업데이트 (AuthContext의 updateUser가 제대로 작동하는지 확인 필요)
        console.log('🔍 updateUser 함수 체크 중...');
        if (typeof updateUser === 'function') {
          console.log('🔵 updateUser 함수가 존재합니다.');
          updateUser(updatedUser);
        } else {
          console.error('🚨 updateUser 함수가 정의되지 않음');
          alert('🚨 회원 정보 업데이트 중 오류가 발생했습니다.');
          return;
        }
        // updateUser(updatedUser); // ✅ 전역 상태 업데이트
        alert('✅ 회원 정보가 수정되었습니다.');
      }
    } catch (error) {
      console.error('유저 정보 수정 오류:', error);
      alert('🚨 회원 정보 수정 중 오류가 발생했습니다.');
    }
  };

  const baseUrl = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080';

  // if (isLoading) {
  //   return <div>로딩 중...</div>; // 로딩 중 화면 표시
  // }

  return (
    <Container>
      <Title>회원 정보 수정</Title>
      <ProfileSection>
        <ProfileImage
          src={userInfo.profileImage ? userInfo.profileImage : `${baseUrl}${userInfo.profileImage}`}
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
        <Input type='text' value={userInfo.name} onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} />

        <Label>핸드폰 번호</Label>
        <Input
          type='text'
          value={userInfo.phone}
          onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
        />

        <Label>이메일</Label>
        <Input
          type='email'
          value={userInfo.email}
          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
        />

        <SaveButton onClick={handleUpdate}>저장</SaveButton>
      </ProfileSection>
    </Container>
  );
};

export default MyInfo;

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
