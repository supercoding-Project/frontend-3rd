import React from 'react';
import styled from 'styled-components';

const TitleContainer = styled.div`
  margin-left: 35px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 200px;
`;

const Button = styled.button`
  width: 100px;
  height: 30px;
  cursor: pointer;
  border: 1px;
  border-radius: 20px;
  transition: 0.1s;
  &:hover {
    border: 2px solid var(--color-main-active);
  }
`;

const handleWithdraw = () => {
  //TODO
};

const MyInfoTitle = () => {
  return (
    <TitleContainer>
      <Title>My Page</Title>
      <Description>고객께서 가입하신 회원 정보를 수정할 수 있습니다.</Description>
      <ButtonContainer>
        <Button onClick={handleWithdraw}>회원탈퇴</Button>
      </ButtonContainer>
    </TitleContainer>
  );
};

export default MyInfoTitle;
