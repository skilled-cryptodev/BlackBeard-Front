import { configureStore } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'
import cloneDeep from 'lodash/cloneDeep'
import { useDispatch } from 'react-redux'
import farmsReducer from './farms'
import stakingsReducer from './stakings'
import poolsReducer from './pools'
import profileReducer, { initialState as profileInitialState } from './profile'
import blockReducer from './block'
import infoReducer from './info'
import { updateVersion } from './global/actions'
import user, { initialState as userInitialState } from './user/reducer'
import transactions, { initialState as transactionsInitialState } from './transactions/reducer'
import swap from './swap/reducer'
import mint from './mint/reducer'
import lists, { initialState as listsInitialState } from './lists/reducer'
import burn from './burn/reducer'
import multicall from './multicall/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists', 'profile']

const safeCloneDeep = <T>(state: T) => {
  try {
    return JSON.parse(JSON.stringify(state)) as T
  } catch (error) {
    console.error(error)
    return cloneDeep(state)
  }
}

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    block: blockReducer,
    farms: farmsReducer,
    stakings: stakingsReducer,
    pools: poolsReducer,
    profile: profileReducer,
    info: infoReducer,

    // Exchange
    user,
    transactions,
    swap,
    mint,
    burn,
    multicall,
    lists,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ thunk: true }),
    save({ states: PERSISTED_KEYS, debounce: 1000 }),
  ],
  preloadedState: load({
    states: PERSISTED_KEYS,
    preloadedState: {
      user: safeCloneDeep(userInitialState),
      transactions: safeCloneDeep(transactionsInitialState),
      lists: safeCloneDeep(listsInitialState),
      profile: safeCloneDeep(profileInitialState),
    },
  }),
})

store.dispatch(updateVersion())

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch()

export default store
