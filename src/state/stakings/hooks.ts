import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { useSlowFresh } from 'hooks/useRefresh'
import { stakingsConfig } from 'config/constants'
import { fetchStakingsPublicDataAsync, fetchStakingUserDataAsync } from '.'
import { State, StakingsState } from '../types'

export const usePollStakingsWithUserData = () => {
  const dispatch = useAppDispatch()
  const slowRefresh = useSlowFresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const pids = stakingsConfig.map((stakingToFetch) => stakingToFetch.pid)

    if (account) {
      dispatch(fetchStakingsPublicDataAsync({ account }))
      dispatch(fetchStakingUserDataAsync({ account, pids }))
    }
  }, [dispatch, slowRefresh, account])
}

export const useStakings = (): StakingsState => {
  const stakings = useSelector((state: State) => state.stakings)
  return stakings
}