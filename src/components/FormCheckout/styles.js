import styled from 'styled-components';


export const EnvFormCheckout = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;  
   width: calc(100% + 60px);
   margin-left: -30px;
   padding: 25px 0 0;   
   border-radius: 10px;
   height: 100%;
   max-height: 550px;
   @media ${(props) => props.theme.breakpoints.w768}{
    width: 100%;
    margin-left: auto;
    max-height: 400px;
   }
   h2{
    font-family: 'gotham_roundedbold';
    font-size: 22px;
    color: #7aaff9;
    margin-bottom: 20px;
    text-align: center;
   }
   form{
    width: 100%;    
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
   }     
   button{   
    height: 60px;
    border: 0;
     background: #7aaff9;
     font-size: 20px;
     color: #fff;
     font-family: 'gothambold';
     border-radius: 20px;
     -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
     -moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
     box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
     cursor: pointer;
     width: 279px;   
     margin-bottom : 20px;
   }
   .os-scrollbar .os-scrollbar-handle{
    background: #d7e7fd;
  } 
`


export const ItemFormCheckout = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 265px;
    width: 100%;
    gap: 10px;
   label{
     color: #3c65a7;
     font-size: 10px;
     font-family: 'gothambold';
     text-transform: uppercase;
     display: flex;
     flex-direction: column;
     gap: 10px;     
   }
   input{
    border-radius: 15px;
    color: #9fa4aa;
    height: 51px;
    padding: 0 20px;
    font-size: 16px;
    font-family: 'gotham_roundedbook';
    border: 1px solid #3c65a7;
    cursor: pointer;
    width: 100%;
   }
   button{
    margin: 15px 0;
    height: 60px;
    border: 0;
     background: #7aaff9;
     font-size: 20px;
     color: #fff;
     font-family: 'gothambold';
     border-radius: 20px;
     -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
     -moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
     box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
     cursor: pointer;
   }
   span{
    color: #f00;
    font-family: 'gothambold';
    font-size: 10px;
    margin-top: -5px;
   }
`

export const EnvPaymant = styled.div`
 display: flex;
 flex-direction: column;
 align-items: center;
  h3{
    font-size: 16px;
    color: #7aaff9;
    font-family: 'gotham_roundedbold';
    text-align: center;
    margin-bottom: 25px;
  }
`;
export const EnvClickPayment = styled.div`
 display: flex;
 width: 100%;
 gap: 4px;
 justify-content: center;
 margin-bottom : 25px;
 
`;
export const ClickPaymant = styled.div`
 cursor: pointer;
 display: flex;
 align-items: center;
 gap: 8px;
 border-radius: 5px;
 padding: 5px 10px;
 p{
  text-transform: uppercase;
  color: #fff;
  font-family: 'gothambold';
  font-size: 10px;
 }
 img{
  filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(165deg) brightness(102%) contrast(103%);
 }
background-color: ${props => (props.active ? '#7aaff9' : '#9e9e9e')};
`;

export const PaymantItem = styled.div`
 width: 310px;
display: ${props => (props.active ? 'flex' : 'none')};
`;

export const ContentPix = styled.div`
   padding: 0 15px;
   line-break: anywhere;
   width: 100%;
   h4{
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    gap: 8px;
    font-family: 'gothamextra_light';
    color: #000;
    font-size: 12px;
   }
   p{
    font-family: 'gothamextra_light';
    color: #000;
    font-size: 12px;
    margin-bottom: 40px;
   }  
   h5{
    font-family: 'gotham_light';
    color: #7aaff9;
    font-size: 12px;  
    word-spacing: 3px;  
    text-align: center;
   }
`;

export const CreditCard = styled.div`
   padding: 0 15px;
   line-break: anywhere;
   width: 100%;
   h4{
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    gap: 8px;
    font-family: 'gothamextra_light';
    color: #000;
    font-size: 12px;
   }
   p{
    font-family: 'gothamextra_light';
    color: #000;
    font-size: 12px;
    margin-bottom: 40px;
   }  
   h5{
    font-family: 'gotham_light';
    color: #7aaff9;
    font-size: 12px;  
    word-spacing: 3px;  
    text-align: center;
   }
`;
export const Wallet = styled.div`
   padding: 0 15px;
   line-break: anywhere;
   width: 100%;
   h4{
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    gap: 8px;
    font-family: 'gothamextra_light';
    color: #000;
    font-size: 12px;
   }
   p{
    font-family: 'gothamextra_light';
    color: #000;
    font-size: 12px;
    margin-bottom: 40px;
   }  
   h5{
    font-family: 'gotham_light';
    color: #7aaff9;
    font-size: 12px;  
    word-spacing: 3px;  
    text-align: center;
   }
`;
export const ClickCopy = styled.div`  
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;    
     background: #7aaff9;    
     border-radius: 20px;
     -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
     -moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
     box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
     cursor: pointer;
     width: 279px;
     p{
      font-size: 20px;
      color: #fff;
      font-family: 'gothambold';
      margin-bottom: 0;
     }
`;
