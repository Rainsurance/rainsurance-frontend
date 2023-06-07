import styled from 'styled-components';

export const Policies = styled.div`
  min-height: calc(100vh - 75px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40px;
  h2 {
    font-size: 26px;
    color: #fff;
    font-family: 'gotham_roundedbold';
    margin: 40px auto;
    @media ${(props) => props.theme.breakpoints.w1000} {
      margin: 0 auto 40px;
    }
  }
  @media ${(props) => props.theme.breakpoints.w1000} {
    padding-bottom: 110px;
    min-height: 1px;
  }
`;

export const Container = styled.div`
  max-width: 339px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media ${(props) => props.theme.breakpoints.w768} {
    max-width: calc(100% - 30px);
  }
`;

export const ContainerItem = styled.div`
  border-radius: 15px;
  width: 100%;
  padding: 20px;
`;

export const ContainerItemTop = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  h3 {
    display: flex;
    font-family: 'gotham_roundedbold';
    font-size: 22px;
    align-items: center;
    gap: 8px;
  }
  a {
    background: #7aaff9;
    font-family: 'gotham_roundedbold';
    font-size: 16px;
    color: #fff;
    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    padding: 0 20px 1px;
  }
`;

export const EnvStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: column;
`;

export const EnvStatusWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  img {
    cursor: pointer;
  }
`;

export const ContainerBodyItem = styled.div`
  display: flex;
  gap: 10px;
`;

export const ContainerBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    background: #7aaff9;
    font-family: 'gotham_roundedbold';
    font-size: 16px;
    color: #fff;
    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    padding: 0 20px 1px;
  }
`;
export const ContainerCalendar = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  p {
    font-family: 'gotham_roundedbook';
    font-size: 10px;
    color: #000;
  }
`;

export const ContainerRain = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  p {
    font-family: 'gotham_roundedbook';
    font-size: 10px;
    color: #000;
  }
`;

export const ContainerCoin = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  p {
    font-family: 'gotham_roundedbook';
    font-size: 10px;
    color: #000;
  }
`;

export const Status = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${(prop) => (prop.color ? prop.color : 'transparent')};
  }
  &::after {
    content: '';
    content: ${(prop) => (prop.content ? prop.content : '')};
    color: ${(prop) => (prop.color ? prop.color : '#000')};
    font-family: 'gotham_roundedbook';
    font-size: 12px;
  }
`;

export const ModalCStatus = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  p {
    width: 100%;
    color: #000;
    font-family: 'gotham_light';
    font-size: 14px;
    margin-bottom: 20px;
  }
`;

export const H3Modal = styled.h3`
  font-size: 26px;
  text-align: center;
  font-family: 'gotham_roundedbold';
  text-align: center;
  margin: 0 auto 30px;
  color: ${(prop) => (prop.colorStatus ? prop.colorStatus : '#000 !important')};
  img {
    display: block;
    margin: 0 auto 20px;
  }
`;