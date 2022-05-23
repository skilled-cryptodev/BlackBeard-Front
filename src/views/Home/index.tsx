import React, { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Box, Button, Card, CardBody, Flex, Input, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'
import useToast from 'hooks/useToast'
import { useERC20 } from 'hooks/useContract'
import useTotalSupply from 'hooks/useTotalSupply'
import { usePriceBeardBusd } from 'state/farms/hooks'
import { fetchStakingsPublicDataAsync } from 'state/stakings'
import { useStakings, usePollStakingsWithUserData } from 'state/stakings/hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import { getStakingAddress } from 'utils/addressHelpers'
import { getBalanceAmount } from 'utils/formatBalance'
import { logError } from 'utils/sentry'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Page from 'components/Layout/Page'
import { RowBetween } from 'components/Layout/Row'
import useApproveStaking from './hooks/useApproveStaking'

const StyledInputArea = styled(RowBetween)`
  border: solid 1px #7aff00;
  border-radius: 16px;
  padding: 0 10px;
`

const StyledBorderArea = styled(RowBetween)`
  border: solid 1px #7aff00;
  border-radius: 16px;
  padding: 10px 20px;
`

const StyledBorderBox = styled(Box)`
  border: solid 1px #7aff00;
  border-radius: 16px;
  padding: 20px;
`

const lockdayList = [30, 60, 90, 180, 360]
const apyList = [3, 7, 10, 25, 60]

const Home: React.FC = () => {
  const { t } = useTranslation()
  const { toastError } = useToast()
  const { account } = useWeb3React()

  const [pid, setPid] = useState(0)
  const [lockDay, setLockDay] = useState(lockdayList[pid])
  const [lockAPY, setLockAPY] = useState(apyList[pid])

  const [requestedApproval, setRequestedApproval] = useState(false)

  const dispatch = useAppDispatch()

  usePollStakingsWithUserData()

  const { data, allowance, totalStaked, totalEarned } = useStakings()

  const userAllowance = new BigNumber(allowance)
  const userTotalStaked = new BigNumber(totalStaked)
  const userTotalEarned = new BigNumber(totalEarned)

  const handleLockDayChange = (value: number, index: number) => {
    setLockDay(value)
    setLockAPY(apyList[index])
    setPid(index)
  }

  const now = new Date()
  const unlockDate = new Date(now.setDate(now.getDate() + lockDay))

  const tokenContract = useERC20(tokens.bbdt.address)

  const poolTotalStaked = useTokenBalance(getStakingAddress(), tokens.bbdt)
  const totalSupply = useTotalSupply(tokens.bbdt)
  const stakedPercent = poolTotalStaked && totalSupply ? new BigNumber(poolTotalStaked.toSignificant(4)).div(new BigNumber(totalSupply.toSignificant(4))).toFixed(2) : 0

  const beardPriceBusd = usePriceBeardBusd()

  const { onApprove } = useApproveStaking(tokenContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchStakingsPublicDataAsync({ account }))
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setRequestedApproval(false)
    }
  }, [onApprove, dispatch, account, t, toastError])

  const renderApprovalOrStakeButton = () => {
    const isApproved = account && userAllowance && userAllowance.isGreaterThan(0)
    return isApproved ? (
      <Button variant="secondary" minWidth="200px" >{`Stake ${lockDay}days`}</Button>
    ) : (
      <Button variant="secondary" minWidth="200px" disabled={requestedApproval} onClick={handleApprove}>
        {t('Enable Contract')}
      </Button>
    )
  }

  return (
    <Page>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" width="100%" mb="20px">
        <Text fontSize="30px">{t('Staking Dashboard')}</Text>
        <Text fontSize="26px">{t('High APR, Low Risk')}</Text>
      </Flex>
      <Card>
        <CardBody m="0 30px">
          <Flex justifyContent="center">
            <Text fontSize="36px">{t('BBDT Calculator')}</Text>
          </Flex>
          <RowBetween mt="30px">
            <StyledBorderArea maxWidth="380px">
              <Text>{t('BBDT')}</Text>
              <StyledInputArea maxWidth="280px">
                <Input />
                <Text ml="20px">{t('MAX')}</Text>
              </StyledInputArea>
            </StyledBorderArea>
            <Text fontSize="30px">{`APR ${lockAPY}%`}</Text>
          </RowBetween>
          <StyledBorderBox mt="30px">
            <Text>{t('Lock tokens for :')}</Text>
            <RowBetween mt="10px">
              {lockdayList.map((item, index) => {
                const handleClick = () => {
                  handleLockDayChange(item, index)
                }

                return (
                  <Button
                    key={item}
                    scale="md"
                    variant={lockDay === item ? "secondary" : "tertiary"}
                    onClick={handleClick}
                    style={{ flex: 1 }}
                    mr="5px"
                    ml="5px"
                  >
                    {`${item}days`}
                  </Button>
                )
              })}
            </RowBetween>
          </StyledBorderBox>
          <Flex flexDirection="column" justifyContent="center" alignItems="center" mt="40px">
            <Text fontSize="20px">{`Upto ${lockAPY}% return on ${lockDay}days`}</Text>
            <Text fontSize="20px">{`Lock until ${unlockDate.getDate()}/${unlockDate.getMonth() + 1}/${unlockDate.getFullYear()} ${unlockDate.getHours()}:${unlockDate.getMinutes()}`}</Text>
          </Flex>
          <Flex flexDirection="column" justifyContent="center" alignItems="center" mt="20px">
            {!account ? <ConnectWalletButton /> : renderApprovalOrStakeButton()}
          </Flex>
        </CardBody>
      </Card>
      <Card mt="20px">
        <CardBody m="0 30px">
          <RowBetween width="100%">
            <StyledBorderBox width="49%" minHeight="170px">
              <Box>
                <Text fontSize="20px">{t('BBDT Staked')}</Text>
                <Text fontSize="18px" color="primary">{`${userTotalStaked ? getBalanceAmount(userTotalStaked, 9) : 0} BBDT`}</Text>
              </Box>
              <Box mt="10px">
                <Text fontSize="20px">{t('BBDT Earned')}</Text>
                <Text fontSize="18px" color="primary">{`${userTotalEarned ? getBalanceAmount(userTotalEarned, 9) : 0} BBDT`}</Text>
              </Box>
            </StyledBorderBox>
            <StyledBorderBox width="49%" minHeight="170px">
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Text fontSize="30px" mt="20px">{t('Total Value (USDT)')}</Text>
                <Text fontSize="32px" color="primary">{poolTotalStaked && beardPriceBusd ? beardPriceBusd.times(new BigNumber(poolTotalStaked.toSignificant(4))).toFixed(2) : 0}</Text>
              </Flex>
            </StyledBorderBox>
          </RowBetween>
          <StyledBorderBox mt="20px">
            <RowBetween>
              <Text fontSize="20px">{t('Total Staked :')}</Text>
              <Text fontSize="20px">{poolTotalStaked ? poolTotalStaked.toSignificant(4) : 0} BBDT</Text>
            </RowBetween>
            <RowBetween mt="20px">
              <Text fontSize="20px">{t('% Staked :')}</Text>
              <Text fontSize="20px">{stakedPercent} %</Text>
            </RowBetween>
          </StyledBorderBox>
        </CardBody>
      </Card>
    </Page>
  )
}

export default Home
