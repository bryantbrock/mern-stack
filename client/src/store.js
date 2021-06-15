import reducer from 'app/reducers'
import {configureStore} from '@reduxjs/toolkit'

const thunk = store => next => action =>
  typeof action === 'function'
    ? action(store.dispatch, store.getState)
    : next(action)

const middleware = [thunk]

export const store = configureStore({reducer, middleware})