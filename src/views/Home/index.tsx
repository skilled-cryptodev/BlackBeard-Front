import React, { useState } from 'react'
import { Box, Button, Card, CardBody, Flex, Input, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import PageSection from 'components/PageSection'
import { useWeb3React } from '@web3-react/core'
import useTheme from 'hooks/useTheme'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Container from 'components/Layout/Container'
import Page, { PageMeta } from 'components/Layout/Page'
import { RowBetween, RowFlat } from 'components/Layout/Row'

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

const showBanner = true
const lockdayList = [30, 60, 90, 180, 360]
const apyList = [3, 7, 10, 25, 60]

const Home: React.FC = () => {
  const { theme } = useTheme()
  const { account } = useWeb3React()

  const [ lockDay, setLockDay ] = useState(30)
  const [ lockAPY, setLockAPY ] = useState(30)

  const handleLockDayChange = (value: number, index: number) => {
    setLockDay(value)
    setLockAPY(apyList[index])
  }

  const now = new Date()
  const unlockDate = new Date(now.setDate(now.getDate() + lockDay))

  console.log("pooh, unlockDate = ", unlockDate.toUTCString())

  return (
    <Page>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" width="100%" mb="20px">
        <Text fontSize="30px">Staking Dashboard</Text>
        <Text fontSize="26px">High APR, Low Risk</Text>
      </Flex>
      <Card>
        <CardBody m="0 30px">
          <Flex justifyContent="center">
            <Text fontSize="36px">BBDT Calculator</Text>
          </Flex>
          <RowBetween mt="30px">
            <StyledBorderArea maxWidth="380px">
              <Text>BBDT</Text>
              <StyledInputArea maxWidth="280px">
                <Input />
                <Text ml="20px">MAX</Text>
              </StyledInputArea>
            </StyledBorderArea>
            <Text fontSize="30px">{`APR ${lockAPY}%`}</Text>
          </RowBetween>
          <StyledBorderBox mt="30px">
            <Text>Lock tokens for :</Text>
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
                    {`${item} days`}
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
            <ConnectWalletButton />
          </Flex>
        </CardBody>
      </Card>
      <Card mt="20px">
        <CardBody m="0 30px">
          <RowBetween width="100%">
            <StyledBorderBox width="49%" minHeight="170px">
              <Box>
                <Text fontSize="20px">BBDT Staked</Text>
                <Text fontSize="18px" color="primary">xxxxxxxxx</Text>
              </Box>
              <Box mt="10px">
                <Text fontSize="20px">BBDT Earned</Text>
                <Text fontSize="18px" color="primary">xxxxxxxxx</Text>
              </Box>
            </StyledBorderBox>
            <StyledBorderBox width="49%" minHeight="170px">
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Text fontSize="30px" mt="20px">Total Value (USDT)</Text>
                <Text fontSize="32px" color="primary">xxxxxxxxx</Text>
              </Flex>
            </StyledBorderBox>
          </RowBetween>
          <StyledBorderBox mt="20px">
            <RowBetween>
              <Text fontSize="20px">Total Staked :</Text>
              <Text fontSize="20px">0.00 BBDT</Text>
            </RowBetween>
            <RowBetween mt="20px">
              <Text fontSize="20px">% Staked :</Text>
              <Text fontSize="20px">0.00 %</Text>
            </RowBetween>
          </StyledBorderBox>
        </CardBody>
      </Card>
    </Page>
  )
}

export default Home
