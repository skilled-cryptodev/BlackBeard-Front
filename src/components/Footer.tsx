import React from 'react'
import styled from 'styled-components'
import { Flex, Link, TwitterIcon, TelegramIcon, LangSelector } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { languageList } from 'config/localization/languages'

const StyledFooterWrapper = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  max-width: 1200px;
  margin: 15px auto;
  align-items: center;  
`

const LogoImage = styled.img`
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin-right: 50px;
`

const Footer: React.FC = () => {
  const { currentLanguage, setLanguage } = useTranslation()

  return (
    <StyledFooterWrapper>
      <Flex>
        <LogoImage src="/images/logo.png" alt="Get some help" />
        <LangSelector
          width={50}
          currentLang={currentLanguage}
          langs={languageList}
          setLang={setLanguage}
          dropdownPosition="top"
          color="white"
          hideLanguage
        />
      </Flex>
      <Flex>
        <Link fontSize="14px" href="https://twitter.com/blackbeard" external mr="20px">
          <TwitterIcon width="30px" />
        </Link>
        <Link fontSize="14px" href="https://telegram.org/blackbeard" external>
          <TelegramIcon width="30px" />
        </Link>
      </Flex>
    </StyledFooterWrapper>
  )
}

export default Footer
