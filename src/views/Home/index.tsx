import React, { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Box, Button, Card, CardBody, Flex, Heading, Input, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'
import stakingsConfig from 'config/constants/stakings'
import tokens from 'config/constants/tokens'
import { FetchStatus } from 'config/constants/types'
import useToast from 'hooks/useToast'
import { useERC20 } from 'hooks/useContract'
import useTotalSupply from 'hooks/useTotalSupply'
import useTokenBalance from 'hooks/useTokenBalance'
import { usePriceBeardBusd } from 'state/farms/hooks'
import { fetchStakingsPublicDataAsync, fetchStakingUserDataAsync } from 'state/stakings'
import { useStakings, usePollStakingsWithUserData } from 'state/stakings/hooks'
import { useTokenBalance as useContractTokenBalance } from 'state/wallet/hooks'
import { getStakingAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getFullDisplayBalance } from 'utils/formatBalance'
import { logError } from 'utils/sentry'
import getTimePeriods from 'utils/getTimePeriods'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Page from 'components/Layout/Page'
import { RowBetween } from 'components/Layout/Row'
import useApproveStaking from './hooks/useApproveStaking'
import useStakeStaking from './hooks/useStakeStaking'
import useWithdrawStaking from './hooks/useWithdrawStaking'

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

const MaxButtonArea = styled.div`
  margin-left: 20px;
  font-size: 16px;
  cursor: pointer;
`

const StyledCard = styled(Card)`
  margin: 0 30px;
  ${({ theme }) => theme.mediaQueries.xxs} {
    margin: 0 0px;
    margin-bottom: 20px;
  }
  ${({ theme }) => theme.mediaQueries.xs} {
    margin: 0 5px;
    margin-bottom: 20px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 15px;
    margin-bottom: 20px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin: 0 20px;
    margin-bottom: 20px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0 25px;
    margin-bottom: 20px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    margin: 0 30px;
    margin-bottom: 20px;
  }

  margin-bottom: 20px;
`

const StyledCardBody = styled(CardBody)`
  margin: 0 30px;
  padding: 24px;
  ${({ theme }) => theme.mediaQueries.xxs} {
    margin: 0 0px;
    padding: 15px 5px;
  }
  ${({ theme }) => theme.mediaQueries.xs} {
    margin: 0 5px;
    padding: 15px 10px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 15px;
    padding: 15px 15px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin: 0 20px;
    padding: 20px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0 25px;
    padding: 24px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    margin: 0 30px;
    padding: 24px;
  }
`

const Home: React.FC = () => {
  const { t } = useTranslation()
  const { toastError } = useToast()
  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints()

  const [pid, setPid] = useState(0)
  const [lockDay, setLockDay] = useState(stakingsConfig[pid].lockDay)
  const [lockAPY, setLockAPY] = useState(stakingsConfig[pid].apy)

  const [depositValue, setDepositValue] = useState(0)

  const [userStakedAmount, setUserStakedAmount] = useState<BigNumber>(new BigNumber(0))
  const [userDepositTime, setUserDepositTime] = useState(0)

  const [requestedApproval, setRequestedApproval] = useState(false)

  const dispatch = useAppDispatch()

  usePollStakingsWithUserData()

  const { data, allowance, totalStaked, totalEarned } = useStakings()

  const userAllowance = new BigNumber(allowance)
  const userTotalStaked = new BigNumber(totalStaked)
  const userTotalEarned = new BigNumber(totalEarned)

  const handleLockDayChange = (value: number, index: number) => {
    setPid(index)
    setLockDay(value)
    setLockAPY(stakingsConfig[index].apy)
  }

  useEffect(() => {
    if (data) {
      setUserStakedAmount(new BigNumber(data[pid].userData.amount))
      setUserDepositTime(Number(data[pid].userData.depositTime))
    }
  }, [pid, data])

  const now = new Date()
  const unlockDate = new Date(now.setDate(now.getDate() + lockDay))

  const userStakeUnlockTime = userDepositTime + lockDay * 86400;
  const userStakeUnlockPeriod = now.getTime() / 1000 > userStakeUnlockTime ? 0 : userStakeUnlockTime - now.getTime() / 1000

  const { days: lockDays, hours: lockHours, minutes: lockMinutes } = getTimePeriods(userStakeUnlockPeriod)

  const tokenContract = useERC20(tokens.bbdt.address)

  const poolTotalStaked = useContractTokenBalance(getStakingAddress(), tokens.bbdt)
  const totalSupply = useTotalSupply(tokens.bbdt)
  const stakedPercent = poolTotalStaked && totalSupply ? new BigNumber(poolTotalStaked.toSignificant(4)).div(new BigNumber(totalSupply.toSignificant(4))).toFixed(2) : 0

  const { balance: beardBalance, fetchStatus: beardFetchStatus } = useTokenBalance(tokens.bbdt.address)  

  const handleMax = () => {
    if (beardFetchStatus === FetchStatus.Fetched) {
      const fullDisplayBalance =  getFullDisplayBalance(beardBalance, 9)
      setDepositValue(Number(fullDisplayBalance))
    } else {
      setDepositValue(0)
    }
  }

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

  const { onStake } = useStakeStaking(pid)
  const { onWithdraw } = useWithdrawStaking(pid)

  const handleStake = async (amount: string) => {
    await onStake(amount)
    dispatch(fetchStakingUserDataAsync({ account, pids: [pid] }))
  }

  const handleWithdraw = async () => {
    await onWithdraw()
    dispatch(fetchStakingUserDataAsync({ account, pids: [pid] }))
  }

  const renderApprovalOrStakeButton = () => {
    const isApproved = account && userAllowance && userAllowance.isGreaterThan(0)
    return isApproved && beardFetchStatus === FetchStatus.Fetched ? (
      <Button 
        variant="secondary" 
        minWidth="200px" 
        disabled={
          userStakeUnlockPeriod > 0 || 
          depositValue < 10000 || 
          depositValue > Number(getFullDisplayBalance(beardBalance, 9))
        }
        onClick={async () =>{await handleStake(depositValue.toString())}}
      >
        { userStakeUnlockPeriod > 0 ?
          `${lockDays}days ${lockHours}hours ${lockMinutes}minutes Locked`
          :
          (
            depositValue < 10000 || depositValue > Number(getFullDisplayBalance(beardBalance, 9)) ? 
            'Invalid stake amount'
            :
            `Stake ${lockDay}days`
          )
        }
      </Button>
    ) : (
      <Button variant="secondary" minWidth="200px" disabled={requestedApproval} onClick={handleApprove}>
        {t('Enable Contract')}
      </Button>
    )
  }

  const renderWithdrawButton = () => {
    return (
      <Button 
        variant="secondary"
        minWidth="200px"
        ml="10px"
        onClick={async () =>{await handleWithdraw()}}
      >
        {t(`Withdraw`)}
      </Button>
    )
  }

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setDepositValue(Number(e.currentTarget.value))
  }

  return (
    <Page>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" width="100%" mb="20px">
        <Heading as="h1" scale={isMobile ? "md" : "xl"}>{t('Staking Dashboard')}</Heading>
        <Heading as={isMobile ? "h3" : "h2"} >{t('High APR, Low Risk')}</Heading>
      </Flex>
      <StyledCard>
        <StyledCardBody>
          <Flex justifyContent="center">
            <Heading as="h1" scale={isMobile ? "md" : "xl"}>{t('BBDT Calculator')}</Heading>
          </Flex>
          <RowBetween mt="30px">
            <StyledBorderArea maxWidth="380px">
              <Text mr="5px">{t('BBDT')}</Text>
              <StyledInputArea maxWidth="280px">
                <Input value={depositValue} onChange={handleInputChange} />
                <MaxButtonArea onClick={handleMax}>{t('MAX')}</MaxButtonArea>
              </StyledInputArea>
            </StyledBorderArea>
            {!isMobile && <Heading as="h1" scale="xl">{`APR ${lockAPY}%`}</Heading>}
          </RowBetween>
          <StyledBorderBox mt="30px">
            <Text>{t('Lock tokens for :')}</Text>
            <RowBetween mt="10px">
              {stakingsConfig.map((stakingConfig, index) => {
                const handleClick = () => {
                  handleLockDayChange(stakingConfig.lockDay, index)
                }
                return (
                  <Button
                    key={stakingConfig.lockDay}
                    scale={isMobile ? "xs" : "md"}
                    variant={lockDay === stakingConfig.lockDay ? "secondary" : "tertiary"}
                    onClick={handleClick}
                    style={{ flex: 1 }}
                    mr="5px"
                    ml="5px"
                  >
                    {`${stakingConfig.lockDay}${!isMobile ? 'days' : ''}`}
                  </Button>
                )
              })}
            </RowBetween>
          </StyledBorderBox>
          <Flex flexDirection="column" justifyContent="center" alignItems="center" mt="40px">
            <Text fontSize={isMobile ? "16px" : "20px"}>{`Upto ${lockAPY}% return on ${lockDay}days`}</Text>
            <Text fontSize={isMobile ? "16px" : "20px"}>{`Lock until ${unlockDate.getDate()}/${unlockDate.getMonth() + 1}/${unlockDate.getFullYear()} ${unlockDate.getHours()}:${unlockDate.getMinutes()}`}</Text>
          </Flex>
          <Flex justifyContent="center" alignItems="center" mt="20px">
            {!account ? <ConnectWalletButton /> : renderApprovalOrStakeButton()}
            {userStakeUnlockPeriod === 0 && userStakedAmount.gt(0) && renderWithdrawButton() }
          </Flex>
        </StyledCardBody>
      </StyledCard>
      <StyledCard>
        <StyledCardBody>
          <Flex width="100%" flexDirection={isMobile ? "column" : "row"} justifyContent="space-between">
            <StyledBorderBox width={isMobile ? "100%" : "49%"} minHeight="170px">
              <Box>
                <Text fontSize="20px">{t('BBDT Staked')}</Text>
                <Text fontSize="18px" color="primary">{`${userTotalStaked ? getBalanceAmount(userTotalStaked, 9) : 0} BBDT`}</Text>
              </Box>
              <Box mt="10px">
                <Text fontSize="20px">{t('BBDT Earned')}</Text>
                <Text fontSize="18px" color="primary">{`${userTotalEarned ? getBalanceAmount(userTotalEarned, 9) : 0} BBDT`}</Text>
              </Box>
            </StyledBorderBox>
            <StyledBorderBox width={isMobile ? "100%" : "49%"} minHeight="170px" mt={isMobile ? "20px" : '0px'}>
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Text fontSize={isMobile ? "20px" : "30px"} mt="30px">{t('Total Value (USDT)')}</Text>
                <Text fontSize={isMobile ? "22px" : "32px"} color="primary">{poolTotalStaked && beardPriceBusd ? beardPriceBusd.times(new BigNumber(poolTotalStaked.toSignificant(4))).toFixed(2) : 0}</Text>
              </Flex>
            </StyledBorderBox>
          </Flex>
          <StyledBorderBox mt="20px">
            <Flex width="100%" flexDirection={isMobile ? "column" : "row"} justifyContent="space-between">
              <Text fontSize="20px">{t('Total Staked :')}</Text>
              <Text fontSize="20px">{poolTotalStaked ? poolTotalStaked.toSignificant(4) : 0} BBDT</Text>
            </Flex>
            <Flex width="100%" flexDirection={isMobile ? "column" : "row"} justifyContent="space-between" mt="20px">
              <Text fontSize="20px">{t('% Staked :')}</Text>
              <Text fontSize="20px">{stakedPercent} %</Text>
            </Flex>
          </StyledBorderBox>
        </StyledCardBody>
      </StyledCard>
    </Page>
  )
}

export default Home
