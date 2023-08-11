import styled from 'styled-components';

export const ContainerTxt = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  max-width: calc(100% - 30px);
  text-align: center;
  p {
    font-family: 'gotham_roundedbold';
    font-size: 16px;
    color: #fff;
    u {
      text-decoration: underline;
    }
  }
`;
