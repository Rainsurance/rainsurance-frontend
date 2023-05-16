import styled from 'styled-components';



export const ModalCPremium = styled.div`
display: flex;
justify-content: center;
flex-direction: column;
align-items: center;
  h2{
    font-size: 17px;
    color: #7aaff9;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 20px;
    margin-bottom: 20px;
    max-width: 210px;
    width: 100%;
    text-align: center;
    font-family: 'gotham_roundedbold';
    span{
      font-size: 30px;
      color: #3c65a7;
    }
  }
  h3{
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: #000;
    font-family: 'gotham_light';
    max-width: 210px;
    width: 100%;
    margin-bottom: 30px;
  }
  p{
    max-width: 210px;
    width: 100%;
    color: #000;
    font-family: 'gotham_light';
    font-size: 14px;
    margin-bottom: 20px;
  }
  button{
    margin: 15px 0;
    height: 60px;
    max-width: 264px;
    width: 100%;
    border: 0;
     background: #7aaff9;
     font-size: 20px;
     color: #fff;
     border-radius: 20px;
     -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
     -moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
     box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
     cursor: pointer;
  }
`

