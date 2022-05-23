import { useCallback } from 'react'
import { ethers, Contract } from 'ethers'
import { useStaking } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const useApproveStaking = (tokenContract: Contract) => {
  const stakingContract = useStaking()
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    const tx = await callWithGasPrice(tokenContract, 'approve', [stakingContract.address, ethers.constants.MaxUint256])
    const receipt = await tx.wait()
    return receipt.status
  }, [tokenContract, stakingContract, callWithGasPrice])

  return { onApprove: handleApprove }
}

export default useApproveStaking
