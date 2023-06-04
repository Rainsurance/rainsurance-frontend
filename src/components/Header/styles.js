import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  max-width: 1280px;
  width: 100%;
  background: #e7f0fa;
  border-radius: 0 0 0 20px;
  padding: 0 50px;
  position: relative;
  &::before {
    content: '';
    right: -100%;
    top: 0;
    margin: auto;
    width: 100%;
    height: 100%;
    background: #e7f0fa;
    position: absolute;
  }
  &::after {
    content: '';
    right: 10px;
    top: 140px;
    margin: auto;
    width: 672px;
    height: 235px;
    background: url(bg-plane-desk.png);
    position: absolute;
    @media ${(props) => props.theme.breakpoints.w1000} {
      width: 186px;
      height: 66px;
      background: url(bg-plane-mobile.png);
      top: 100px;
    }
  }
  h1 {
    width: 120px;
    height: 26px;
    background: url(logo.png) no-repeat;
    background-size: contain;
    text-indent: -9999;
    overflow: hidden;
    text-indent: -9999px;
    flex-shrink: 0;
    @media ${(props) => props.theme.breakpoints.w1000} {
      background: url(logo-mobile.png) no-repeat;
      margin-top: -5px;
    }
  }
  @media ${(props) => props.theme.breakpoints.w1000} {
    background: transparent;
    padding: 0 15px;
  }
`;

export const Login = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Logged = styled.div` 
 display: flex;
 gap: 10px;
 @media ${(props) => props.theme.breakpoints.w1000}{
  gap: 5px;
  } 
  p{
  width: 107px;
  height: 24px;
  background: #b7cae3;
  border-radius: 11px;  
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-family: 'gothambold';
  @media ${(props) => props.theme.breakpoints.w1000}{
  color: #fff;
  background: #adccee;
  } 
  }
  a{
    display: flex;
    width: 23px;
    height: 23px;    
    background-size: contain;
    img{
      filter: invert(12%) sepia(75%) saturate(7495%) hue-rotate(20deg) brightness(86%) contrast(122%);
      @media ${(props) => props.theme.breakpoints.w1000}{
        filter: invert(96%) sepia(97%) saturate(12%) hue-rotate(237deg) brightness(103%) contrast(103%);
      } 
      }
    }
  }
  
`;

export const LoggedOut = styled.div`
  width: 107px;
  height: 24px;
  background: #3c67a4;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    width: 100%;
    height: 100%;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-family: 'gothambold';
    @media ${(props) => props.theme.breakpoints.w1000} {
      color: #fff;
    }
  }
`;
