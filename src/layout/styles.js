import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;  
  align-items: center;
  min-height: 100vh;
  background: url(/bg-desk.png);
  background-size: contain;
  position: relative;
  overflow: hidden; 
  &::before{
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    background: url(/bg-rain-desk.png);
  }
  main {   
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    align-items: center;
    flex: 1;
    justify-content: center;
  }
  .footer {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 100%;
    font-size: 16px;
    font-family: gothambold;
    padding: 25px 0;
    background: #bbb;
    color: white;
    align-items: center;
    text-align: center;
    overflow-x: auto;
    overflow-y: hidden;
    .childWrapper {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    .childWrapper > p {
      line-height: 1.3;
    }
    a {
      text-decoration: underline;
      color: white;
    }
  }
  
`;
