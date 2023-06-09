import styled from 'styled-components';

export const EnvForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 876px;
  padding: 30px 0;
  margin: 40px auto;
  background: #00000015;
  border-radius: 10px;
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
  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  @media ${(props) => props.theme.breakpoints.w1000} {
    background: transparent;
    padding-bottom: 60px;
    margin-top: 0;
    padding-top: 0;
    width: 100%;
  }
`;

export const GridItem = styled.div`
  width: 100%;
  max-width: 762px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px 40px;
  @media ${(props) => props.theme.breakpoints.w1000} {
    grid-template-columns: 1fr;
    max-width: 265px;
  }
`;

export const ItemForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  select {
    border-radius: 15px;
    color: #000;
    height: 51px;
    padding: 0 20px;
    font-size: 16px;
    font-family: 'gotham_roundedbook';
    border: 0;
    cursor: pointer;
    background: #e0e7f0 url(/icons/icon-arrow-blue.png) right 20px center
      no-repeat;
  }
  label {
    color: #fff;
    font-size: 10px;
    font-family: 'gothambold';
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
  }
  input {
    border-radius: 15px;
    color: #000;
    height: 51px;
    padding: 0 20px;
    font-size: 16px;
    font-family: 'gotham_roundedbook';
    border: 0;
    cursor: pointer;
    width: 100%;
  }
  span {
    color: #f00;
    font-family: 'gothambold';
    font-size: 10px;
    margin-top: -5px;
  }
  ::-webkit-input-placeholder {
    /* Edge */
    color: #9fa4aa;
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #9fa4aa;
  }

  ::placeholder {
    color: #9fa4aa;
  }
`;

export const Checkbox = styled.div`
  width: 100%;
  max-width: 762px;
  margin-top: 10px;
  @media ${(props) => props.theme.breakpoints.w1000} {
    max-width: 265px;
  }
  label {
    font-size: 10px;
    color: #fff;
    font-family: 'gothambold';
    display: flex;
    gap: 15px;
    input {
      -webkit-appearance: auto;
      width: 17px;
      height: 17px;
      flex-shrink: 0;
    }
  }
  span {
    color: #f00;
    font-family: 'gothambold';
    font-size: 10px;
    margin-top: -5px;
  }
`;
export const Txt = styled.p`
  font-size: 16px;
  color: #000;
  font-family: 'gotham_roundedbook';
  position: absolute;
  right: 35px;
  top: 35px;
`;

export const ButtonForm = styled.button`
  margin: 15px 0;
  height: 60px;
  border: 0;
  background: #7aaff9;
  font-size: 20px;
  text-transform: uppercase;
  color: #fff;
  border-radius: 20px;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
  cursor: pointer;
  max-width: 263px;
  width: 100%;
`;
