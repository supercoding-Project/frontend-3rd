import styled from 'styled-components';

const Tab = ({ children }) => {
  return <Container>{children}</Container>;
};

export default Tab;

const Container = styled.ul`
  display: flex;
  align-items: end;
  gap: 30px;
  height: 58px;
`;
