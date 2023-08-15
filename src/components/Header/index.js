import { Container } from './styles';
import { Menu } from '../Menu';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID;

const Header = ({ title }) => { 
  return (
    <>
      <Head>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive"/>
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
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
