import Image from "next/image";
import { useAccount } from "wagmi";
import Modal from "../ModalTemplate/modal";
import { ModalCPremium } from "./styles";
import IconRain from "../../../public/icons/icon-rain-blue.png";
import PolicyConditions from "../PolicyConditions";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const ModalPremium = ({
    modalOpen,
    setModalOpen,
    simulation,
    setModalCheckoutOpen,
}) => {
    const { isConnected } = useAccount()

    function buy() {
        if(isConnected) {
            setModalCheckoutOpen(true);
            setModalOpen(false);
        } else {
            alert("Please connect your wallet to continue");
        }
    }

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
                    <span>USD {simulation.premiumPlusFees}</span>
                </h2>
                <h3>
                    <Image src={IconRain} width={25} height={25} alt="Wallet" />
                    The historical average daily precipitation for this period at this location is {simulation.avgPrec} mm.
                </h3>
                <PolicyConditions 
                    place={simulation.place?.name}
                    startDate={simulation.startDate}
                    endDate={simulation.endDate}
                    days={simulation.days}
                    amount={simulation.amount}
                    precHist={simulation.avgPrec}
                />
                { isConnected && 
                    (<button onClick={buy}>
                        Buy Protection
                    </button>)
                }
                { !isConnected && 
                    <ConnectButton showBalance={false}/>
                }
            </ModalCPremium>
        </Modal>
    );
};

export default ModalPremium;
