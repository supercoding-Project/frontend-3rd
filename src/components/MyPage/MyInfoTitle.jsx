import React from 'react';
import styled from 'styled-components';

const TitleContainer = styled.div`
  margin-left: 35px;
  margin-top: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bolder;
  color: var(--color-main-active);
  opacity: 0.8;
`;

const Description = styled.div`
  font-size: 1rem;
  margin-top: 10px;
  color: var(--color-text-disabled);
`;

const MyInfoTitle = () => {
  return (
    <TitleContainer>
      <Title>My Page</Title>
      <Description>고객께서 가입하신 회원 정보를 수정할 수 있습니다.</Description>
    </TitleContainer>
  );
};

export default MyInfoTitle;
