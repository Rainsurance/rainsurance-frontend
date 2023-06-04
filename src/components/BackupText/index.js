import { ContainerTxt } from './styles';
import React from 'react';

const BackupText = ({ children }) => {
  return (
    <ContainerTxt>
      <p>{children}</p>
    </ContainerTxt>
  );
};

export default BackupText;
