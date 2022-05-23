import { StakingConfig } from './types'

const Stakings: StakingConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 0,
    apy: 3,
    lockDay: 30
  },
  {
    pid: 1,
    apy: 7,
    lockDay: 60
  },
  {
    pid: 2,
    apy: 10,
    lockDay: 90
  },
  {
    pid: 3,
    apy: 25,
    lockDay: 180
  },
  {
    pid: 4,
    apy: 60,
    lockDay: 360
  },
]

export default Stakings
