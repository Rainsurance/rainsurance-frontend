import {  
   EnvFormCheckout,
   ItemFormCheckout,  
   EnvPaymant,
   EnvClickPayment,
   ClickPaymant,
   PaymantItem,
   ContentPix,
   CreditCard,
   Wallet,
   ClickCopy,
  } from "./styles";
import Image from 'next/image';
import IconPix from '../../../public/icons/icon-pix.png';
import IconCCard from '../../../public/icons/icon-credit-card.png';
import IconPWallet from '../../../public/icons/icon-wallet.png';
import "react-datepicker/dist/react-datepicker.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

import { useState } from "react";
import {useForm} from 'react-hook-form';
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

const createUseFormSchema = z.object({ 
  fname: z.string().nonempty('Full name is required'),
  txid: z.string().nonempty('Tax id is required'),
  email: z.string().email('Email is required and needs to be a valid email address'),   
})

const FormCheckout = () => { 
  const [activeButton, setActiveButton] = useState(0);  

  const {register, handleSubmit, formState:{errors}, control} = useForm({
    resolver: zodResolver(createUseFormSchema)
  }) 
  function createUser(data){
    console.log(data)     
  } 
  return (
   
    <EnvFormCheckout>
    <OverlayScrollbarsComponent defer>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit(createUser)}>
        <ItemFormCheckout>
          <label>              
          Full name
          <input type="text" {...register('fname')}/>                
          </label>     
          {errors.fname &&  <span>{errors.fname.message}</span>}           
        </ItemFormCheckout>  
        <ItemFormCheckout>
            <label>              
            Tax ID
            <input type="text" {...register('txid')}/>  
            </label>  
            {errors.txid &&  <span>{errors.txid.message}</span>}     
        </ItemFormCheckout>  
        <ItemFormCheckout>
            <label>              
            E-mail
            <input type="email" {...register('email')}/>  
            </label>     
            {errors.email &&  <span>{errors.email.message}</span>}     
        </ItemFormCheckout>  
        <EnvPaymant>
        <h3>Select yout preferred<br />
        paymant option</h3>
          <EnvClickPayment>
            <ClickPaymant active={activeButton === 0} onClick={() => setActiveButton(0)}>
            <Image src={IconPix} width={15} height={15} alt="Wallet"/>
              <p>PIX</p>
            </ClickPaymant>
            <ClickPaymant active={activeButton === 1} onClick={() => setActiveButton(1)}>
            <Image src={IconCCard} width={18} height={18} alt="Wallet"/>
              <p>C.Credit</p>
            </ClickPaymant>
            <ClickPaymant active={activeButton === 2} onClick={() => setActiveButton(2)}>
            <Image src={IconPWallet} width={18} height={18} alt="Wallet"/>
              <p>Wallet</p>
            </ClickPaymant>
          </EnvClickPayment>
          <PaymantItem active={activeButton === 0}>
            <ContentPix>
              <h4> <Image src={IconPix} width={15} height={15} alt="Pix"/>
              <span>Pix Code</span></h4>
            <p>
            0x2564156sf20cx561fs56fs15fs40x124v2fdsjghdfs042524513450445645s1ds45ds45d45sdajhsadjkhnajsdhjkahsdxzh541564dsf123564f65dsfklhfiudsfjsdiuhkjUYTGERWUIHREUYFGDSUIGYRFJKkldfiodsioslaliuafsklao
            </p>
            <ClickCopy><p>Copy Pix Code</p></ClickCopy>
            <h5>Pay with QR CODE using a cellphone</h5>
            </ContentPix>
          </PaymantItem>
          <PaymantItem active={activeButton === 1}>
          <CreditCard>
              <h4> <Image src={IconCCard} width={18} height={18} alt="C.Credit"/>
              <span>C.Credit</span></h4>
              
          </CreditCard>
          </PaymantItem>
          <PaymantItem active={activeButton === 2}>
            <Wallet>
                <h4> <Image src={IconPWallet} width={18} height={18} alt="Wallet"/>
                <span>Wallet</span></h4>
            </Wallet>
          </PaymantItem>
        </EnvPaymant>

        <button type="submit">Confirm</button>
      </form>
    </OverlayScrollbarsComponent>
  </EnvFormCheckout>
  );
};

export default FormCheckout;
