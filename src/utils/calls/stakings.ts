import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, BEARD_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const stakeStaking = async (stakingContract, pid, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(BEARD_TOKEN_DECIMAL).toString()

  const tx = await stakingContract.deposit(pid, value, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

export const withdrawStaking = async (stakingContract, pid) => {
  const gasPrice = getGasPrice()

  const tx = await stakingContract.withdraw(pid, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}