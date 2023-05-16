import { useState } from "react";
import Layout from "@/layout/Layout";
import FormCalculate from "@/components/FormCalculate";
import ModalCPremium  from "@/components/ModalPremium";
import ModalCheckOut from "@/components/ModalCheckout";

const Home = () =>{ 
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCheckoutOpen, setModalCheckoutOpen] = useState(false);

  return (  
  <Layout>      
      <FormCalculate setModalOpen={setModalOpen}/>    
      <ModalCPremium modalOpen={modalOpen} setModalOpen={setModalOpen} setModalCheckoutOpen={setModalCheckoutOpen} />      
      <ModalCheckOut modalCheckoutOpen={modalCheckoutOpen} setModalCheckoutOpen={setModalCheckoutOpen} setModalOpen={setModalOpen} /> 
  </Layout>   
  )
}
export default Home;