import React from 'react';
import userProfileImg from '/Basic-User-Img.png';
import styled from 'styled-components';

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
  return (
    <ProfileContainer>
      <ProfileImage src={userProfileImg} alt='profile' />
      <UserInfo>
        <UserName>김하진</UserName>
        <UserEmail>hajin.kim27@example.com</UserEmail>
      </UserInfo>
    </ProfileContainer>
  );
};

export default ProfileInfo;
