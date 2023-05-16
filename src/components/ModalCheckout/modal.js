import { useEffect } from "react";
import { BackModal, ContentModal, BtnClose } from "./styles";

const ESCAPE_KEYCODE = 27;
const ModalCheckout = ({children, isOpen, setIsOpen, id="ModalCheckout", closeButton = true, backModalClick = true, escapeClose = true}) => {
  // close on click escape
  useEffect(() => {
    if(!window || !escapeClose) return;
    const KeyUpListener = (e) => {
      if (e.keyCode == ESCAPE_KEYCODE) setIsOpen(false)
    }
    window.addEventListener('keyup', KeyUpListener);
    return () => {
      window.removeEventListener('keyup', KeyUpListener);
    }
  }, [setIsOpen, escapeClose]);
  // close on click escape

  if(!isOpen) return null;  
  const handleBackClick = (e) => {   
    if (!backModalClick || e.target.id != id) return;
    setIsOpen(false)
  }
  return (
  <BackModal id={id} onClick={handleBackClick}>
    <ContentModal>       
      {closeButton ? <BtnClose onClick={() => setIsOpen(false)} /> : null}
      {children}
    </ContentModal>
  </BackModal>)
}
export default ModalCheckout;