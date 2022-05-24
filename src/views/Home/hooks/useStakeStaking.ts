import { useCallback } from 'react'
import { stakeStaking } from 'utils/calls'
import { useStaking } from 'hooks/useContract'

const useStakeStaking = (pid: number) => {
  const stakingContract = useStaking()

  const handleStakeStaking = useCallback(
    async (amount: string) => {
      const txHash = await stakeStaking(stakingContract, pid, amount)
      console.info(txHash)
    },
    [stakingContract, pid],
  )

  return { onStake: handleStakeStaking }
}

export default useStakeStaking
