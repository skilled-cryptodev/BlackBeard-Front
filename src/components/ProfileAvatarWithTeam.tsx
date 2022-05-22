import React from 'react'
import { NoProfileAvatarIcon } from '@pancakeswap/uikit'
import { Profile } from 'state/types'
import styled from 'styled-components'

export interface ProfileAvatarProps {
  profile: Profile
}

const AvatarWrapper = styled.div`
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  position: relative;
  width: 100%;
  height: 100%;

  & > img {
    border-radius: 50%;
  }
`
// TODO: replace with no profile avatar icon
const AvatarInactive = styled(NoProfileAvatarIcon)`
  width: 100%;
  height: 100%;
`

const ProfileAvatarWithTeam: React.FC<ProfileAvatarProps> = ({ profile }) => {
  return (
    <AvatarWrapper>
      {!profile.isActive && <AvatarInactive />}
    </AvatarWrapper>
  )
}

export default ProfileAvatarWithTeam
