import styled from 'styled-components';

export const FlexInitial = styled.div`
  main {
    justify-content: flex-start;
  }
`;

export const Bundle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 999px;
  padding: 30px 0;
  margin: 40px auto 0;
  background: #00000015;
  border-radius: 10px 10px 0 0;
  flex: 1;
  h2 {
    font-size: 26px;
    color: #3c67a4;
    font-family: 'gotham_light';
    text-align: center;
    margin-bottom: 30px;
    span {
      font-family: 'gotham_roundedbook';
      color: #fff;
    }
  }
  @media ${(props) => props.theme.breakpoints.w1000} {
    background: transparent;
    padding-bottom: 60px;
    margin-top: 0;
    padding-top: 0;
    width: 100%;
  }
`;

export const Table = styled.div`
  display: flex;
  width: 100%;
  max-width: 968px;
  flex-direction: column;
  .os-scrollbar-handle {
    background: #d7e7fd;
  }
`;
export const TableHeader = styled.div`
  display: grid;
  gap: 30px;
  grid-template-columns: 30px 170px 50px 50px 90px 100px 60px 90px 80px;
  border-bottom: 1px solid #afc0d6;
  padding-bottom: 20px;
  padding-left: 8px;
  p {
    font-size: 14px;
    color: #fff;
    font-family: 'gothambold';
    text-transform: uppercase;
  }
`;
export const TableBody = styled.div`
  display: grid;
  gap: 30px;
  grid-template-columns: 30px 170px 50px 50px 90px 100px 60px 90px 80px;
  border-bottom: 1px solid #afc0d6;
  padding: 10px 8px;
  align-items: center;

  p {
    font-size: 12px;
    color: #fff;
    font-family: 'gothamextra_light';
  }
  p + p + p + p + p + p + p {
    text-align: center;
  }
  p:last-child {
    padding-right: 8px;
  }
`;

export const Status = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${(prop) => (prop.color ? prop.color : 'transparent')};
  }
`;
