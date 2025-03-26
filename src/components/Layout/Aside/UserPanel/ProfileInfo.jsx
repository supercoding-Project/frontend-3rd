import React, { useContext } from 'react';
import userProfileImg from '/Basic-User-Img.png';
import styled from 'styled-components';
import { AuthContext } from '../../../../context/AuthContext';

const ProfileContainer = styled.div`
  text-align: center;
`;

const ProfileImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const UserName = styled.div`
  font-size: var(--font-xl);
  font-weight: bold;
`;
const UserEmail = styled.div`
  font-size: var(--font-md);
  color: var(--color-text-disabled);
  padding-top: 3px;
  letter-spacing: 0.5px;
`;

const ProfileInfo = () => {
  const { user } = useContext(AuthContext);
  console.log('🟠 사이드바에서 가져온 유저 정보:', user);

  // 프로필 이미지 URL을 절대 경로로 변경
  const profileImage = user?.profileImage
    ? `http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080${user.profileImage}`
    : userProfileImg;
  console.log('🟠 프로필사진 url:', profileImage);

  //로그인한 유저 정보 가져오기
  return (
    <ProfileContainer>
      <ProfileImage src={profileImage} alt='profile' />
      <UserInfo>
        <UserName>{user?.username || '사용자'}</UserName>
        <UserEmail>{user?.email || '이메일 없음'}</UserEmail>
      </UserInfo>
    </ProfileContainer>
  );
};

export default ProfileInfo;
