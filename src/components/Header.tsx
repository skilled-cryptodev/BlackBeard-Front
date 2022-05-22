import React, { useEffect, useRef } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'
import { Flex, Image, Text, TextProps } from '@pancakeswap/uikit'
import ConnectWalletButton from './ConnectWalletButton'

const StyledHeaderWrapper = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  max-width: 1200px;
  margin: 15px auto;
  align-items: center;  
`

const LogoImage = styled.img`
  border-radius: 50%;
  width: 150px;
  height: 150px;
`

const Header: React.FC = () => {

  return (
    <StyledHeaderWrapper>
      <Flex flexDirection="column" alignItems="center">
        <Text bold fontSize="40px" color="primary">Black Beard</Text>
      </Flex>
      <LogoImage src="/images/logo.png" alt="Get some help" />
      <ConnectWalletButton />
    </StyledHeaderWrapper>
  )
}

export default Header
