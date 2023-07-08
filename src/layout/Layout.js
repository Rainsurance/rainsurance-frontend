import React from 'react'

import Header from '@/components/Header'
import { Container } from './styles'

const Layout = ({children, title}) => {
  return (
    <Container>
     <Header title={`${title} | Rainsurance`}/>
      <main>{children}</main>
      <div className="footer">
        <div className="childWrapper">
          <p>&copy; 2023 RAINsurance. All rights reserved | Made in Brazil, 2023.</p>
          <p>Don't let the rain ruin your vacation or event!</p>
          <p>
            Follow us on <a href="https://twitter.com/electriceel21" target="_blank">Twitter</a>
          </p>
        </div>
      </div>
    </Container>
  )
}

export default Layout;