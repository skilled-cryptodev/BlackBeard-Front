import { useCallback } from 'react'
import { withdrawStaking } from 'utils/calls'
import { useStaking } from 'hooks/useContract'

const useWithdrawStaking = (pid: number) => {
  const stakingContract = useStaking()

  const handleWithdraw = useCallback(
    async () => {
      await withdrawStaking(stakingContract, pid)
    },
    [stakingContract, pid],
  )

  return { onWithdraw: handleWithdraw }
}

export default useWithdrawStaking
