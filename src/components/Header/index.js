import { Container } from './styles';
import { Menu } from '../Menu';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => { 
  return (
    <>
      <Container>
        <h1>Rainsurance</h1> 
        <Menu />
        <ConnectButton accountStatus="address" showBalance={false}/>
      </Container>
   </>
  );
};

export default Header;
