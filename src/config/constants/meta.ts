import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Black Beard',
  description: 'Black Beard Staking Dashboard',
  image: 'https://blackbeard.netlify.com/images/logo.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {  
  return {
    title: `${t('Black Beard')}`,
  }
}
