import Image from "next/image";
import Modal from "../ModalTemplate/modal";
import { ModalCPremium } from "./styles";
import IconRain from "../../../public/icons/icon-rain-blue.png";

const ModalPremium = ({
    modalOpen,
    setModalOpen,
    simulation,
    setModalCheckoutOpen,
}) => {
    return (
        <Modal
            isOpen={modalOpen}
            setIsOpen={setModalOpen}
            closeButton={true}
            backModalClick={true}
            escapeClose={false}
        >
            <ModalCPremium>
                <h2>
                    Premium:
                    <br />
                    <span>USD {simulation.premium}</span>
                </h2>
                <h3>
                    <Image src={IconRain} width={25} height={25} alt="Wallet" />
                    The historical average precipitation for this period of the
                    year at this location is {simulation.avgPrec} mm.
                </h3>
                <p>
                    You will be entitled to a refund if the average
                    precipitation is greater than the amount stated above for{" "}
                    {simulation.days}{" "}
                    {simulation.days > 1 ? "consecutive days" : "day"}, starting
                    at {new Date(simulation.startDate).toLocaleDateString()}.
                    <br />
                    <br />
                    You get {simulation.amount} USD (100% refund) if the
                    rainfall is greater than or equal to 2x the value shown
                    above ({2 * simulation.avgPrec} mm).
                    <br />
                    You get a proportional refund if the amount is in between
                    the two values.
                </p>
                <button
                    onClick={() => {
                        setModalCheckoutOpen(true);
                        setModalOpen(false);
                    }}
                >
                    Buy Protection
                </button>
            </ModalCPremium>
        </Modal>
    );
};

export default ModalPremium;
