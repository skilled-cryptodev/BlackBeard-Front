import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import stakingABI from 'config/abi/staking.json'
import multicall from 'utils/multicall'
import { getStakingAddress } from 'utils/addressHelpers'
import { StakingConfig } from 'config/constants/types'
import tokens from 'config/constants/tokens'

export const fetchStakingUserAllowances = async (account: string) => {
  const stakingAddress = getStakingAddress()

  const call = [{ 
      address: tokens.bbdt.address, 
      name: 'allowance', 
      params: [account, stakingAddress] 
    }]

  const rawAllowances = await multicall(erc20ABI, call)

  const parsedUserAllowances = new BigNumber(rawAllowances).toJSON()
  return parsedUserAllowances
}

export const fetchStakingUserTotalStaked = async (account: string) => {
  const stakingAddress = getStakingAddress()

  const calls = [
    {
      address: stakingAddress,
      name: 'userTotalStaked',
      params: [account],
    }
  ]

  const rawUserTotalStaked = await multicall(stakingABI, calls)
  const parsedUserTotalStaked = new BigNumber(rawUserTotalStaked).toJSON()  
  return parsedUserTotalStaked
}

export const fetchStakingUserTotalEarned = async (account: string) => {
  const stakingAddress = getStakingAddress()

  const calls = [
    {
      address: stakingAddress,
      name: 'userTotalEarned',
      params: [account],
    }
  ]

  const rawUserTotalEarned = await multicall(stakingABI, calls)
  const parsedUserTotalEarned = new BigNumber(rawUserTotalEarned).toJSON()  
  return parsedUserTotalEarned
}

export const fetchStakingUserAmount = async (account: string, stakingsToFetch: StakingConfig[]) => {
  const stakingAddress = getStakingAddress()

  const calls = stakingsToFetch.map((farm) => {
    return {
      address: stakingAddress,
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })

  const rawUserInfo = await multicall(stakingABI, calls)
  const parsedStakedAmounts = rawUserInfo.map((userInfo) => {
    return new BigNumber(userInfo[0]._hex).toJSON()
  })
  return parsedStakedAmounts
}

export const fetchStakingUserDepositTime = async (account: string, stakingsToFetch: StakingConfig[]) => {
  const stakingAddress = getStakingAddress()

  const calls = stakingsToFetch.map((farm) => {
    return {
      address: stakingAddress,
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })

  const rawUserInfo = await multicall(stakingABI, calls)
  const parsedDepositTimes = rawUserInfo.map((userInfo) => {
    return new BigNumber(userInfo[1]._hex).toJSON()
  })
  return parsedDepositTimes
}
