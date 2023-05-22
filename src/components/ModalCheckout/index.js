import Image from "next/image";
import Modal from "../ModalTemplate/modal";
import { ClickBack } from "../ModalTemplate/styles";
import FormCheckout from "../FormCheckout";
import IconBack from "../../../public/icons/icon-arrow-back.png";

const ModalCheckout = ({
    modalCheckoutOpen,
    setModalCheckoutOpen,
    setModalOpen,
    setSimulation,
    simulation,
}) => {
    return (
        <Modal
            isOpen={modalCheckoutOpen}
            setIsOpen={setModalCheckoutOpen}
            closeButton={true}
            backModalClick={true}
            escapeClose={false}
        >
            <ClickBack
                onClick={() => {
                    setModalCheckoutOpen(false), setModalOpen(true);
                }}
            >
                <Image src={IconBack} width={13} height={13} alt="Back" />
                <p>Back</p>
            </ClickBack>
            <FormCheckout
                setSimulation={setSimulation}
                simulation={simulation}
            />
        </Modal>
    );
};

export default ModalCheckout;
