import Image from "next/image";
import Modal from "../ModalTemplate/modal";
import { ModalCPremium } from "./styles";
import IconRain from '../../../public/icons/icon-rain-blue.png';

const ModalPremium = ({ modalOpen, setModalOpen, setModalCheckoutOpen}) => {
  return (
    <Modal isOpen={modalOpen} setIsOpen={setModalOpen} closeButton={true} backModalClick={true} escapeClose={false}> 
       <ModalCPremium>
        <h2>Premium:<br/>
        <span>USD 50</span>
        </h2>
        <h3>             
        <Image src={IconRain} width={25} height={25} alt="Wallet"/>
          You will be covered a<br /> volume of rain above 3mm
        </h3>
        <p>Lorem ipsum dolor sit amet, consectetur dipiscing elit, sed do eiusmod empor incididunt ut labore et olore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. leren</p>
        <button onClick={() => {setModalCheckoutOpen(true); setModalOpen(false);}}>Checkout</button>
      </ModalCPremium>
  </Modal> 
  );
};

export default ModalPremium;
