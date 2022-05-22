import React from 'react'
import styled from 'styled-components'
import { Button, Flex, Text, useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import truncateHash from 'utils/truncateHash'
import ConnectWalletButton from './ConnectWalletButton'
import WalletModal, { WalletView } from './Menu/UserMenu/WalletModal'

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
  const { account } = useWeb3React()

  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)

  return (
    <StyledHeaderWrapper>
      <Flex flexDirection="column" alignItems="center">
        <Text bold fontSize="40px" color="primary">Black Beard</Text>
      </Flex>
      <LogoImage src="/images/logo.png" alt="Get some help" />
      { !account ?
        <ConnectWalletButton />
        :
        <Button variant="secondary" onClick={onPresentWalletModal}>
          {truncateHash(account, 5, 5)}
        </Button>
      }
    </StyledHeaderWrapper>
  )
}

export default Header
