import { ThunkAction } from 'redux-thunk'
import { AnyAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import {
  SerializedFarmConfig,
  DeserializedPoolConfig,
  SerializedPoolConfig,
  Team,
  DeserializedFarmConfig,
  FetchStatus,
} from 'config/constants/types'

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, AnyAction>

export interface BigNumberToJson {
  type: 'BigNumber'
  hex: string
}

export type SerializedBigNumber = string

interface SerializedFarmUserData {
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
}

export interface DeserializedFarmUserData {
  allowance: BigNumber
  tokenBalance: BigNumber
  stakedBalance: BigNumber
  earnings: BigNumber
}

export interface SerializedFarm extends SerializedFarmConfig {
  tokenPriceBusd?: string
  quoteTokenPriceBusd?: string
  tokenAmountTotal?: SerializedBigNumber
  lpTotalInQuoteToken?: SerializedBigNumber
  lpTotalSupply?: SerializedBigNumber
  tokenPriceVsQuote?: SerializedBigNumber
  poolWeight?: SerializedBigNumber
  userData?: SerializedFarmUserData
}

export interface DeserializedFarm extends DeserializedFarmConfig {
  tokenPriceBusd?: string
  quoteTokenPriceBusd?: string
  tokenAmountTotal?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  lpTotalSupply?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: BigNumber
  userData?: DeserializedFarmUserData
}

export enum VaultKey {
  CakeVault = 'cakeVault',
  IfoPool = 'ifoPool',
}

interface CorePoolProps {
  startBlock?: number
  endBlock?: number
  apr?: number
  rawApr?: number
  stakingTokenPrice?: number
  earningTokenPrice?: number
  vaultKey?: VaultKey
}

export interface DeserializedPool extends DeserializedPoolConfig, CorePoolProps {
  totalStaked?: BigNumber
  stakingLimit?: BigNumber
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}

export interface SerializedPool extends SerializedPoolConfig, CorePoolProps {
  totalStaked?: SerializedBigNumber
  stakingLimit?: SerializedBigNumber
  userData?: {
    allowance: SerializedBigNumber
    stakingTokenBalance: SerializedBigNumber
    stakedBalance: SerializedBigNumber
    pendingReward: SerializedBigNumber
  }
}

export interface Profile {
  userId: number
  points: number
  teamId: number
  collectionAddress: string
  tokenId: number
  isActive: boolean
  username: string
  hasRegistered: boolean
}

// Slices states

export interface SerializedFarmsState {
  data: SerializedFarm[]
  loadArchivedFarmsData: boolean
  userDataLoaded: boolean
  loadingKeys: Record<string, boolean>
}

export interface DeserializedFarmsState {
  data: DeserializedFarm[]
  loadArchivedFarmsData: boolean
  userDataLoaded: boolean
}

export interface VaultFees {
  performanceFee: number
  callFee: number
  withdrawalFee: number
  withdrawalFeePeriod: number
}

export interface VaultUser {
  isLoading: boolean
  userShares: string
  cakeAtLastUserAction: string
  lastDepositedTime: string
  lastUserActionTime: string
}

export interface IfoVaultUser extends VaultUser {
  credit: string
}

export interface CakeVault {
  totalShares?: string
  pricePerFullShare?: string
  totalCakeInVault?: string
  estimatedCakeBountyReward?: string
  totalPendingCakeHarvest?: string
  fees?: VaultFees
  userData?: VaultUser
}

export interface IfoCakeVault extends Omit<CakeVault, 'userData'> {
  userData?: IfoVaultUser
  creditStartBlock?: number
  creditEndBlock?: number
}

export interface PoolsState {
  data: SerializedPool[]
  cakeVault: CakeVault
  ifoPool: IfoCakeVault
  userDataLoaded: boolean
}

export interface ProfileState {
  isInitialized: boolean
  isLoading: boolean
  hasRegistered: boolean
  data: Profile
  profileAvatars: {
    [key: string]: {
      username: string
      hasRegistered: boolean
      usernameFetchStatus: FetchStatus
      avatarFetchStatus: FetchStatus
    }
  }
}

export type TeamResponse = {
  0: string
  1: string
  2: string
  3: string
  4: boolean
}

export type TeamsById = {
  [key: string]: Team
}

// Block

export interface BlockState {
  currentBlock: number
  initialBlock: number
}

// Global state

export interface State {
  block: BlockState
  farms: SerializedFarmsState
  pools: PoolsState
  profile: ProfileState
}
