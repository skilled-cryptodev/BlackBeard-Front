import React from 'react'
import {
  CloseIcon,
  Heading,
  IconButton,
  InjectedModalProps,
  ModalBody,
  ModalContainer,
  ModalHeader as UIKitModalHeader,
  ModalTitle,
} from '@pancakeswap/uikit'
import { parseUnits } from 'ethers/lib/utils'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { useGetBnbBalance } from 'hooks/useTokenBalance'
import { FetchStatus } from 'config/constants/types'
import WalletInfo from './WalletInfo'
import WalletTransactions from './WalletTransactions'

export enum WalletView {
  WALLET_INFO,
  TRANSACTIONS,
}

interface WalletModalProps extends InjectedModalProps {
  initialView?: WalletView
}

export const LOW_BNB_BALANCE = parseUnits('2', 'gwei')

const ModalHeader = styled(UIKitModalHeader)`
`

const WalletModal: React.FC<WalletModalProps> = ({ initialView = WalletView.WALLET_INFO, onDismiss }) => {
  const { t } = useTranslation()
  const { balance, fetchStatus } = useGetBnbBalance()
  const hasLowBnbBalance = fetchStatus === FetchStatus.Fetched && balance.lte(LOW_BNB_BALANCE)

  return (
    <ModalContainer title={t('Welcome!')} minWidth="320px">
      <ModalHeader>
        <ModalTitle>
          <Heading>{t('Your Wallet')}</Heading>
        </ModalTitle>
        <IconButton variant="text" onClick={onDismiss}>
          <CloseIcon width="24px" color="text" />
        </IconButton>
      </ModalHeader>
      <ModalBody p="24px" maxWidth="400px" width="100%">
        {initialView === WalletView.WALLET_INFO && <WalletInfo hasLowBnbBalance={hasLowBnbBalance} onDismiss={onDismiss} />}
        {initialView === WalletView.TRANSACTIONS && <WalletTransactions />}
      </ModalBody>
    </ModalContainer>
  )
}

export default WalletModal
