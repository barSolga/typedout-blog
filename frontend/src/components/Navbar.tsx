import {useState} from 'react'
import styled from 'styled-components'
import Searchbox from './Searchbox'
import Menu from './Menu'

const Navbar = () => {
  return (
    <Container className='container'>
        <nav className="wrapper nav">
          <img className='nav__logo' src="/assets/typedout-logo.svg" alt="" width={220} />
          <Searchbox  />
          <Menu />
        </nav>
    </Container>
  )
}

const Container = styled.div`
    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
`

export default Navbar