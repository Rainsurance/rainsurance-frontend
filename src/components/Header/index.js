import { Container } from './styles';
import { Menu } from '../Menu';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';

const Header = ({ title }) => { 
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <Container>
        <h1>Rainsurance</h1> 
        <Menu />
        <ConnectButton accountStatus="address" showBalance={true}/>
      </Container>
   </>
  );
};

export default Header;
