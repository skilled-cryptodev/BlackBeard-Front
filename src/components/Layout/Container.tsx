import React from 'react'
import { Box, BoxProps } from '@pancakeswap/uikit'

const Container: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box px={['8px', '10px', '16px', '24px']} mx="auto" maxWidth="1200px" {...props}>
    {children}
  </Box>
)

export default Container
