import styled from 'styled-components';


export const BackModal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;  
  width: 100vw;
  margin: 0 auto;  
  position: fixed;
  background: #00000050;
  top: 0;
  left: 0;  
`;

export const ContentModal = styled.div`
  position: relative;
  max-width: 339px;
  width: 100%;
  max-height: 90vh;
  padding: 30px;
  background: #fff url(/bg-rain-modal.png) center center;  
  border-radius: 20px;
  @media ${(props) => props.theme.breakpoints.w768}{
    max-width: calc(100% - 30px);
    p{
      max-width: 100% !important;
    }
  }
`;

export const BtnClose = styled.button`
   position: absolute;
   width: 50px;
   height: 50px;
   background: transparent;
   top: 0;
   right: 0;  
   border: 0;
   &::before{
    content:"";
    width: 15px;
    height: 3px;
    background: #000;
    position: absolute;
    transform: rotate(45deg);
    left: 15px;
    right: 0;
   }
   &::after{
    content:"";
    width: 15px;
    height: 3px;
    background: #000;
    position: absolute;
    transform: rotate(-45deg);
    right: 0;
    left: 15px;
   }
`;

export const ClickBack = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 60px;
  height: 50px;
  gap: 10px;
  position: absolute;
  top: 0;
  left: 20px;
  p{
    color: #000;
    font-family: 'gothamextra_light';
    font-size: 10px;    
  }
`