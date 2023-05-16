import Link from 'next/link';
import { 
  Container,
  Logged,
  LoggedOut,
  Login, 
} from './styles';
import Image from 'next/image';
import IconWalletMenu from '../../../public/icons/icon-wallet-blue.png';
import IconClose from '../../../public/icons/icon-close.png';
import { Menu } from '../Menu';
import { useState } from 'react';


const text ="0x2564156sf20hfiudsfjsdiuhkjUYTGERWUIHREUYFGDSUIGYRFJKkldfiodsioslaliuafsklaoH7f2";
const shortenedText = `${text.substring(0, 2)}...${text.substring(text.length - 4)}`;

const Header = () => { 
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };
  
  const handleLogout = () => {
    setLoggedIn(false);
    
  };
  return (
    <>
   <Container>      
      <h1>Raininsurance</h1> 
      <Menu/>   
      <Login>    
        <Image src={IconWalletMenu} width={25} height={25} alt="Wallet"/>

        {loggedIn ? (
            <Logged>  
            <p>{shortenedText}</p>
            <Link href="" onClick={handleLogout}><Image src={IconClose} width={23} height={23} alt="Close"/></Link>
          </Logged>     
          ) : (
            <LoggedOut>      
              <Link href="" onClick={handleLogin}>Connect</Link>     
            </LoggedOut>    
          )}       
         
      </Login>
   </Container>
    </>
  );
};

export default Header;
