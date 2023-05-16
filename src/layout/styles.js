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
`;
