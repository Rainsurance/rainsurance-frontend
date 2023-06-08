import React from 'react'

import Header from '@/components/Header'
import { Container } from './styles'

const Layout = ({children, title}) => {
  return (
    <Container>
     <Header title={`${title} | Rainsurance`}/>
      <main>{children}</main>
    </Container>
  )
}

export default Layout;