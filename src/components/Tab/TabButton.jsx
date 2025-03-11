import styled from 'styled-components';

const TabButton = ({ children, selected, ...props }) => {
  return (
    <Container $selected={selected}>
      <button {...props}>{children}</button>
    </Container>
  );
};

export default TabButton;

const Container = styled.li`
  position: relative;

  & button {
    border: none;
    background: transparent;
    font-size: var(--font-md);
    color: ${({ $selected }) => ($selected ? 'var(--color-text-primary)' : 'var(--color-text-disabled)')};
    padding: 0;
    cursor: pointer;
  }

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -15px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 15px;
    background-color: var(--color-text-disabled);
  }
`;
