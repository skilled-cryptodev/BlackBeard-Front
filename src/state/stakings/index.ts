import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import stakingsConfig from 'config/constants/stakings'
import { 
  fetchStakingUserAllowances,
  fetchStakingUserTotalStaked,
  fetchStakingUserTotalEarned,
  fetchStakingUserAmount,
  fetchStakingUserDepositTime
} from './fetchStakingUser'
import { StakingsState } from '../types'

const accountStakingConfig = stakingsConfig.map((staking) => ({
  ...staking,
  userData: {
    amount: '0',
    depositTime: '0',
  }
}))

const initialState: StakingsState = {
  data: accountStakingConfig,
  allowance: '0',
  totalStaked: '0',
  totalEarned: '0',
  loadArchivedStakingsData: false,
  userDataLoaded: false
}

interface StakingPublicDataResponse {
  allowance: string
  totalStaked: string
  totalEarned: string
}

export const fetchStakingsPublicDataAsync = createAsyncThunk<StakingPublicDataResponse, { account: string }>(
  'stakings/fetchStakingPublicDataAsync',
  async ({account}) => {
    const userAllowance = await fetchStakingUserAllowances(account)
    const userTotalStaked = await fetchStakingUserTotalStaked(account)
    const userTotalEarned = await fetchStakingUserTotalEarned(account)

    return {
      allowance: userAllowance,
      totalStaked: userTotalStaked,
      totalEarned: userTotalEarned
    }
  },
)

interface StakingUserDataResponse {
  pid: number
  amount: string
  depositTime: string
}

export const fetchStakingUserDataAsync = createAsyncThunk<StakingUserDataResponse[], { account: string; pids: number[] }>(
  'stakings/fetchStakingUserDataAsync',
  async ({ account, pids }) => {
    const stakingsToFetch = stakingsConfig.filter((stakingConfig) => pids.includes(stakingConfig.pid))
    const userStakingAmounts = await fetchStakingUserAmount(account, stakingsToFetch)
    const userStakingDepositTimes = await fetchStakingUserDepositTime(account, stakingsToFetch)

    return userStakingAmounts.map((stakingAmount, index) => {
      return {
        pid: stakingsToFetch[index].pid,
        amount: userStakingAmounts[index],
        depositTime: userStakingDepositTimes[index],
      }
    })
  },
)

export const stakingsSlice = createSlice({
  name: 'Stakings',
  initialState,
  reducers: {
    setLoadArchivedStakingsData: (state, action) => {
      const loadArchivedStakingsData = action.payload
      state.loadArchivedStakingsData = loadArchivedStakingsData
    },
  },
  extraReducers: (builder) => {

    builder.addCase(fetchStakingsPublicDataAsync.fulfilled, (state, action) => {
      state.allowance = action.payload.allowance
      state.totalStaked = action.payload.totalStaked
      state.totalEarned = action.payload.totalEarned
    })

    builder.addCase(fetchStakingUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { pid } = userDataEl
        const index = state.data.findIndex((staking) => staking.pid === pid)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    })
  }
})

export const { setLoadArchivedStakingsData } = stakingsSlice.actions

export default stakingsSlice.reducer