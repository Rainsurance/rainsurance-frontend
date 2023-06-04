import { ContainerLoading } from './styles';
import Image from 'next/image';
import ImgLoading from '../../../public/loading.gif';
import React from 'react';

const Loading = () => {
  return (
    <ContainerLoading>
      <Image src={ImgLoading} width={64} height={64} alt="Loading" />
    </ContainerLoading>
  );
};

export default Loading;
