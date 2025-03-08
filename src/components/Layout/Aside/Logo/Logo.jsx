import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  padding: 30px;
  text-align: center;
  color: var(--color-text-disabled);
  border-bottom: 1px solid var(--color-border);
  letter-spacing: 2px;
`;

const Logo = () => {
  return <Title>TASK MANAGER</Title>;
};

export default Logo;
