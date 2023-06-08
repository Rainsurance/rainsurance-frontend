import { useState } from "react";
import Layout from "@/layout/Layout";
import FormCalculate from "@/components/FormCalculate";
import ModalPremium from "@/components/ModalPremium";
import ModalCheckout from "@/components/ModalCheckout";

const Home = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [simulation, setSimulation] = useState({});
    const [modalCheckoutOpen, setModalCheckoutOpen] = useState(false);

    return (
        <Layout title="Home">
            <FormCalculate
                setModalOpen={setModalOpen}
                setSimulation={setSimulation}
            />
            <ModalPremium
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                setModalCheckoutOpen={setModalCheckoutOpen}
                simulation={simulation}
            />
            <ModalCheckout
                modalCheckoutOpen={modalCheckoutOpen}
                setModalCheckoutOpen={setModalCheckoutOpen}
                setModalOpen={setModalOpen}
                setSimulation={setSimulation}
                simulation={simulation}
            />
        </Layout>
    );
};
export default Home;
