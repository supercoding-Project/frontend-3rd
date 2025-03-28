import styled from 'styled-components';
import TodoHeader from '../../components/Todo/TodoHeader';
import TodoMain from '../../components/Todo/TodoMain';

const Todo = () => {
  return (
    <Container>
      <TodoMain />
    </Container>
  );
};

export default Todo;

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
`;
