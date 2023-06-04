import styled from 'styled-components';


export const EnvForm = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 408px;
   padding: 25px 0;
   margin: 40px auto;
   background: #00000015;
   border-radius: 10px;
   h2{
     font-size: 26px;
     color: #3c67a4;
     font-family: 'gotham_light';
     text-align: center;
     margin-bottom: 20px;
     span{
      font-family: 'gotham_roundedbook';
      color: #fff;
     }
   }
   form{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
   } 
   @media ${(props) => props.theme.breakpoints.w1000}{
      background: transparent;
      padding-bottom: 60px;  
      margin-top: 0;    
      padding-top: 0;
      width: 100%;
    } 
`

export const ItemForm = styled.div`
 display: flex;
    flex-direction: column;
    max-width: 265px;
    width: 100%;
    gap: 10px;
    select{   
    border-radius: 15px;
    color: #9fa4aa;
    height: 51px;
    padding: 0 20px;
    font-size: 16px;
    font-family: 'gotham_roundedbook';
    border: 0;
    cursor: pointer;
    background: #e0e7f0 url(/icons/icon-arrow-blue.png) right 20px center no-repeat;
   }
   label{
     color: #fff;
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
    border: 0;
    cursor: pointer;
    width: 100%;
   }
   span{
    color: #f00;
    font-family: 'gothambold';
    font-size: 10px;
    margin-top: -5px;
   }
   button[type=submit] {
    margin: 15px 0;
    height: 60px;
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
  button:disabled {
    background: #948e8e;
  }
   
`