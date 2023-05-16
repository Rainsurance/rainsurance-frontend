import Image from "next/image";
import Modal from "../ModalTemplate/modal";
import { ClickBack } from "../ModalTemplate/styles";
import FormCheckout from "../FormCheckout";
import IconBack from '../../../public/icons/icon-arrow-back.png';

const ModalCheckOut = ({ modalCheckoutOpen, setModalCheckoutOpen, setModalOpen}) => {
  return (
    <Modal  isOpen={modalCheckoutOpen} setIsOpen={setModalCheckoutOpen} closeButton={true} backModalClick={true} escapeClose={false}> 
        <ClickBack onClick={() => {setModalCheckoutOpen(false), setModalOpen(true)}}>
          <Image src={IconBack} width={13} height={13} alt="Back"/>
          <p>Back</p>
        </ClickBack>   
        <FormCheckout/>  
        </Modal>   
  );
};

export default ModalCheckOut;
