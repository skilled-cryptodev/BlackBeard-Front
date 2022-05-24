import React from 'react'
import styled from 'styled-components'
import { Button, Flex, Text, useModal, useMatchBreakpoints } from '@pancakeswap/uikit'
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

  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 0 15px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 20px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 30px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0 10px;
  }
`

const LogoImage = styled.img`
  border-radius: 50%;
  width: 150px;
  height: 150px;

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 80px;
    height: 80px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100px;
    height: 100px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 120px;
    height: 120px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 150px;
    height: 150px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 150px;
    height: 150px;
  }
`

const Header: React.FC = () => {
  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints()

  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)

  return (
    <StyledHeaderWrapper>
      { !isMobile &&
        <Flex flexDirection="column" alignItems="center">
          <Text bold fontSize="40px" color="primary">Black Beard</Text>
        </Flex>
      }
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
