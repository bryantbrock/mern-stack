import {createSlice} from '@reduxjs/toolkit'
import {Auth} from 'app/auth'
import {api} from 'app/api'

const initialState = {
  isLoading: false,
  error: null,
  transactions: [],
  summary: {
    overUnder: 0,
    income: 0,
    expenses: 0,
  },
}

export const Finances = createSlice({
  name: 'finances',
  initialState,
  reducers: {
    isLoading: state => ({...state, isLoading: true, error: null}),
    error: (state, action) => ({...state, error: action.payload}),
    loadSummary: (state, action) => ({...state, summary: action.payload}),
    loadTransactions: (state, action) => ({
      ...state,
      transactions: action.payload,
    }),
  }
})

// Actions
export const addBankToken = (user, tokens, metadata) => async dispatch => {
  try {
    const newToken = {
      ...tokens,
      institution: metadata.institution.name,
    }

    await api.post(`/add-bank-token/${user.uid}`, newToken)

    const modifiedToken = {institution: newToken.institution}

    dispatch(Auth.actions.loadUser({
      ...user,
      bankTokens: [...user.bankTokens, modifiedToken],
    }))
  } catch (err) {
    dispatch(Finances.actions.error(err))
  }
}

export const getLinkToken = uid => async dispatch => {
  let res
  try {
    res = await api.post(`/create-link-token/${uid}`)

  } catch (err) {
    dispatch(Finances.actions.error(err))
  }

  return res.data.linkToken
}

export const getModifyLinkToken = uid => async dispatch => {
  let res
  try {
    res = await api.post(`/modify-link-token/${uid}`, {institution: 'Wells Fargo'})

  } catch (err) {
    dispatch(Finances.actions.error(err))
  }

  console.log(res)

  return res.data.linkToken
}

const summarize = data => {
  let overUnder = 0
  let income = 0
  let expenses = 0

  data.map(datum => datum.summary)
    .forEach(sum => {
      overUnder += sum.overUnder
      income += sum.income
      expenses += sum.expenses
    })

  return {overUnder, income, expenses}
}

export const loadBankTransactions = uid => async dispatch => {
  try {
    const {data} = await api.get(`/transactions/${uid}`)

    dispatch(Finances.actions.loadSummary(summarize(data)))
    dispatch(Finances.actions.loadTransactions(data))
  } catch (err) {
    if(err.response){
      dispatch(Finances.actions.error(err.response.data))
    } else {
      dispatch(Finances.actions.error({message: 'Failed to record error.'}))
    }
  }
}



export default Finances