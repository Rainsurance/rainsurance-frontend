import Layout from "@/layout/Layout";
import { statusPolicies } from "../utils/statuspolicies"
import IconRain from '../../public/icons/icon-rain-blue-2.png';
import IconPlane from '../../public/icons/icon-plane.png';
import IconCalendar from '../../public/icons/icon-calendar-blue.png';
import IconApproved from '../../public/icons/icon-approved.png';
import IconRejected from '../../public/icons/icon-rejected.png';

import Modal from "@/components/ModalTemplate/modal";
import { 
  Policies, 
  Container,
  ContainerItem,
  ContainerItemTop,
  ContainerBody,
  ContainerCalendar,
  ContainerRain,
  ContainerBodyItem,
  Status,
  ModalCStatus,
  H3Modal
} from "@/styles/policies";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";



const PoliciesView = () =>{
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  return (  
  <Layout>
    <Policies>
      <h2>Policies</h2>      
    
       <Container>
       {statusPolicies.map((item, index) => (
        <ContainerItem key={index}>
          <ContainerItemTop>
            <h3><Image src={IconPlane} width={19} height={19} alt="Wallet"/>{item.city}</h3>
            <Status content={item.status} color={item.colorStatus}/>
          </ContainerItemTop>
          <ContainerBody>
            <ContainerBodyItem>
              <ContainerCalendar>
                <Image src={IconCalendar} width={30} height={30} alt="Wallet"/>
                <p>{item.initialData} <br />
                  {item.finalData}
                </p>
              </ContainerCalendar>
              <ContainerRain>
                <Image src={IconRain} width={25} height={25} alt="Wallet"/>
                <p>{item.rain}</p>
              </ContainerRain>
            </ContainerBodyItem>
            {item.click === 'true' ? (
              <Link href="" onClick={() => handleOpenModal(item)}>Claim</Link> 
            ) : null}      
          </ContainerBody>
        </ContainerItem>
      ))}
       </Container>
       
       <Modal isOpen={modalOpen} setIsOpen={setModalOpen} closeButton={true} backModalClick={true} escapeClose={false}>
        {selectedItem !== null && (
          <ModalCStatus>
          <H3Modal colorStatus={selectedItem?.modalTitleColor}>
            <img src={selectedItem?.iconModalStatus} alt={selectedItem?.modalStatus}/>
            {selectedItem?.modalStatus}
          </H3Modal>         
            <p>
            {selectedItem?.txtModal}             
            </p>
          </ModalCStatus>
        )}
      </Modal>

    </Policies>        
  </Layout>   
  )
}
export default PoliciesView;